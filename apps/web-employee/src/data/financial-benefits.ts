import type { BenefitCategory } from '@/types/benefits';

export const financialBenefits: BenefitCategory[] = [
  {
    id: 'short-term-disability',
    title: 'Short-Term Disability (STD)',
    carrier: 'The Hartford',
    icon: 'Shield',
    summary:
      'Tobie offers short-term disability coverage which pays a benefit of 60% of your base pay, up to $2,500 per week. While voluntary, you will be defaulted to the 30-day elimination period plan. You can change to the 15-day plan or opt out during your new hire life event.',
    keyDetails: [
      'Pays 60% of base pay, up to $2,500 per week',
      'Default enrollment: 30-day elimination period plan',
      'Option to elect 15-day elimination period plan',
      'If you opt out or elect coverage outside new hire period, evidence of insurability is required',
      'Team members pay full cost with after-tax dollars (so benefit is received tax-free)',
      'Directors and above do not elect short-term disability',
    ],
    eligibility: 'All benefits-eligible team members (except directors and above)',
    employeeCost: 'Team member-paid with after-tax dollars',
    warnings: [
      'If you opt out and later want coverage, medical questions and carrier approval are required',
    ],
    contacts: [
      { name: 'The Hartford', role: 'Disability & Life Insurance', phone: '888-277-4647', website: 'https://mybenefits.thehartford.com/login', category: 'financial' },
    ],
  },
  {
    id: 'long-term-disability',
    title: 'Long-Term Disability (LTD)',
    carrier: 'The Hartford',
    icon: 'Shield',
    summary:
      'Tobie provides long-term disability coverage at no cost to you. The plan pays 60% of your base pay after a 90-day waiting period, with a maximum benefit of $15,000 per month.',
    keyDetails: [
      'Company-paid benefit at no cost to you',
      'Pays 60% of base pay',
      '90-day waiting period',
      'Maximum benefit: $15,000 per month',
      'Included in default benefits package if you do not actively enroll',
    ],
    eligibility: 'All benefits-eligible team members',
    employerPaid: '100% employer-paid',
    contacts: [
      { name: 'The Hartford', role: 'Disability & Life Insurance', phone: '888-277-4647', website: 'https://mybenefits.thehartford.com/login', category: 'financial' },
    ],
  },
  {
    id: 'basic-life-insurance',
    title: 'Basic Life Insurance',
    carrier: 'The Hartford',
    icon: 'Users',
    summary:
      'Tobie provides 1.5x your base pay in basic life insurance at no cost to you, up to a maximum coverage amount of $1,000,000. Enrollment is automatic but you should designate beneficiaries in Infor.',
    keyDetails: [
      'Company-paid: 1.5x your base pay',
      'Maximum coverage: $1,000,000',
      'Automatic enrollment',
      'Designate beneficiaries in Infor',
      'Included in default benefits package if you do not actively enroll',
    ],
    eligibility: 'All benefits-eligible team members',
    employerPaid: '100% employer-paid',
    contacts: [
      { name: 'The Hartford', role: 'Life Insurance', phone: '888-277-4647', website: 'https://mybenefits.thehartford.com/login', category: 'financial' },
    ],
  },
  {
    id: 'supplemental-life-insurance',
    title: 'Supplemental Life & AD&D Insurance',
    carrier: 'The Hartford',
    icon: 'Users',
    summary:
      'Purchase additional supplemental life and accidental death & dismemberment (AD&D) insurance. Supplemental life is guaranteed up to $500,000 and can be purchased in increments up to $1,000,000 pending approval.',
    keyDetails: [
      'Supplemental life: guaranteed up to $500,000',
      'Coverage increments: 1x to 5x base pay (max $1,000,000 pending approval)',
      'Dependent life insurance available for spouse and children',
      'AD&D coverage: employee-only or family',
      'AD&D options range from $25,000 to $500,000',
      'Spouses over age 70 are not eligible for AD&D',
      'Team member-paid through payroll deductions',
    ],
    eligibility: 'All benefits-eligible team members',
    employeeCost: 'Team member-paid through payroll deductions',
    contacts: [
      { name: 'The Hartford', role: 'Supplemental Life & AD&D', phone: '888-277-4647', website: 'https://mybenefits.thehartford.com/login', category: 'financial' },
    ],
  },
  {
    id: 'retirement-plan',
    title: 'Tobie Retirement Plus Plan',
    carrier: 'Fidelity Investments',
    icon: 'DollarSign',
    summary:
      'The Tobie Retirement Plus Plan is a defined contribution plan with recordkeeping by Fidelity Investments. Newly hired team members are automatically enrolled at a 4% pre-tax contribution rate. Tobie matches dollar-for-dollar on the first 6% you contribute.',
    keyDetails: [
      'Automatic enrollment at 4% pre-tax contribution rate',
      'Tobie matches dollar-for-dollar on the first 6% contributed each pay period',
      'Contribute 1% to 60% of salary (pre-tax and/or Roth) in 0.1% increments',
      'Matching contribution vests after 3 years of service (1,000+ hours/year)',
      'Your own contributions are always 100% vested',
      'Default investment: State Street Target Retirement Fund based on date of birth',
      '90 days to opt out after hire',
      'Auto Increase Program available (1-3% annual increase)',
      'Full range of investment options plus Fidelity BrokerageLink',
      'Loans: borrow up to 50% of vested balance ($1,000 min, $50,000 max, one loan at a time)',
      'Rollovers accepted from 401(k), 403(b), 401(a), governmental 457(b) and conduit IRA',
    ],
    eligibility: 'All team members; newly hired team members auto-enrolled',
    employerPaid: 'Dollar-for-dollar match on first 6% of contribution',
    links: [
      { label: 'Fidelity NetBenefits', url: 'https://netbenefits.com/Tobie' },
      { label: 'Schedule Appointment', url: 'https://fidelity.com/reserve' },
    ],
    contacts: [
      { name: 'Fidelity Retirement Service Center', role: 'Retirement Plan', phone: '800-343-0860', website: 'https://netbenefits.com/Tobie', category: 'financial' },
      { name: 'Fidelity Retirement Planning Team', role: 'Investment Consultations', phone: '800-642-7131', website: 'https://fidelity.com/reserve', category: 'financial' },
    ],
  },
];
