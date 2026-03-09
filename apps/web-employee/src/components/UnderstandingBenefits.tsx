import { ScrollFadeIn } from './ScrollFadeIn';

interface BenefitTerm {
  term: string;
  definition: string;
}

const benefitTerms: BenefitTerm[] = [
  {
    term: 'Premium',
    definition:
      'The amount you pay each pay period for your health coverage. This cost is typically deducted pre-tax from your paycheck. Your premium depends on the plan you choose and whether you cover just yourself or include dependents.',
  },
  {
    term: 'Deductible',
    definition:
      'The amount you must pay out of pocket for covered services before your insurance begins to pay. For example, if your deductible is $1,500, you pay the first $1,500 of covered services. Preventive care is usually covered before you meet your deductible.',
  },
  {
    term: 'Coinsurance',
    definition:
      'The percentage of costs you share with your insurance plan after meeting your deductible. For example, if your plan has 80/20 coinsurance, the plan pays 80% and you pay 20% of covered services until you reach your out-of-pocket maximum.',
  },
  {
    term: 'Copay',
    definition:
      'A fixed dollar amount you pay at the time of a covered service, like a doctor visit or prescription. Copays vary by service type. For example, $25 for a primary care visit or $50 for a specialist. Copays count toward your out-of-pocket maximum.',
  },
  {
    term: 'Out-of-Pocket Maximum',
    definition:
      'The most you will pay for covered services in a plan year. Once you reach this limit, your plan pays 100% of covered services for the rest of the year. This includes deductibles, coinsurance, and copays (but not premiums).',
  },
  {
    term: 'HRA (Health Reimbursement Arrangement)',
    definition:
      'An employer-funded account that reimburses you for eligible medical expenses. HRA funds help offset your deductible costs. The HRA is owned by the employer and typically does not carry over or transfer if you leave.',
  },
  {
    term: 'HSA (Health Savings Account)',
    definition:
      'A tax-advantaged savings account available only with a High Deductible Health Plan (HDHP). You contribute pre-tax dollars, and the funds can be used for qualified medical expenses. HSA funds roll over year to year and are fully yours, even if you change jobs.',
  },
  {
    term: 'Networks & Tiers',
    definition:
      'Insurance plans organize providers into networks or tiers. Tier 1 (in-network) providers have the lowest costs for you. Tier 2 and Tier 3 providers are still covered but at higher costs. Going out-of-network means the highest out-of-pocket expenses. Always check your plan\'s provider directory.',
  },
];

export function UnderstandingBenefits() {
  return (
    <section id="understanding-benefits" className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Understanding Your Benefits
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Key terms explained in plain language to help you make informed
              benefit decisions.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {benefitTerms.map((item, index) => {
            const topBorderColors = ['border-t-tobie-500', 'border-t-[#FFB31A]', 'border-t-tobie-400', 'border-t-tobie-300'];
            const topBorderColor = topBorderColors[index % topBorderColors.length];
            return (
            <ScrollFadeIn key={item.term} delay={index * 75}>
              <div className={`bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-card-hover transition-all duration-300 border-t-[3px] ${topBorderColor} p-6 h-full card-hover`}>
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-tobie-700 dark:text-white">
                    {item.term}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            </ScrollFadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
