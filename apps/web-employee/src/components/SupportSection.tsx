import { Phone, ExternalLink, MessageCircle } from 'lucide-react';
import { ScrollFadeIn } from './ScrollFadeIn';
import { SectionIllustration } from './SectionIllustration';
import { supportIllustration } from '@/lib/image-manifest';

export function SupportSection() {
  return (
    <section id="support" className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-950 border-t-4 border-accent/30 dark:border-accent/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
            {/* Illustration */}
            <div className="flex-shrink-0 w-full md:w-5/12">
              <SectionIllustration
                illustration={supportIllustration}
                variant="ctaBlock"
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Need Help? We&rsquo;re Here for You
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Whether you have questions about your coverage, need help
                navigating enrollment, or want to understand a claim, our
                support team is ready to assist. You can also use the AI
                Benefits Assistant for quick answers anytime.
              </p>

              <div className="space-y-3 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-9 h-9 bg-tobie-50 dark:bg-tobie-900/30 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-tobie-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        HR Solutions Center
                      </p>
                      <a
                        href="tel:8008905420"
                        className="text-sm text-tobie-600 dark:text-tobie-300 hover:underline"
                      >
                        800-890-5420
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-9 h-9 bg-tobie-50 dark:bg-tobie-900/30 flex items-center justify-center flex-shrink-0">
                      <ExternalLink className="h-4 w-4 text-tobie-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ServiceNow Portal
                      </p>
                      <a
                        href="https://servicenow.example.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-tobie-600 dark:text-tobie-300 hover:underline"
                      >
                        Submit a support ticket
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-9 h-9 bg-tobie-50 dark:bg-tobie-900/30 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-4 w-4 text-tobie-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        AI Benefits Assistant
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Available 24/7 in the chat panel
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
