import type { BenefitCategory } from '@/types/benefits';

export interface DentalPlan {
  name: string;
  network: string;
  deductible: { individual: string; family: string };
  annualMaximum: string;
  orthodontiaLifetimeMax: string;
  orthodontiaDeductible: string;
  services: { service: string; cost: string }[];
}

export const dentalPlans: DentalPlan[] = [
  {
    name: 'Base Plan',
    network: 'Total Cigna DPPO Network',
    deductible: { individual: '$50', family: '$150' },
    annualMaximum:
      'Year 1: $1,000 | Year 2: $1,100 | Year 3: $1,200 | Year 4: $1,300 (increases by $100/year when preventive care is received; starts 2027)',
    orthodontiaLifetimeMax: 'N/A (not covered)',
    orthodontiaDeductible: 'N/A',
    services: [
      { service: 'Preventive', cost: '$0 (covered 100%)' },
      { service: 'Basic', cost: 'You pay 20% (Bridges 50%)' },
      { service: 'Major', cost: 'You pay 50%' },
      { service: 'Endodontics', cost: 'You pay 20%' },
      { service: 'Periodontics', cost: 'You pay 20%' },
      { service: 'Oral Surgery', cost: 'You pay 20%' },
      { service: 'Orthodontia', cost: 'Not covered' },
    ],
  },
  {
    name: 'Enhanced Plan',
    network: 'Total Cigna DPPO Network',
    deductible: { individual: '$50', family: '$150' },
    annualMaximum: '$1,700 (in-network) / $1,300 (non-network)',
    orthodontiaLifetimeMax: '$2,000',
    orthodontiaDeductible: '$100',
    services: [
      { service: 'Preventive', cost: '$0 (covered 100%)' },
      { service: 'Basic', cost: 'You pay 20% (Bridges 50%)' },
      { service: 'Major', cost: 'You pay 50%' },
      { service: 'Endodontics', cost: 'You pay 20%' },
      { service: 'Periodontics', cost: 'You pay 20%' },
      { service: 'Oral Surgery', cost: 'You pay 20%' },
      { service: 'Orthodontia', cost: 'Covered with $2,000 lifetime max' },
    ],
  },
];

export const dentalPremiums = {
  basePlan: {
    employeeOnly: { total: '$18.88', tobieContribution: '$12.19', teamMemberCost: '$6.69' },
    employeeChildren: { total: '$40.80', tobieContribution: '$16.78', teamMemberCost: '$24.02' },
    employeeSpouse: { total: '$39.23', tobieContribution: '$15.65', teamMemberCost: '$23.58' },
    employeeFamily: { total: '$66.65', tobieContribution: '$36.04', teamMemberCost: '$30.61' },
  },
  enhancedPlan: {
    employeeOnly: { total: '$23.79', tobieContribution: '$12.20', teamMemberCost: '$11.59' },
    employeeChildren: { total: '$51.40', tobieContribution: '$16.79', teamMemberCost: '$34.61' },
    employeeSpouse: { total: '$49.41', tobieContribution: '$15.64', teamMemberCost: '$33.77' },
    employeeFamily: { total: '$83.95', tobieContribution: '$36.04', teamMemberCost: '$47.91' },
  },
};

export const dentalBenefits: BenefitCategory = {
  id: 'dental',
  title: 'Dental Benefits',
  carrier: 'Cigna',
  icon: 'Smile',
  summary:
    'Choose between two levels of dental coverage: Base Plan and Enhanced Plan. Both are administered by Cigna and cover preventive care at 100%. The Enhanced Plan also covers orthodontia with a $2,000 lifetime maximum.',
  keyDetails: [
    'Two plan options: Base Plan and Enhanced Plan',
    'Both plans cover preventive care at 100%',
    'Base Plan: lower cost, no orthodontia, annual max starts at $1,000 (increases $100/year with preventive use)',
    'Enhanced Plan: annual max $1,700 in-network, $2,000 orthodontia lifetime max',
    'Individual deductible: $50 | Family deductible: $150 (both plans)',
    'Basic services: you pay 20% (bridges 50%)',
    'Major services: you pay 50%',
    'Endodontics, periodontics, oral surgery: you pay 20%',
    'Non-network annual maximum for Base Plan starts at $900 (Year 1)',
  ],
  eligibility: 'All benefits-eligible team members. Spouse can enroll regardless of other coverage.',
  employeeCost: 'Base Plan: $6.69/pay period (employee only). Enhanced Plan: $11.59/pay period (employee only).',
  links: [{ label: 'Cigna Website', url: 'https://mycigna.com' }],
  contacts: [
    { name: 'Cigna', role: 'Dental Plan Administrator', phone: '800-Cigna24', website: 'https://mycigna.com', category: 'dental' },
  ],
};
