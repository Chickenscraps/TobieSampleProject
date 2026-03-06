import type { BenefitCategory } from '@/types/benefits';

export const visionPremiums = {
  employeeOnly: '$5.17',
  employeeChildren: '$8.29',
  employeeSpouse: '$8.11',
  employeeFamily: '$13.35',
};

export const visionBenefits: BenefitCategory = {
  id: 'vision',
  title: 'Vision Benefits',
  carrier: 'VSP',
  icon: 'Eye',
  summary:
    'The vision plan is administered by VSP and covers annual eye exams, lenses and frames or contact lenses in lieu of eyeglasses. Many in-network services are covered in full or require a copay, and a plan allowance is associated with many out-of-network services. Discounts are available on laser vision correction, additional glasses, sunglasses and lens enhancements.',
  keyDetails: [
    'Administered by VSP (Vision Service Plan)',
    'Annual eye exam covered',
    'Lenses and frames or contact lenses covered (in lieu of eyeglasses)',
    'In-network services covered in full or with copay',
    'Out-of-network plan allowance available',
    'Discounts on laser vision correction',
    'Discounts on additional glasses, sunglasses and lens enhancements',
    'Bi-weekly premiums: Employee Only $5.17 | Employee/Child(ren) $8.29 | Employee/Spouse $8.11 | Employee/Family $13.35',
  ],
  eligibility: 'All benefits-eligible team members',
  employeeCost: '$5.17/pay period (employee only)',
  links: [{ label: 'VSP Website', url: 'https://vsp.com' }],
  contacts: [
    { name: 'VSP', role: 'Vision Plan Administrator', phone: '800-877-7195', website: 'https://vsp.com', category: 'vision' },
  ],
};
