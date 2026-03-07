'use client';

import { ExternalLink } from 'lucide-react';
import { quickLinks } from '@/data/quick-links';
import { getIcon } from '@/lib/icons';
import { ScrollFadeIn } from './ScrollFadeIn';
import { quickLinkIconImages } from '@/lib/image-manifest';

export function QuickLinksGrid() {
  return (
    <section id="quick-links" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Quick Links
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access your most-used benefits tools and portals in one place.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => {
            const IconComponent = getIcon(link.icon);
            const customIcon = quickLinkIconImages[link.label];

            return (
              <ScrollFadeIn key={link.label} delay={index * 100}>
                <a
                  href={link.url}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group block bg-white border border-gray-200 p-6 hover:scale-[1.02] hover:bg-brand-surface transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                      {customIcon ? (
                        <img
                          src={customIcon}
                          alt=""
                          className="w-10 h-10 object-contain"
                          aria-hidden="true"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-tobie-50 flex items-center justify-center group-hover:bg-tobie-100 transition-colors">
                          <IconComponent className="h-6 w-6 text-tobie-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-tobie-600 transition-colors">
                          {link.label}
                        </h3>
                        <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-tobie-500 transition-colors flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </a>
              </ScrollFadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
