import type { QuickLink } from '@/types/benefits';

export const quickLinks: QuickLink[] = [
  {
    label: 'Enrollment Portal',
    url: '#enrollment',
    icon: 'FileText',
    description: 'Access Infor HR to enroll in or change your benefit elections.',
  },
  {
    label: 'Benefits Guide',
    url: '#guide-download',
    icon: 'BookOpen',
    description: 'Download and review the complete 2026 Tobie Benefits Guide.',
  },
  {
    label: 'Medical Resources',
    url: '/medical-resources',
    icon: 'Heart',
    description: 'Compare medical plans, view coverage summaries and plan details.',
  },
  {
    label: 'EAP Resources',
    url: '#eap',
    icon: 'Users',
    description: 'Access Employee Assistance Program counseling and support through AllOne Health.',
  },
  {
    label: 'Find a Provider',
    url: 'https://www.bcbs.com/find-a-doctor',
    icon: 'Search',
    description: 'Search for in-network doctors, specialists and facilities through BCBS.',
  },
  {
    label: 'Contact HR',
    url: '#contacts',
    icon: 'Phone',
    description: 'Reach the HR Solutions Center at 800-890-5420 or via ServiceNow.',
  },
];
