'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { collectAnalyticsMetadata, initAnalytics } from '@/lib/analytics';

export function PageAnalyticsTracker() {
  const pathname = usePathname();
  const initialized = useRef(false);
  const lastTrackedPath = useRef('');

  // Initialize visitor ID on first mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initAnalytics();
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    // Debounce: don't re-track the same path
    if (pathname === lastTrackedPath.current) return;
    lastTrackedPath.current = pathname;

    // Small delay to ensure visitor ID is ready
    const timer = setTimeout(() => {
      const metadata = collectAnalyticsMetadata();

      // Fire-and-forget page view insert
      supabase.from('page_analytics').insert({
        visitor_id: metadata.visitor_id,
        page_path: pathname,
        device_type: metadata.device_type,
        browser: metadata.browser,
        os: metadata.os,
        screen_category: metadata.screen_category,
        timezone: metadata.timezone,
        referrer_domain: metadata.referrer_domain,
      }).then(({ error }) => {
        if (error) console.error('Page analytics error:', error.message);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null; // renders nothing
}
