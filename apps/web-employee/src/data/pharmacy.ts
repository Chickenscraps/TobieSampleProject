import type { BenefitCategory } from '@/types/benefits';

export interface PharmacyTier {
  tier: string;
  tobieWalgreens: string;
  nonWalgreensRetail: string;
  homeDelivery: string;
}

export interface PharmacyPlanDetails {
  planName: string;
  rxDeductible: string;
  rxOopMax: string;
  preventiveDrugList: string;
  oopMaxPerClaim: string;
  tiers: PharmacyTier[];
}

export const pharmacyPlanDetails: PharmacyPlanDetails[] = [
  {
    planName: 'Tobie Premier Plan',
    rxDeductible: 'N/A (Tobie/Walgreens) | $150 for brand drugs (Non-Walgreens)',
    rxOopMax: '$1,600 Employee Only / $3,200 Family',
    preventiveDrugList: 'N/A',
    oopMaxPerClaim: 'N/A (Tobie/Walgreens) | $150 (Non-Walgreens)',
    tiers: [
      { tier: 'Tier 1 - Generics', tobieWalgreens: '$5 (30 days) / $12 (90 days)', nonWalgreensRetail: '$10', homeDelivery: '$12' },
      { tier: 'Tier 2 - Preferred Brands', tobieWalgreens: '$35 (30 days) / $85 (90 days)', nonWalgreensRetail: '$40 + 20% up to $150', homeDelivery: '$85' },
      { tier: 'Tier 3 - Non-Preferred Brands', tobieWalgreens: '$60 (30 days) / $180 (90 days)', nonWalgreensRetail: '$85 + 40% up to $150', homeDelivery: '$180' },
      { tier: 'Tier 4 - Specialty Generics', tobieWalgreens: '$70 (30-day limit)', nonWalgreensRetail: 'Not Covered', homeDelivery: '$70 (30-day limit)' },
      { tier: 'Tier 5 - Specialty Preferred Brands', tobieWalgreens: '$100 (30-day limit)', nonWalgreensRetail: 'Not Covered', homeDelivery: '$100 (30-day limit)' },
      { tier: 'Tier 6 - Specialty Non-Preferred Brands', tobieWalgreens: '$200 (30-day limit)', nonWalgreensRetail: 'Not Covered', homeDelivery: '$200 (30-day limit)' },
    ],
  },
  {
    planName: 'Blue Standard Plan / Blue Premium Plan',
    rxDeductible: 'N/A (Tobie/Walgreens) | $150 for brand drugs (Non-Walgreens)',
    rxOopMax: '$1,600 Employee Only / $3,200 Family',
    preventiveDrugList: 'N/A',
    oopMaxPerClaim: 'N/A (Tobie/Walgreens) | $250 (Non-Walgreens)',
    tiers: [
      { tier: 'Tier 1 - Generics', tobieWalgreens: '$10 (30 days) / $25 (90 days)', nonWalgreensRetail: '$15', homeDelivery: '$25' },
      { tier: 'Tier 2 - Preferred Brands', tobieWalgreens: '$40 (30 days) / $100 (90 days)', nonWalgreensRetail: '$45 + 20% up to $250', homeDelivery: '$100' },
      { tier: 'Tier 3 - Non-Preferred Brands', tobieWalgreens: '$80 (30 days) / $240 (90 days)', nonWalgreensRetail: '$100 + 40% up to $250', homeDelivery: '$240' },
      { tier: 'Tier 4 - Specialty Generics', tobieWalgreens: '$100 (30-day limit)', nonWalgreensRetail: 'Not Covered', homeDelivery: '$100 (30-day limit)' },
      { tier: 'Tier 5 - Specialty Preferred Brands', tobieWalgreens: '$150 (30-day limit)', nonWalgreensRetail: 'Not Covered', homeDelivery: '$150 (30-day limit)' },
      { tier: 'Tier 6 - Specialty Non-Preferred Brands', tobieWalgreens: '$400 (30-day limit)', nonWalgreensRetail: 'Not Covered', homeDelivery: '$400 (30-day limit)' },
    ],
  },
  {
    planName: 'Blue High Deductible Health Plan with HSA',
    rxDeductible: '$2,000 Employee Only / $4,000 Family',
    rxOopMax: '$6,000 Employee Only / $12,000 Family (combined with medical)',
    preventiveDrugList: 'No Cost',
    oopMaxPerClaim: 'N/A',
    tiers: [
      { tier: 'Tier 1 - Generics', tobieWalgreens: 'Deductible, then 10% coinsurance', nonWalgreensRetail: 'Deductible, then 25% coinsurance', homeDelivery: 'Deductible, then 10% coinsurance' },
      { tier: 'Tier 2 - Preferred Brands', tobieWalgreens: 'Deductible, then 10% coinsurance', nonWalgreensRetail: 'Deductible, then 25% coinsurance', homeDelivery: 'Deductible, then 10% coinsurance' },
      { tier: 'Tier 3 - Non-Preferred Brands', tobieWalgreens: 'Deductible, then 10% coinsurance', nonWalgreensRetail: 'Deductible, then 25% coinsurance', homeDelivery: 'Deductible, then 10% coinsurance' },
      { tier: 'Tier 4 - Specialty Generics', tobieWalgreens: 'Deductible, then 10% coinsurance', nonWalgreensRetail: 'Not Covered', homeDelivery: 'Deductible, then 10% coinsurance' },
      { tier: 'Tier 5 - Specialty Preferred Brands', tobieWalgreens: 'Deductible, then 10% coinsurance', nonWalgreensRetail: 'Not Covered', homeDelivery: 'Deductible, then 10% coinsurance' },
      { tier: 'Tier 6 - Specialty Non-Preferred Brands', tobieWalgreens: 'Deductible, then 10% coinsurance', nonWalgreensRetail: 'Not Covered', homeDelivery: 'Deductible, then 10% coinsurance' },
    ],
  },
];

