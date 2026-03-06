'use client';

import { useState, useMemo } from 'react';
import { Search, Phone, Globe, ExternalLink } from 'lucide-react';
import { providers } from '@/data/contacts';
import { ScrollFadeIn } from './ScrollFadeIn';

export function ProviderDirectory() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = useMemo(() => {
    if (!searchQuery.trim()) return providers;
    const query = searchQuery.toLowerCase();
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Group providers by category
  const groupedProviders = useMemo(() => {
    const groups: Record<string, typeof providers> = {};
    filteredProviders.forEach((provider) => {
      if (!groups[provider.category]) {
        groups[provider.category] = [];
      }
      groups[provider.category].push(provider);
    });
    return groups;
  }, [filteredProviders]);

  return (
    <section id="contacts" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Provider &amp; Contact Directory
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find contact information for all benefit carriers and support
              resources.
            </p>
          </div>
        </ScrollFadeIn>

        {/* Search Input */}
        <ScrollFadeIn delay={100}>
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search providers, categories, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-tobie-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </ScrollFadeIn>

        {/* Provider Cards by Category */}
        {Object.keys(groupedProviders).length === 0 ? (
          <p className="text-center text-gray-500">
            No providers found matching your search.
          </p>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedProviders).map(([category, categoryProviders]) => (
              <ScrollFadeIn key={category}>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-tobie-500 rounded-full" />
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryProviders.map((provider) => (
                      <div
                        key={provider.name}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-tobie-200 transition-all duration-300"
                      >
                        <h4 className="text-base font-semibold text-gray-900 mb-1">
                          {provider.name}
                        </h4>
                        {provider.description && (
                          <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                            {provider.description}
                          </p>
                        )}
                        <div className="space-y-2">
                          {provider.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-tobie-500 flex-shrink-0" />
                              <a
                                href={`tel:${provider.phone.replace(/[^0-9]/g, '')}`}
                                className="text-tobie-600 font-medium hover:underline"
                              >
                                {provider.phone}
                              </a>
                            </div>
                          )}
                          {provider.website && (
                            <div className="flex items-center gap-2 text-sm">
                              <Globe className="h-4 w-4 text-tobie-500 flex-shrink-0" />
                              <a
                                href={provider.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-tobie-600 font-medium hover:underline inline-flex items-center gap-1"
                              >
                                Website
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
