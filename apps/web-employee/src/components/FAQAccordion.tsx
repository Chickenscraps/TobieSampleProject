'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqItems } from '@/data/faq-data';
import { ScrollFadeIn } from './ScrollFadeIn';

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
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return faqItems;
    return faqItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-10">
            <div className="w-32 h-32 mx-auto mb-4 bg-tobie-50 flex items-center justify-center p-3">
              <img
                src="/images/faq-illustration.png"
                alt="Illustration of question marks and speech bubbles representing frequently asked questions."
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common benefits questions below.
            </p>
          </div>
        </ScrollFadeIn>

        {/* Category Filter Pills */}
        <ScrollFadeIn delay={100}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setOpenId(null);
                }}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.key
                    ? 'bg-tobie-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollFadeIn>

        {/* Accordion Items */}
        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const isOpen = openId === item.id;

            return (
              <ScrollFadeIn key={item.id} delay={index * 50}>
                <div className="border border-gray-200 overflow-hidden transition-colors">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-medium text-gray-900 pr-4">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
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
                    <div className="px-6 pb-4 pt-0">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollFadeIn>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No questions found for this category.
          </p>
        )}
      </div>
    </section>
  );
}
