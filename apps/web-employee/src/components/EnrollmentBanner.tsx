'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export function EnrollmentBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      id="enrollment-banner"
      className="relative w-full bg-tobie-500 dark:bg-tobie-600 text-white py-2.5 px-4 text-center z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <p className="text-sm font-medium tracking-wide">
          Welcome to Open Enrollment 2026 &mdash;{' '}
          <a
            href="#benefits-overview"
            className="underline underline-offset-2 hover:text-tobie-100 transition-colors font-semibold"
          >
            View Info Here
          </a>
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 transition-colors"
          aria-label="Dismiss enrollment banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
