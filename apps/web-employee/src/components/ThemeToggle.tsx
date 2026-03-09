'use client';

import { useEffect, useState, useCallback } from 'react';
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
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
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

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getStoredTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (getStoredTheme() === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, mounted]);

  const cycleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const resolved = getResolvedTheme(theme);
  const Icon = theme === 'system' ? Monitor : resolved === 'dark' ? Moon : Sun;
  const label = theme === 'system' ? 'System' : resolved === 'dark' ? 'Dark' : 'Light';

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
      title={`Theme: ${label}`}
      aria-label={`Current theme: ${label}. Click to change.`}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}
