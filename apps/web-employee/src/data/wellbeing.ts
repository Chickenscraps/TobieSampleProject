import type { BenefitCategory } from '@/types/benefits';

export interface WellbeingIncentive {
  participant: string;
  incentiveCap: string;
  incentiveFormat: string;
}

export const wellbeingIncentives: WellbeingIncentive[] = [
  {
    participant: 'Tobie Premier Plan, Blue Standard Plan and Blue Premium Plan - enrolled team member',
    incentiveCap: '$900',
    incentiveFormat: 'HRA, through the Tobie well-being portal',
  },
  {
    participant: 'Tobie Premier Plan, Blue Standard Plan and Blue Premium Plan - enrolled spouse',
    incentiveCap: '$275',
    incentiveFormat: 'HRA, through the Tobie well-being portal',
  },
  {
    participant: 'Blue High Deductible Health Plan - enrolled team member',
    incentiveCap: '$250',
    incentiveFormat: 'Rewards/points, through the Tobie well-being portal',
  },
  {
    participant: 'Non-enrolled benefits-eligible team member and spouse enrolled as dependent on HDHP',
    incentiveCap: '$100',
    incentiveFormat: 'Rewards/points, through the Tobie well-being portal',
  },
  {
    participant: 'PRN team member',
    incentiveCap: 'Not eligible',
    incentiveFormat: 'N/A',
  },
];

export const hraContributions = {
  tobiePremierPlan: {
    wellnessIncentive: {
      employeeOnly: '$900',
      employeeChildren: '$900',
      employeeSpouse: '$1,175',
      employeeFamily: '$1,175',
    },
  },
  blueStandardPlan: {
    wellnessIncentive: {
      employeeOnly: '$900',
      employeeChildren: '$900',
      employeeSpouse: '$1,175',
      employeeFamily: '$1,175',
    },
  },
  bluePremiumPlan: {
    fixedFunds: {
      employeeOnly: '$0',
      employeeChildren: '$375',
      employeeSpouse: '$450',
      employeeFamily: '$750',
    },
    wellnessIncentive: {
      employeeOnly: '$900',
      employeeChildren: '$900',
      employeeSpouse: '$1,175',
      employeeFamily: '$1,175',
    },
  },
};

export const wellbeingPrograms: BenefitCategory = {
  id: 'wellbeing',
  title: 'Well-being Programs',
  icon: 'Activity',
  summary:
    'All team members are encouraged to participate in well-being activities. Benefits-eligible team members can earn incentives including HRA contributions. The Healthy Lifestyles Program provides tools for managing diabetes and hypertension.',
  keyDetails: [
    'All benefits-eligible team members can earn well-being incentives',
    'Premier/Standard/Premium plan members: up to $900 HRA (team member) + $275 HRA (spouse)',
    'HDHP members: up to $250 in rewards/points',
    'Non-enrolled benefits-eligible: up to $100 in rewards/points',
    'Blue Premium Plan: automatic HRA fixed funds (Employee/Child $375, Employee/Spouse $450, Family $750)',
    'HRA funds must be used by year-end (no rollover for new 2026 fixed funds)',
    'Healthy Lifestyles Program for diabetes and hypertension management',
    'Requires Tobie medical plan enrollment and active Tobie MyChart account',
    'Tobacco cessation program available to avoid $45/pay period surcharge',
    'Employee Assistance Program (EAP) through AllOne Health: 800-822-4847',
  ],
  eligibility: 'All benefits-eligible team members (PRN not eligible for incentives)',
  employerPaid: 'Employer-funded incentive program',
  warnings: [
    'HRA funds awarded in 2026 that are not used by year-end will not roll over',
    'If you switch to HDHP, existing HRA balances are forfeited',
  ],
  links: [
    { label: 'EAP - AllOne Health', url: 'https://Tobie.mylifeexpert.com' },
  ],
  contacts: [
    { name: 'AllOne Health (EAP)', role: 'Employee Assistance Program', phone: '800-822-4847', website: 'https://Tobie.mylifeexpert.com', category: 'wellbeing' },
    { name: 'HR Solutions Center', role: 'Well-being Programs', phone: '800-890-5420', email: 'AskHR@Tobie.org', category: 'wellbeing' },
  ],
};
