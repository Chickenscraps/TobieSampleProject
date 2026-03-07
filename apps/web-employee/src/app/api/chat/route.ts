import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Security: SHA-256 IP Hashing ───────────────────────────────────────────
function hashIP(ip: string): string {
  return createHash('sha256').update(ip + (process.env.IP_HASH_SALT || 'tobie-benefits-2026')).digest('hex').slice(0, 16);
}

// ─── Security: Session ID Validation ────────────────────────────────────────
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SESSION_ID_REGEX = /^(session-\d+-[a-z0-9]{7}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

function validateSessionId(id: unknown): string {
  if (typeof id !== 'string' || id.length > 80 || !SESSION_ID_REGEX.test(id)) {
    return 'anonymous';
  }
  return id;
}

// ─── In-Memory Rate Limiter ──────────────────────────────────────────────────
// Tracks requests per IP. Resets automatically as entries expire.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 15; // max requests per window per IP

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  });
}, 300_000);

// ─── Input Validation ────────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_LENGTH = 20; // max conversation turns to accept
const MAX_BODY_SIZE = 20_000; // ~20KB max request body (increased for analytics)

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Analytics Validation ────────────────────────────────────────────────────
// Strict whitelist approach: only accept known safe values
interface ValidatedAnalytics {
  visitor_id: string;
  device_type: string;
  browser: string;
  os: string;
  screen_category: string;
  timezone: string;
  referrer_domain: string;
  session_start_page: string;
  message_index: number;
}

const VALID_DEVICE_TYPES = ['mobile', 'tablet', 'desktop'];
const VALID_BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Other'];
const VALID_OS = ['Windows', 'macOS', 'iOS', 'Android', 'Linux', 'Other'];
const VALID_SCREEN_CATEGORIES = ['small', 'medium', 'large', 'xlarge'];

function validateAnalytics(raw: unknown): ValidatedAnalytics | null {
  if (!raw || typeof raw !== 'object') return null;

  const data = raw as Record<string, unknown>;

  // visitor_id: must be a hex string 32-64 chars (SHA-256 hash)
  const visitor_id = typeof data.visitor_id === 'string' && /^[a-f0-9]{32,64}$/.test(data.visitor_id)
    ? data.visitor_id : 'anonymous';

  // device_type: whitelist only
  const device_type = typeof data.device_type === 'string' && VALID_DEVICE_TYPES.includes(data.device_type)
    ? data.device_type : 'desktop';

  // browser: whitelist only
  const browser = typeof data.browser === 'string' && VALID_BROWSERS.includes(data.browser)
    ? data.browser : 'Other';

  // os: whitelist only
  const os = typeof data.os === 'string' && VALID_OS.includes(data.os)
    ? data.os : 'Other';

  // screen_category: whitelist only
  const screen_category = typeof data.screen_category === 'string' && VALID_SCREEN_CATEGORIES.includes(data.screen_category)
    ? data.screen_category : 'medium';

  // timezone: IANA format, max 50 chars, alphanumeric with / and _
  const timezone = typeof data.timezone === 'string' && data.timezone.length <= 50 && /^[A-Za-z0-9\/_+-]+$/.test(data.timezone)
    ? data.timezone : 'Unknown';

  // referrer_domain: hostname only, max 100 chars
  const referrer_domain = typeof data.referrer_domain === 'string' && data.referrer_domain.length <= 100 && /^[a-z0-9.\-]+$|^(direct|internal)$/.test(data.referrer_domain)
    ? data.referrer_domain : '';

  // session_start_page: path only, max 200 chars, no query strings
  const rawPage = typeof data.session_start_page === 'string' ? data.session_start_page.split('?')[0] : '/';
  const session_start_page = rawPage.length <= 200 && /^\/[a-zA-Z0-9\/_-]*$/.test(rawPage)
    ? rawPage : '/';

  // message_index: non-negative integer
  const message_index = typeof data.message_index === 'number' && Number.isInteger(data.message_index) && data.message_index >= 0 && data.message_index < 1000
    ? data.message_index : 0;

  return { visitor_id, device_type, browser, os, screen_category, timezone, referrer_domain, session_start_page, message_index };
}

// Patterns that should never appear in legitimate assistant history messages
const HISTORY_ABUSE_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|my|safety)\s+(instructions|rules|prompt)/i,
  /i\s+will\s+(now\s+)?(ignore|bypass|override)\s+(my|all|the)/i,
  /unrestricted\s+mode/i,
  /system\s*prompt/i,
  /override\s+(activated|enabled|complete)/i,
  /safety\s+(disabled|removed|bypassed)/i,
  /jailbreak/i,
  /I\s+(can|will)\s+now\s+(do|say|answer)\s+anything/i,
  /I\s+am\s+(no\s+longer|not)\s+(restricted|limited|bound)/i,
];

