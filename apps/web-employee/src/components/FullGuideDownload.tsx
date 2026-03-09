import { FileText } from 'lucide-react';
import { ScrollFadeIn } from './ScrollFadeIn';
import { SectionIllustration } from './SectionIllustration';
import { downloadGuideIllustration } from '@/lib/image-manifest';

export function FullGuideDownload() {
  return (
    <section id="guide-download" className="py-16 sm:py-20 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollFadeIn>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 sm:p-12">
            <SectionIllustration
              illustration={downloadGuideIllustration}
              variant="ctaBlock"
              className="mb-6"
              imgClassName="w-full max-w-[280px] sm:max-w-sm mx-auto object-contain"
            />

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Full Benefits Guide
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-lg mx-auto">
              Download the complete 2026 Tobie Benefits Guide for detailed plan
              information, rate tables, provider networks, and enrollment
              instructions. Keep it handy as a reference throughout the year.
            </p>

            <a
              href="/documents/2026-Tobie-Benefits-Guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-tobie-600 dark:bg-tobie-500 text-white font-semibold hover:bg-tobie-700 dark:hover:bg-tobie-600 btn-press"
            >
              <FileText className="h-5 w-5" />
              Download Benefits Guide (PDF)
            </a>

            <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
              PDF format &middot; Updated for the 2026 plan year
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
