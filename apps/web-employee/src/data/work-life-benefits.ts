import type { BenefitCategory } from '@/types/benefits';

export const workLifeBenefits: BenefitCategory[] = [
  {
    id: 'time-off',
    title: 'Paid Time Off (PTO)',
    icon: 'Clock',
    summary:
      'PTO provides flexible paid time off for holidays, vacations, personal or family illness, doctor appointments, school, volunteerism and more. You earn PTO based on years of service with Tobie. Tobie recognizes seven holidays.',
    keyDetails: [
      'PTO accrual by years of service (bi-weekly, based on 40-hour week):',
      '  Less than 1 year: 8.00 hours/pay period',
      '  1-2 years: 8.92 hours/pay period',
      '  2-5 years: 9.54 hours/pay period',
      '  5-15 years: 10.47 hours/pay period',
      '  15+ years: 12.00 hours/pay period',
      '7 recognized holidays: New Year\'s Day, MLK Jr. Day, Memorial Day, July 4th, Labor Day, Thanksgiving, Christmas',
      'Team members use accrued PTO for holidays',
      'Parental leave: 4 weeks paid at 100% base pay (after 12 months employment, 1,250 hours)',
      'Caregiver leave: 1 week paid at 100% base pay',
      'Bereavement: 40 hours (spouse/child), 24 hours (parent/sibling/in-law/grandparent/grandchild), 8 hours (other in-laws)',
      'Military leave supplemental pay: Tobie pays difference between military pay and base hourly rate',
    ],
    eligibility: 'All benefits-eligible team members; parental/caregiver leave requires 12 months of employment and 1,250 hours worked',
    employerPaid: 'Company-provided benefit',
    contacts: [
      { name: 'HR Solutions Center', role: 'Time Off', phone: '800-890-5420', email: 'AskHR@Tobie.org', category: 'work-life' },
    ],
  },
  {
    id: 'caregiver-support',
    title: 'Caregiver Support Program',
    carrier: 'Family First',
    icon: 'Users',
    summary:
      'Family First connects you with accredited care experts for comprehensive solutions when you need to find facilities, in-home care or resources for people in your care. Manage your care plan using the Family First Digital Care Hub.',
    keyDetails: [
      'Accredited care experts for facilities, in-home care and resources',
      'Personal care expert assigned to you',
      'Family First Digital Care Hub for managing care plans',
    ],
    eligibility: 'All benefits-eligible team members',
    employerPaid: 'Company-provided benefit',
    links: [{ label: 'Family First Digital Care Hub', url: 'https://care.family-first.com' }],
    contacts: [
      { name: 'Family First', role: 'Caregiver Support', phone: '800-214-5410', website: 'https://care.family-first.com/sign-in', category: 'work-life' },
    ],
  },
  {
    id: 'adoption-assistance',
    title: 'Adoption Assistance',
    icon: 'Heart',
    summary:
      'The Adoption Assistance Program provides up to $3,500 per child ($7,000 per year maximum) for adoption-related expenses.',
    keyDetails: [
      'Up to $3,500 per child',
      'Maximum $7,000 per year',
      'Covers adoption-related expenses',
    ],
    eligibility: 'All benefits-eligible team members',
    employerPaid: 'Company-provided benefit',
    contacts: [
      { name: 'HR Solutions Center', role: 'Adoption Assistance', phone: '800-890-5420', email: 'AskHR@Tobie.org', category: 'work-life' },
    ],
  },
  {
    id: 'tuition-reimbursement',
    title: 'Tuition Reimbursement',
    icon: 'BookOpen',
    summary:
      'Eligibility begins after 90 days of service. Full-time team members can receive up to $5,250 per calendar year. Part-time team members may receive up to $2,625 per calendar year.',
    keyDetails: [
      'Eligibility after 90 days of service',
      'Full-time (30+ hours/week): up to $5,250/year',
      'Part-time: up to $2,625/year',
      'Based on approved Plan of Study',
    ],
    eligibility: 'Team members with 90+ days of service',
    employerPaid: 'Company-provided benefit',
    contacts: [
      { name: 'HR Solutions Center', role: 'Tuition Reimbursement', phone: '800-890-5420', email: 'TuitionReimbursement@Tobie.org', category: 'work-life' },
    ],
  },
  {
    id: 'consumer-discounts',
    title: 'Consumer Discounts',
    carrier: 'YouDecide',
    icon: 'Star',
    summary:
      'Save on the brands, services and experiences you love with Team Member Advantages. Available through YouDecide platform.',
    keyDetails: [
      'Exclusive savings for Tobie team members',
      'Savings on auto insurance, home insurance, pet insurance and more',
      'Client ID: NOV668',
      'Consumer advisor available Monday-Friday, 8 a.m. to 7 p.m. ET',
    ],
    eligibility: 'All Tobie team members',
    employerPaid: 'Company-provided platform access',
    links: [{ label: 'YouDecide Portal', url: 'https://youdecide.com/Tobie' }],
    contacts: [
      { name: 'YouDecide / Consumer Advisor', role: 'Consumer Discounts', phone: '800-923-4609', email: 'advisor@youdecide.com', website: 'https://youdecide.com/Tobie', category: 'work-life' },
    ],
  },
];
