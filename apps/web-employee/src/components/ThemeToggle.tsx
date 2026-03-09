'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    return (localStorage.getItem('tobie_theme') as Theme) || 'system';
  } catch {
    return 'system';
  }
}

function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function applyTheme(theme: Theme) {
  const resolved = getResolvedTheme(theme);
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  try {
    localStorage.setItem('tobie_theme', theme);
  } catch {}
}

/**
 * Client-only theme toggle. Uses next/dynamic with ssr:false
 * so it never server-renders (avoiding hydration mismatches
 * from localStorage / matchMedia).
 */
function ThemeToggleClient() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  // Apply on every theme change
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for OS-level theme changes when in "system" mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (getStoredTheme() === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const cycleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  const resolved = getResolvedTheme(theme);
  const Icon = theme === 'system' ? Monitor : resolved === 'dark' ? Moon : Sun;
  const label = theme === 'system' ? 'System' : resolved === 'dark' ? 'Dark' : 'Light';

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
      title={`Theme: ${label}`}
      aria-label={`Current theme: ${label}. Click to change.`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export const ThemeToggle = dynamic(() => Promise.resolve(ThemeToggleClient), {
  ssr: false,
  loading: () => <div className="w-9 h-9" aria-hidden />,
});