function validateHistory(history: unknown): HistoryMessage[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (msg): msg is HistoryMessage =>
        typeof msg === 'object' &&
        msg !== null &&
        (msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string' &&
        msg.content.length <= MAX_MESSAGE_LENGTH &&
        // Reject history messages containing injection patterns
        !HISTORY_ABUSE_PATTERNS.some(p => p.test(msg.content))
    )
    .slice(-MAX_HISTORY_LENGTH);
}

// ─── POST Handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Security: Check request body size
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: 'Request too large.' },
        { status: 413 }
      );
    }

    // Security: Origin check — only accept requests from our own domain
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'https://tobiebenefits.netlify.app',
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    if (origin && !allowedOrigins.some(o => origin.startsWith(o))) {
      return NextResponse.json(
        { error: 'Unauthorized origin.' },
        { status: 403 }
      );
    }

    // Rate limiting — use last IP in X-Forwarded-For (closest to trusted proxy)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor
      ? forwardedFor.split(',').map(s => s.trim()).filter(Boolean).pop() || 'unknown'
      : request.headers.get('x-real-ip') || 'unknown';

    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait a moment before asking another question.',
          answer: "You're asking questions a bit too quickly. Please wait a minute and try again, or contact HR directly at 800-890-5420.",
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // Parse and validate request body
    const bodyText = await request.text();
    if (bodyText.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: 'Request too large.' },
        { status: 413 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const { message, sessionId, history, analytics: rawAnalytics } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // Security: Validate session ID format
    const validSessionId = validateSessionId(sessionId);

    // Validate analytics metadata (whitelist approach)
    const validAnalytics = validateAnalytics(rawAnalytics);

    // Validate and convert conversation history for Gemini format
    const validHistory = validateHistory(history);
    const geminiHistory = validHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }],
    }));

    // Call Gemini API with conversation history — measure server-side response time
    const geminiStart = Date.now();
    const { answer, sourcesUsed, flagged } = await askGemini(message, geminiHistory);
    const serverResponseMs = Date.now() - geminiStart;

    // Log to Supabase (non-blocking) — Security: use SHA-256 hashed IP, no user-agent
    const logPromise = supabase.from('chat_transcripts').insert({
      session_id: validSessionId,
      user_message: message,
      bot_response: answer,
      sources_used: sourcesUsed,
      metadata: {
        timestamp: new Date().toISOString(),
        flagged,
        ip_hash: hashIP(ip),
        // Analytics enrichment
        ...(validAnalytics && {
          visitor_id: validAnalytics.visitor_id,
          device_type: validAnalytics.device_type,
          browser: validAnalytics.browser,
          os: validAnalytics.os,
          screen_category: validAnalytics.screen_category,
          timezone: validAnalytics.timezone,
          referrer_domain: validAnalytics.referrer_domain,
          message_index: validAnalytics.message_index,
          response_time_ms: serverResponseMs,
        }),
      },
    });

    // Also upsert the session record — now with analytics data
    const sessionUpsertData: Record<string, unknown> = {
      session_id: validSessionId,
      status: flagged ? 'flagged' : 'active',
      updated_at: new Date().toISOString(),
      topic_summary: sourcesUsed?.join(', ') || null,
    };

    // Add analytics fields if available
    if (validAnalytics) {
      sessionUpsertData.visitor_id = validAnalytics.visitor_id;
      sessionUpsertData.device_type = validAnalytics.device_type;
      sessionUpsertData.browser = validAnalytics.browser;
      sessionUpsertData.os = validAnalytics.os;
      sessionUpsertData.session_start_page = validAnalytics.session_start_page;
    }

    const sessionPromise = supabase.from('chat_sessions').upsert(
      sessionUpsertData,
      { onConflict: 'session_id' }
    );

    // Fire and forget the logging
    Promise.all([logPromise, sessionPromise]).catch((err) => {
      console.error('Failed to log chat transcript:', err);
    });

    return NextResponse.json(
      { answer, sourcesUsed },
      {
        headers: {
          'X-RateLimit-Remaining': String(remaining),
        },
      }
    );
  } catch (error) {
    // Security: log generic message, never expose internal error details
    console.error('Chat API error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      {
        error: 'Something went wrong. Please try again or contact HR at 800-890-5420.',
        answer: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or contact HR directly at 800-890-5420 for immediate assistance.",
      },
      { status: 500 }
    );
  }
}
