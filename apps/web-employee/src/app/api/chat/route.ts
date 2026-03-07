import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

function validateHistory(history: unknown): HistoryMessage[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (msg): msg is HistoryMessage =>
        typeof msg === 'object' &&
        msg !== null &&
        (msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string' &&
        msg.content.length <= MAX_MESSAGE_LENGTH
    )
    .slice(-MAX_HISTORY_LENGTH);
}

// ─── POST Handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

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
    const body = await request.json();
    const { message, sessionId, history } = body;

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

    // Validate and convert conversation history for Gemini format
    const validHistory = validateHistory(history);
    const geminiHistory = validHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }],
    }));

    // Call Gemini API with conversation history
    const { answer, sourcesUsed, flagged } = await askGemini(message, geminiHistory);

    // Log to Supabase (non-blocking)
    const logPromise = supabase.from('chat_transcripts').insert({
      session_id: sessionId || 'anonymous',
      user_message: message,
      bot_response: answer,
      sources_used: sourcesUsed,
      metadata: {
        timestamp: new Date().toISOString(),
        user_agent: request.headers.get('user-agent') || 'unknown',
        flagged,
        ip_hash: ip ? Buffer.from(ip).toString('base64').slice(0, 12) : 'unknown',
      },
    });

    // Also upsert the session record
    const sessionPromise = supabase.from('chat_sessions').upsert(
      {
        session_id: sessionId || 'anonymous',
        status: flagged ? 'flagged' : 'active',
        updated_at: new Date().toISOString(),
      },
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
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'Something went wrong. Please try again or contact HR at 800-890-5420.',
        answer: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or contact HR directly at 800-890-5420 for immediate assistance.",
      },
      { status: 500 }
    );
  }
}
