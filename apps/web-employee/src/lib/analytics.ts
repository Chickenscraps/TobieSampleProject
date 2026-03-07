// ─── Anonymous Analytics Utilities ───────────────────────────────────────────
// Privacy-safe client-side analytics. No PII stored.
// Only categorical data: device type, browser name, OS name, etc.

const VISITOR_ID_KEY = 'tobie_visitor_id';

// ─── Visitor ID (anonymous, persistent across sessions) ─────────────────────
// Generates a random ID, SHA-256 hashes it, stores hash in localStorage.
// The hash is what gets sent to Supabase — never the raw ID.
export async function getOrCreateVisitorId(): Promise<string> {
  if (typeof window === 'undefined') return 'server';

  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing && /^[a-f0-9]{32,64}$/.test(existing)) {
      return existing;
    }

    // Generate new visitor ID
    const rawId = window.crypto?.randomUUID?.()
      || `${Date.now()}-${Math.random().toString(36).substring(2)}`;

    // SHA-256 hash it for privacy
    const encoder = new TextEncoder();
    const data = encoder.encode(rawId + '-tobie-analytics');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Store only the hash
    localStorage.setItem(VISITOR_ID_KEY, hash);
    return hash;
  } catch {
    return 'anonymous';
  }
}

// Synchronous version using cached value (for immediate use after first async call)
export function getVisitorIdSync(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    return localStorage.getItem(VISITOR_ID_KEY) || 'anonymous';
  } catch {
    return 'anonymous';
  }
}

// ─── Device Type ────────────────────────────────────────────────────────────
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

// ─── Browser Name (parsed from UA, NOT storing full UA) ─────────────────────
export function getBrowserName(): string {
  if (typeof navigator === 'undefined') return 'Other';
  const ua = navigator.userAgent;
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  return 'Other';
}

// ─── OS Name (parsed from UA, NOT storing full UA) ──────────────────────────
export function getOSName(): string {
  if (typeof navigator === 'undefined') return 'Other';
  const ua = navigator.userAgent;
  if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod')) return 'iOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Mac OS X') || ua.includes('Macintosh')) return 'macOS';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Linux') && !ua.includes('Android')) return 'Linux';
  return 'Other';
}

// ─── Screen Size Category ───────────────────────────────────────────────────
export function getScreenCategory(): 'small' | 'medium' | 'large' | 'xlarge' {
  if (typeof window === 'undefined') return 'large';
  const w = window.screen?.width || window.innerWidth;
  if (w < 640) return 'small';
  if (w < 1024) return 'medium';
  if (w < 1440) return 'large';
  return 'xlarge';
}

// ─── Timezone ───────────────────────────────────────────────────────────────
export function getTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

// ─── Referrer Domain (hostname only, NOT full URL) ──────────────────────────
export function getReferrerDomain(): string {
  if (typeof document === 'undefined') return '';
  try {
    const ref = document.referrer;
    if (!ref) return 'direct';
    const url = new URL(ref);
    // Don't count self-referrals
    if (url.hostname === window.location.hostname) return 'internal';
    return url.hostname;
  } catch {
    return '';
  }
}

// ─── Collect All Metadata ───────────────────────────────────────────────────
export interface AnalyticsMetadata {
  visitor_id: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  screen_category: string;
  timezone: string;
  referrer_domain: string;
  session_start_page: string;
}

export function collectAnalyticsMetadata(): AnalyticsMetadata {
  return {
    visitor_id: getVisitorIdSync(),
    device_type: getDeviceType(),
    browser: getBrowserName(),
    os: getOSName(),
    screen_category: getScreenCategory(),
    timezone: getTimezone(),
    referrer_domain: getReferrerDomain(),
    session_start_page: typeof window !== 'undefined' ? window.location.pathname : '/',
  };
}

// ─── Initialize (call once on app mount to generate visitor ID async) ───────
export async function initAnalytics(): Promise<void> {
  await getOrCreateVisitorId();
}
