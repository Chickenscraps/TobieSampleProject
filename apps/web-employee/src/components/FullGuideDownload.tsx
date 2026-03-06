import { FileText } from 'lucide-react';
import { ScrollFadeIn } from './ScrollFadeIn';

export function FullGuideDownload() {
  return (
    <section id="guide-download" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollFadeIn>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm">
            <div className="w-16 h-16 bg-tobie-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-tobie-600" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Full Benefits Guide
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-lg mx-auto">
              Download the complete 2026 Tobie Benefits Guide for detailed plan
              information, rate tables, provider networks, and enrollment
              instructions. Keep it handy as a reference throughout the year.
            </p>

            <a
              href="/documents/2026-Tobie-Benefits-Guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-tobie-600 to-tobie-700 text-white font-semibold rounded-lg shadow-md hover:from-tobie-700 hover:to-tobie-800 hover:shadow-lg transition-all duration-200"
            >
              <FileText className="h-5 w-5" />
              Download Benefits Guide (PDF)
            </a>

            <p className="mt-4 text-xs text-gray-400">
              PDF format &middot; Updated for the 2026 plan year
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
