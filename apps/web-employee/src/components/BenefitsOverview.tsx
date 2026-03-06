'use client';

import { benefitCategories } from '@/data/benefits-data';
import { BenefitCategoryCard } from './BenefitCategoryCard';
import { ScrollFadeIn } from './ScrollFadeIn';

export function BenefitsOverview() {
  return (
    <section id="benefits-overview" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Your Benefits at a Glance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore each benefit category to understand your coverage options,
              key details, and how to get started.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefitCategories.map((category, index) => (
            <ScrollFadeIn key={category.id} delay={index * 75}>
              <BenefitCategoryCard category={category} />
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
