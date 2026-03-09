import { ExternalLink, Calendar } from 'lucide-react';
import { ScrollFadeIn } from './ScrollFadeIn';
import { SectionIllustration } from './SectionIllustration';
import { enrollmentCtaIllustration } from '@/lib/image-manifest';

export function EnrollmentCTA() {
  return (
    <section id="enrollment" className="py-16 sm:py-20 bg-gradient-to-br from-tobie-600 to-tobie-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Illustration */}
            <div className="flex-shrink-0 w-full md:w-5/12">
              <SectionIllustration
                illustration={enrollmentCtaIllustration}
                variant="ctaBlock"
                className="drop-shadow-lg brightness-110"
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white mb-4">
                <Calendar className="h-3.5 w-3.5" />
                Open Enrollment 2026
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Ready to Enroll?
              </h2>
              <p className="text-tobie-100 leading-relaxed mb-6">
                Access the Infor enrollment portal to review your current
                elections, make changes, or enroll for the first time. Have your
                dependent information and any qualifying life event documentation
                ready before you begin.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <a
                  href="https://infinium.tobie.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold btn-press"
                >
                  Open Enrollment Portal
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="#faq"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/40 text-white font-medium hover:bg-white/10 btn-press"
                >
                  Enrollment FAQ
                </a>
              </div>

              <p className="mt-4 text-xs text-tobie-200">
                Coverage effective January 1, 2026 &middot; Changes cannot be
                made after the enrollment window closes
              </p>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
