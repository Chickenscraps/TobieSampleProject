'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Phone,
  Globe,
  ExternalLink,
  Heart,
  Pill,
  SmilePlus,
  Eye,
  Wallet,
  Shield,
  Scale,
  PiggyBank,
  Leaf,
  Users,
  Gift,
} from 'lucide-react';
import { providers } from '@/data/contacts';
import { ScrollFadeIn } from './ScrollFadeIn';
import { SectionIllustration } from './SectionIllustration';
import { providerDirectoryIllustration } from '@/lib/image-manifest';

// ─── Category config ─────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { label: string; icon: typeof Heart; color: string }> = {
  medical:    { label: 'Medical',     icon: Heart,     color: 'bg-blue-50 text-blue-600 border-blue-200' },
  pharmacy:   { label: 'Pharmacy',    icon: Pill,      color: 'bg-green-50 text-green-600 border-green-200' },
  dental:     { label: 'Dental',      icon: SmilePlus, color: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
  vision:     { label: 'Vision',      icon: Eye,       color: 'bg-purple-50 text-purple-600 border-purple-200' },
  financial:  { label: 'Financial',   icon: Wallet,    color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  insurance:  { label: 'Insurance',   icon: Shield,    color: 'bg-orange-50 text-orange-600 border-orange-200' },
  legal:      { label: 'Legal',       icon: Scale,     color: 'bg-amber-50 text-amber-600 border-amber-200' },
  retirement: { label: 'Retirement',  icon: PiggyBank, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  wellbeing:  { label: 'Wellbeing',   icon: Leaf,      color: 'bg-lime-50 text-lime-600 border-lime-200' },
  'work-life':{ label: 'Work-Life',   icon: Users,     color: 'bg-teal-50 text-teal-600 border-teal-200' },
  voluntary:  { label: 'Voluntary',   icon: Gift,      color: 'bg-rose-50 text-rose-600 border-rose-200' },
};

// Derive ordered category list from the actual provider data
const ALL_CATEGORIES = Object.keys(CATEGORY_META);

export function ProviderDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Categories that actually have providers
  const availableCategories = useMemo(() => {
    const cats = new Set(providers.map((p) => p.category));
    return ALL_CATEGORIES.filter((c) => cats.has(c));
  }, []);

  const filteredProviders = useMemo(() => {
    let result = providers;

    // Filter by active category tab
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
    }

    return result;
  }, [searchQuery, activeCategory]);

  const getCategoryMeta = (category: string) =>
    CATEGORY_META[category] || { label: category, icon: Heart, color: 'bg-gray-50 text-gray-600 border-gray-200' };

  return (
    <section id="contacts" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-10">
            <SectionIllustration
              illustration={providerDirectoryIllustration}
              variant="sectionHeader"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Provider &amp; Contact Directory
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find contact information for all benefit carriers and support resources.
            </p>
          </div>
        </ScrollFadeIn>

        {/* Search + Category Tabs */}
        <ScrollFadeIn delay={100}>
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-tobie-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Category pill tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === null
                    ? 'bg-tobie-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({providers.length})
              </button>
              {availableCategories.map((cat) => {
                const meta = getCategoryMeta(cat);
                const count = providers.filter((p) => p.category === cat).length;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(isActive ? null : cat)}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-tobie-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {meta.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollFadeIn>

        {/* Provider rows — compact table-like layout */}
        {filteredProviders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No providers found matching your search.
          </p>
        ) : (
          <ScrollFadeIn delay={200}>
            <div className="border border-gray-200 divide-y divide-gray-100 bg-white">
              {filteredProviders.map((provider) => {
                const meta = getCategoryMeta(provider.category);
                const Icon = meta.icon;
                return (
                  <div
                    key={`${provider.name}-${provider.category}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-5 py-4 hover:bg-brand-surface transition-colors"
                  >
                    {/* Icon + Name + Category badge */}
                    <div className="flex items-start gap-3 sm:w-2/5 min-w-0">
                      <div className={`flex-shrink-0 w-9 h-9 flex items-center justify-center ${meta.color.split(' ').slice(0, 1).join(' ')}`}>
                        <Icon className={`w-4.5 h-4.5 ${meta.color.split(' ')[1]}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{provider.name}</h4>
                          <span className={`hidden sm:inline-flex text-[10px] font-medium px-2 py-0.5 ${meta.color}`}>
                            {meta.label}
                          </span>
                        </div>
                        {provider.description && (
                          <p className="text-xs text-gray-500 leading-relaxed mt-0.5 line-clamp-2">
                            {provider.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contact actions — right side */}
                    <div className="flex items-center gap-3 sm:gap-4 sm:ml-auto flex-shrink-0 pl-12 sm:pl-0">
                      {provider.phone && (
                        <a
                          href={`tel:${provider.phone.replace(/[^0-9]/g, '')}`}
                          className="inline-flex items-center gap-1.5 text-sm text-tobie-600 font-medium hover:text-tobie-800 transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>{provider.phone}</span>
                        </a>
                      )}
                      {provider.website && (
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-tobie-600 font-medium hover:text-tobie-800 transition-colors"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Website</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Result count */}
            <p className="text-xs text-gray-400 text-center mt-4">
              Showing {filteredProviders.length} of {providers.length} providers
              {activeCategory ? ` in ${getCategoryMeta(activeCategory).label}` : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </p>
          </ScrollFadeIn>
        )}
      </div>
    </section>
  );
}
