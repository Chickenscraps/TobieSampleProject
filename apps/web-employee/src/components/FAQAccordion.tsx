'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { faqItems } from '@/data/faq-data';
import { ScrollFadeIn } from './ScrollFadeIn';
import { SectionIllustration } from './SectionIllustration';
import { faqIllustration } from '@/lib/image-manifest';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'enrollment', label: 'Enrollment' },
  { key: 'medical', label: 'Medical' },
  { key: 'dental-vision', label: 'Dental & Vision' },
  { key: 'financial', label: 'Financial' },
  { key: 'general', label: 'General' },
] as const;

export function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('enrollment');
  const [searchQuery, setSearchQuery] = useState('');

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: faqItems.length };
    faqItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredItems = useMemo(() => {
    let result = faqItems;

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-10">
            <SectionIllustration illustration={faqIllustration} variant="sectionHeader" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common benefits questions below.
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
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-tobie-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Category pill tabs with counts */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    setOpenId(null);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === cat.key
                      ? 'bg-tobie-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label} ({categoryCounts[cat.key] || 0})
                </button>
              ))}
            </div>
          </div>
        </ScrollFadeIn>

        {/* Two-column accordion grid */}
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No questions found matching your search.
          </p>
        ) : (
          <ScrollFadeIn delay={200}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {filteredItems.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div
                    key={item.id}
                    className="self-start border border-gray-200 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-left bg-white hover:bg-gray-50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-medium text-gray-900 pr-3">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className="accordion-content"
                      style={{
                        maxHeight: isOpen ? '500px' : '0px',
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <div className="px-5 pb-3.5 pt-0">
                        <div className="border-t border-gray-100 pt-3">
                          <p className="text-gray-600 leading-relaxed text-xs">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Result count */}
            <p className="text-xs text-gray-400 text-center mt-4">
              Showing {filteredItems.length} of {faqItems.length} questions
              {activeCategory !== 'all' ? ` in ${categories.find(c => c.key === activeCategory)?.label}` : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </p>
          </ScrollFadeIn>
        )}
      </div>
    </section>
  );
}
