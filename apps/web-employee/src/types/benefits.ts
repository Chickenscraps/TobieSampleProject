export interface BenefitCategory {
  id: string;
  title: string;
  carrier?: string;
  icon: string;
  summary: string;
  keyDetails: string[];
  eligibility?: string;
  employeeCost?: string;
  employerPaid?: string;
  warnings?: string[];
  links?: BenefitLink[];
  contacts?: Contact[];
}

export interface MedicalPlan {
  name: string;
  description: string;
  tiers: NetworkTier[];
  highlights: string[];
  premiumNote?: string;
}

export interface NetworkTier {
  name: string;
  tierNumber: number;
  deductible: { individual: string; family: string };
  oopMax: { individual: string; family: string };
  services: ServiceCost[];
}

export interface ServiceCost {
  service: string;
  cost: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'enrollment' | 'medical' | 'dental-vision' | 'financial' | 'general';
}

export interface Contact {
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  website?: string;
  category: string;
}

export interface QuickLink {
  label: string;
  url: string;
  icon: string;
  description: string;
}

export interface BenefitLink {
  label: string;
  url: string;
}

export interface ProviderInfo {
  name: string;
  category: string;
  phone?: string;
  website?: string;
  description?: string;
}
