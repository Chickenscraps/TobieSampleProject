import { ExternalLink } from 'lucide-react';
import { ScrollFadeIn } from './ScrollFadeIn';
import { SectionIllustration } from './SectionIllustration';
import { searchCareIllustration } from '@/lib/image-manifest';

export function SearchCare() {
  return (
    <section id="find-care" className="py-16 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Illustration */}
            <div className="flex-shrink-0 w-full md:w-5/12">
              <SectionIllustration
                illustration={searchCareIllustration}
                variant="ctaBlock"
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Find Care Near You
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Use the BCBS provider search to find in-network doctors,
                specialists, hospitals, and facilities. Staying in-network means
                lower out-of-pocket costs and better coverage. You can also
                search for dental providers through Delta Dental and vision
                providers through VSP.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <a
                  href="https://www.bcbs.com/find-a-doctor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-tobie-600 text-white font-semibold hover:bg-tobie-700 transition-colors"
                >
                  Find a Medical Provider
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="https://www.deltadental.com/find-a-dentist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Find a Dentist
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <a
                href="https://www.vsp.com/find-eye-doctors"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-tobie-600 font-medium hover:underline justify-center md:justify-start"
              >
                Find a Vision Provider
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
