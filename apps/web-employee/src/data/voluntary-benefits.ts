import type { BenefitCategory } from '@/types/benefits';

export const voluntaryBenefits: BenefitCategory[] = [
  {
    id: 'accident-insurance',
    title: 'Accident Insurance',
    carrier: 'The Hartford',
    icon: 'Shield',
    summary:
      'Accident insurance pays a benefit directly to you if you or an eligible dependent suffer a covered injury. This benefit can help cover out-of-pocket expenses related to injuries such as hospitalization, physical therapy, transportation and more.',
    keyDetails: [
      'Pays a benefit directly to you for covered injuries',
      'Covers expenses like hospitalization, physical therapy, transportation',
      'No health questions or physical exams required',
      'Coverage is portable (take your policy if you change jobs or retire)',
      'You pay the full cost through payroll deductions',
      'Policy provisions may vary or be unavailable in some states',
    ],
    eligibility: 'All benefits-eligible team members and eligible dependents',
    employeeCost: 'Team member-paid through payroll deductions',
    links: [{ label: 'The Hartford Portal', url: 'https://myhealthhub.app/thehartford' }],
    contacts: [
      { name: 'The Hartford', role: 'Accident/Critical Illness/Hospital Care', phone: '866-547-4205', website: 'https://myhealthhub.app/thehartford', category: 'voluntary' },
    ],
  },
  {
    id: 'critical-illness',
    title: 'Critical Illness Insurance',
    carrier: 'The Hartford',
    icon: 'Heart',
    summary:
      'Critical illness insurance reduces the financial impact of a major illness such as a heart attack, stroke or cancer. The policy pays a lump sum benefit directly to you once you or a covered family member is diagnosed with a covered condition.',
    keyDetails: [
      'Lump sum benefit paid directly to you upon diagnosis',
      'Covers conditions like heart attack, stroke and cancer',
      'You choose the benefit amount when you enroll',
      'Coverage is portable',
      'You pay the full cost through payroll deductions',
      'Policy provisions may vary or be unavailable in some states',
    ],
    eligibility: 'All benefits-eligible team members and covered family members',
    employeeCost: 'Team member-paid through payroll deductions',
    contacts: [
      { name: 'The Hartford', role: 'Critical Illness Insurance', phone: '866-547-4205', website: 'https://myhealthhub.app/thehartford', category: 'voluntary' },
    ],
  },
  {
    id: 'hospital-care',
    title: 'Hospital Care Plan',
    carrier: 'The Hartford',
    icon: 'Building',
    summary:
      'Hospital care coverage provides a fixed benefit when a covered person incurs a hospital stay due to a covered injury or illness. You can use the money for expenses such as child care, travel or other out-of-pocket costs.',
    keyDetails: [
      'Fixed benefit for covered hospital stays',
      'Use funds for any purpose (child care, travel, out-of-pocket expenses)',
      'Coverage is portable',
      'You pay the full cost through payroll deductions',
    ],
    eligibility: 'All benefits-eligible team members',
    employeeCost: 'Team member-paid through payroll deductions',
    contacts: [
      { name: 'The Hartford', role: 'Hospital Care Plan', phone: '866-547-4205', website: 'https://myhealthhub.app/thehartford', category: 'voluntary' },
    ],
  },
  {
    id: 'legal-plan',
    title: 'MetLife Legal Plan',
    carrier: 'MetLife',
    icon: 'FileText',
    summary:
      'With MetLife Legal Plans, you have a team of top attorneys ready to help with planned and unplanned legal events such as buying a home, preparing a will, or handling a speeding ticket.',
    keyDetails: [
      'Access to a network of top attorneys',
      'Covers planned events (home buying, wills) and unplanned events (traffic tickets)',
      'Quality legal assistance at affordable rates',
      'Paid through payroll deductions',
    ],
    eligibility: 'All benefits-eligible team members',
    employeeCost: 'Team member-paid through payroll deductions',
    links: [{ label: 'MetLife Legal Plans', url: 'https://legalplans.com' }],
    contacts: [
      { name: 'MetLife', role: 'Legal Plan', phone: '800-821-6400', website: 'https://legalplans.com', category: 'voluntary' },
    ],
  },
  {
    id: 'auto-home-insurance',
    title: 'Auto and Home Insurance',
    carrier: 'YouDecide',
    icon: 'Umbrella',
    summary:
      'Get competitive rates on auto and home insurance for Tobie team members. Side-by-side comparison quoting from top-rated providers. Premiums can be paid through payroll deductions.',
    keyDetails: [
      'Competitive rates exclusive to Tobie team members',
      'Side-by-side comparison quoting from top-rated providers',
      'Premiums paid through payroll deductions',
      'Eliminates hassle of monthly payments',
      'Available through Tobie Team Member Advantages program',
    ],
    eligibility: 'All Tobie team members',
    employeeCost: 'Team member-paid through payroll deductions',
    links: [{ label: 'YouDecide Portal', url: 'https://youdecide.com/Tobie' }],
    contacts: [
      { name: 'YouDecide / Consumer Advisor', role: 'Auto & Home Insurance', phone: '800-923-4609', email: 'advisor@youdecide.com', website: 'https://youdecide.com/Tobie', category: 'voluntary' },
    ],
  },
  {
    id: 'pet-insurance',
    title: 'Pet Insurance',
    carrier: 'Nationwide',
    icon: 'Heart',
    summary:
      'Offset the cost of illnesses, injuries and routine wellness care for your pets with Nationwide pet insurance. Available through the Tobie Team Member Advantages program.',
    keyDetails: [
      'Covers illnesses, injuries and routine wellness care',
      'Nationwide pet insurance',
      'Available through Tobie Team Member Advantages program',
      'Client ID: NOV668',
    ],
    eligibility: 'All Tobie team members',
    employeeCost: 'Team member-paid',
    links: [{ label: 'YouDecide Portal', url: 'https://youdecide.com/Tobie' }],
    contacts: [
      { name: 'YouDecide / Consumer Advisor', role: 'Pet Insurance', phone: '800-923-4609', email: 'advisor@youdecide.com', website: 'https://youdecide.com/Tobie', category: 'voluntary' },
    ],
  },
];