export const pharmacyBenefits: BenefitCategory = {
  id: 'pharmacy',
  title: 'Pharmacy Benefits',
  carrier: 'Capital Rx',
  icon: 'Activity',
  summary:
    'Prescription drug benefits are provided through Capital Rx and are included automatically when you enroll in a Tobie medical plan. Prescriptions filled at Tobie or Walgreens retail pharmacies have more favorable copays. Specialty drugs (Tiers 4-6) are filled by the Tobie Specialty Pharmacy.',
  keyDetails: [
    'Administered by Capital Rx',
    'Generic drugs are mandatory unless a dispense-as-written (DAW) waiver is prescribed',
    'Tobie/Walgreens pharmacies offer lowest copays',
    'Non-Walgreens pharmacies: $150 brand drug deductible (Premier/Standard/Premium)',
    'Specialty drugs (Tiers 4-6) filled by Tobie Specialty Pharmacy (855-307-6868)',
    'Rx OOP max (non-HDHP plans): $1,600 individual / $3,200 family',
    'HDHP Rx OOP max combined with medical: $6,000 individual / $12,000 family',
    'HDHP: Preventive drugs at no cost; all other drugs subject to deductible then 10% coinsurance (Tobie/Walgreens)',
    'Premier Plan generics: $5 (30-day) / $12 (90-day) at Tobie/Walgreens',
    'Standard/Premium Plan generics: $10 (30-day) / $25 (90-day) at Tobie/Walgreens',
  ],
  eligibility: 'Automatically included with any Tobie medical plan enrollment',
  warnings: [
    'Generic drugs are mandatory unless a DAW waiver is prescribed by your doctor',
    'The cost difference between brand and generic is not covered under copay or OOP limits',
    'Non-Walgreens retail pharmacies have higher costs and a $150 brand drug deductible',
  ],
  links: [{ label: 'Capital Rx Member Tools', url: 'https://cap-rx.com/member-tools' }],
  contacts: [
    { name: 'Capital Rx', role: 'Pharmacy Benefits', phone: '866-622-2779', website: 'https://cap-rx.com/member-tools', category: 'pharmacy' },
    { name: 'Tobie Specialty Pharmacy', role: 'Specialty Drugs (Tiers 4-6)', phone: '855-307-6868', category: 'pharmacy' },
  ],
};
