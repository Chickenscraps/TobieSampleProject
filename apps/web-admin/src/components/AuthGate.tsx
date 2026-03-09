'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

// ─── Security: SHA-256 hash of admin password ─────────────────────────────────
// To change the password, generate a new SHA-256 hash:
//   echo -n "YourNewPassword" | shasum -a 256
// Then replace the hash below.
const ADMIN_PASSWORD_HASH = '6a91e63aae7e6c3d6a3dd815c8d8d58210404468289ad8895703b10f6e4d52b3';

const AUTH_SESSION_KEY = 'tobie_admin_authenticated';
const AUTH_TIMESTAMP_KEY = 'tobie_admin_auth_ts';
const SESSION_TTL_MS = 30 * 60 * 1000; // 30-minute session timeout
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 300_000; // 5 minutes
const LOCKOUT_KEY = 'tobie_admin_lockout';
const ATTEMPTS_KEY = 'tobie_admin_attempts';

// ─── SHA-256 Hashing (Web Crypto API) ─────────────────────────────────────────
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Timing-safe comparison to prevent timing attacks ─────────────────────────
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// ─── Session Validation with TTL ─────────────────────────────────────────────
function isSessionValid(): boolean {
  try {
    const authed = sessionStorage.getItem(AUTH_SESSION_KEY);
    const ts = parseInt(sessionStorage.getItem(AUTH_TIMESTAMP_KEY) || '0', 10);
    if (authed !== 'true' || !ts) return false;
    // Check session hasn't expired
    return Date.now() - ts < SESSION_TTL_MS;
  } catch {
    return false;
  }
}

function refreshSession(): void {
  try {
    sessionStorage.setItem(AUTH_TIMESTAMP_KEY, String(Date.now()));
  } catch {
    // sessionStorage not available
  }
}

function clearSession(): void {
  try {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_TIMESTAMP_KEY);
  } catch {
    // sessionStorage not available
  }
}

// ─── Lockout Management ───────────────────────────────────────────────────────
function getLockoutState(): { locked: boolean; remainingMs: number } {
  try {
    const lockoutUntil = parseInt(sessionStorage.getItem(LOCKOUT_KEY) || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      return { locked: true, remainingMs: lockoutUntil - now };
    }
    return { locked: false, remainingMs: 0 };
  } catch {
    return { locked: false, remainingMs: 0 };
  }
}

function getAttemptCount(): number {
  try {
    return parseInt(sessionStorage.getItem(ATTEMPTS_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function incrementAttempts(): number {
  const count = getAttemptCount() + 1;
  try {
    sessionStorage.setItem(ATTEMPTS_KEY, String(count));
    if (count >= MAX_ATTEMPTS) {
      sessionStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_DURATION));
    }
  } catch {
    // sessionStorage not available
  }
  return count;
}

function resetAttempts(): void {
  try {
    sessionStorage.removeItem(ATTEMPTS_KEY);
    sessionStorage.removeItem(LOCKOUT_KEY);
  } catch {
    // sessionStorage not available
  }
}

// ─── Auth Gate Component ──────────────────────────────────────────────────────
export function AuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Check existing session on mount (with TTL validation)
  useEffect(() => {
    const valid = isSessionValid();
    setIsAuthenticated(valid);
    if (valid) refreshSession(); // extend on activity
    if (!valid) clearSession(); // clean up expired sessions
    setIsLoading(false);
  }, []);

  // Session expiry check — auto-logout when TTL expires
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      if (!isSessionValid()) {
        setIsAuthenticated(false);
        clearSession();
      }
    }, 60_000); // check every minute
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Refresh session on user activity (extends the 30-min window)
  useEffect(() => {
    if (!isAuthenticated) return;
    const handleActivity = () => refreshSession();
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [isAuthenticated]);

  // Lockout timer
  useEffect(() => {
    const { locked, remainingMs } = getLockoutState();
    setIsLocked(locked);
    setLockoutRemaining(Math.ceil(remainingMs / 1000));

    if (locked) {
      const interval = setInterval(() => {
        const state = getLockoutState();
        setIsLocked(state.locked);
        setLockoutRemaining(Math.ceil(state.remainingMs / 1000));
        if (!state.locked) {
          resetAttempts();
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLocked]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isLocked) return;

    setIsSubmitting(true);
    setError('');

    // Security: add artificial delay to slow brute-force attempts
    await new Promise(r => setTimeout(r, 300 + Math.random() * 200));

    try {
      const hash = await hashPassword(password);

      // Use timing-safe comparison to prevent timing attacks
      if (timingSafeEqual(hash, ADMIN_PASSWORD_HASH)) {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
        sessionStorage.setItem(AUTH_TIMESTAMP_KEY, String(Date.now()));
        resetAttempts();
        setIsAuthenticated(true);
      } else {
        const attempts = incrementAttempts();
        const remaining = MAX_ATTEMPTS - attempts;

        if (remaining <= 0) {
          setIsLocked(true);
          setError('Too many failed attempts. Locked out for 5 minutes.');
        } else {
          setError(`Incorrect password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
        }
        setPassword('');
      }
    } catch {
      setError('Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [password, isSubmitting, isLocked]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-tobie-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Authenticated — render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Login screen
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-tobie-100 dark:bg-tobie-900/50 mb-4">
            <ShieldCheck className="w-8 h-8 text-tobie-600" />
          </div>
          <h1 className="text-2xl font-bold text-tobie-700 dark:text-white">Tobie Admin</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Benefits AI Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Admin Access
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={isLocked || isSubmitting}
                  autoFocus
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tobie-400 focus:border-tobie-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:text-gray-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Lockout Timer */}
            {isLocked && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                <Lock className="w-4 h-4 flex-shrink-0" />
                <span>
                  Locked out. Try again in {Math.floor(lockoutRemaining / 60)}:{String(lockoutRemaining % 60).padStart(2, '0')}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLocked || isSubmitting || !password.trim()}
              className="w-full py-2.5 px-4 bg-tobie-600 text-white text-sm font-semibold hover:bg-tobie-700 focus:outline-none focus:ring-2 focus:ring-tobie-400 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Session Info */}
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
            Sessions expire after 30 minutes of inactivity.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          &copy; 2026 Tobie Benefits &middot; Secure Admin Portal
        </p>
      </div>
    </div>
  );
}
