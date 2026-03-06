import { Phone, Mail, ExternalLink } from 'lucide-react';
import { ScrollFadeIn } from './ScrollFadeIn';

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Benefits, Your Way
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At Tobie, we invest in a comprehensive benefits package because we
              know that when you and your family feel secure and supported, you
              can bring your best self to work every day. This guide is your
              resource for understanding and making the most of what&rsquo;s
              available to you.
            </p>
          </div>
        </ScrollFadeIn>

        {/* HR Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <ScrollFadeIn delay={100}>
            <div className="bg-tobie-50 border border-tobie-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-tobie-500 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Benefits Support
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                General benefits questions, enrollment assistance, life event
                changes, and plan information.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-tobie-500" />
                  <a
                    href="tel:8008905420"
                    className="text-tobie-600 font-medium hover:underline"
                  >
                    800-890-5420
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4 text-tobie-500" />
                  <a
                    href="https://servicenow.example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tobie-600 font-medium hover:underline"
                  >
                    Submit a ServiceNow Ticket
                  </a>
                </div>
              </div>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={200}>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  IT Service Desk
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Technical support for the Infor enrollment portal, password
                resets, and benefits system access issues.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a
                    href="tel:8669668268"
                    className="text-tobie-600 font-medium hover:underline"
                  >
                    866-966-8268
                  </a>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  );
}
