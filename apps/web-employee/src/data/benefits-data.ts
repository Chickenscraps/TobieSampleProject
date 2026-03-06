// Master re-export file for all benefits data
import type { BenefitCategory } from '@/types/benefits';
import { dentalBenefits } from './dental';
import { visionBenefits } from './vision';
import { pharmacyBenefits } from './pharmacy';
import { wellbeingPrograms } from './wellbeing';

export { medicalPlans, rxOopMax, rxOopMaxHDHP } from './medical-plans';
export { dentalPlans, dentalPremiums, dentalBenefits } from './dental';
export { visionPremiums, visionBenefits } from './vision';
export { pharmacyPlanDetails, pharmacyBenefits } from './pharmacy';
export { voluntaryBenefits } from './voluntary-benefits';
export { financialBenefits } from './financial-benefits';
export { workLifeBenefits } from './work-life-benefits';
export { wellbeingPrograms, wellbeingIncentives, hraContributions } from './wellbeing';
export { faqItems } from './faq-data';
export { contacts, providers } from './contacts';
export { enrollmentInfo } from './enrollment-info';
export { quickLinks } from './quick-links';

/**
 * Combined array of all benefit categories for the BenefitsOverview grid.
 */
export const benefitCategories: BenefitCategory[] = [
  {
    id: 'medical',
    title: 'Medical',
    carrier: 'BCBSNC',
    icon: 'Heart',
    summary:
      'Choose from four medical plan options — Tobie Premier, Blue Standard, Blue Premium, or Blue HDHP with HSA. All include preventive care at no cost and prescription drug coverage through Capital Rx.',
    keyDetails: [
      'Four plans: Tobie Premier, Blue Standard, Blue Premium, Blue HDHP with HSA',
      'Preventive care covered at 100% in-network',
      'Multi-tier provider networks for flexibility',
      'HRA available with Premier, Standard, and Premium plans',
      'Prescription drug coverage through Capital Rx',
    ],
    eligibility: 'All benefits-eligible team members working 30+ hours/week',
    links: [
      { label: 'Find a Provider', url: 'https://mycreatehealth.com/employee' },
      { label: 'Plan Comparison', url: '/medical-resources' },
    ],
  },
  pharmacyBenefits,
  dentalBenefits,
  visionBenefits,
  {
    id: 'fsa-hsa',
    title: 'FSA / HSA',
    carrier: 'WEX',
    icon: 'Wallet',
    summary:
      'Save pre-tax dollars for healthcare and dependent care expenses. FSAs are administered by WEX. HSA accounts are available with the Blue HDHP and roll over year to year.',
    keyDetails: [
      'Healthcare FSA: up to $3,300/year (2025 limit; 2026 TBD)',
      'Dependent Care FSA: up to $7,500/year',
      'HSA (HDHP only): $4,400 individual / $8,750 family (2026)',
      'Tobie contributes $750/individual or $1,500/family to HSA',
      'HSA funds roll over and are portable',
    ],
    warnings: ['FSA balances do NOT carry over. Unused money is forfeited after the claim deadline.'],
    links: [
      { label: 'WEX Portal', url: 'https://customer.wexinc.com/login/benefits-login/' },
    ],
  },
  {
    id: 'life-add',
    title: 'Life & AD&D',
    carrier: 'The Hartford',
    icon: 'Shield',
    summary:
      'Tobie provides company-paid basic life insurance at 1.5x base pay. Supplemental life and AD&D coverage available for you and your dependents.',
    keyDetails: [
      'Company-paid basic life: 1.5x base pay (up to $1,000,000)',
      'Supplemental life: up to 5x salary (max $1,000,000)',
      'Guaranteed issue up to $500,000',
      'AD&D: $25,000 to $500,000',
      'Spouse and child supplemental options available',
    ],
    employerPaid: 'Basic Life Insurance',
  },
  {
    id: 'disability',
    title: 'Disability',
    carrier: 'The Hartford',
    icon: 'Umbrella',
    summary:
      'Short-term disability is voluntary (team member-paid). Long-term disability is company-paid. Both protect a portion of your income.',
    keyDetails: [
      'STD: 60% of base pay, up to $2,500/week (team member-paid)',
      'LTD: 60% of base pay, up to $15,000/month (company-paid)',
      'STD default: 30-day elimination period',
      'LTD: 90-day waiting period',
      'STD paid after-tax so benefit is tax-free',
    ],
    employerPaid: 'Long-Term Disability',
  },
  {
    id: 'voluntary',
    title: 'Voluntary Benefits',
    carrier: 'Various',
    icon: 'Gift',
    summary:
      'Additional voluntary benefits at group rates including accident, critical illness, hospital care, legal services, auto/home insurance, and pet insurance.',
    keyDetails: [
      'Accident insurance (The Hartford)',
      'Critical illness insurance (The Hartford)',
      'Hospital care plan (The Hartford)',
      'MetLife Legal Plan',
      'Auto & home insurance (YouDecide)',
      'Pet insurance (Nationwide)',
    ],
  },
  {
    id: 'retirement',
    title: 'Retirement',
    carrier: 'Fidelity',
    icon: 'TrendingUp',
    summary:
      'Build your retirement savings with the Tobie Retirement Plus Plan. Tobie matches dollar-for-dollar on the first 6% you contribute.',
    keyDetails: [
      'Dollar-for-dollar match on first 6%',
      'Pre-tax and Roth contribution options',
      'Auto-enrolled at 4% for new hires',
      'Match vests after 3 years of service',
      'Auto Increase Program available',
    ],
    links: [
      { label: 'Fidelity NetBenefits', url: 'https://netbenefits.com/Tobie' },
    ],
  },
  wellbeingPrograms,
  {
    id: 'worklife',
    title: 'Work-Life Benefits',
    icon: 'Briefcase',
    summary:
      'Tobie supports work-life balance with PTO, parental leave, caregiver support, tuition reimbursement, adoption assistance, and consumer discounts.',
    keyDetails: [
      'PTO accrual based on years of service',
      'Seven recognized holidays',
      'Paid parental leave: 4 weeks at 100% pay',
      'Paid caregiver leave: 1 week at 100% pay',
      'Tuition reimbursement: up to $5,250/year',
      'Adoption assistance: up to $3,500/child',
    ],
  },
];

/**
 * Comprehensive plain-text summary of all Tobie benefits for AI chat context.
 * Includes key numbers, deductibles, copays, and contribution amounts.
 */
export const benefitsContentForAI = `
TOBIE 2026 BENEFITS GUIDE - COMPREHENSIVE SUMMARY

=== ENROLLMENT ===
Open Enrollment is held in November each year. Elections become effective January 1. Team members have 31 days to enroll in Infor and submit documentation for dependents.
Default package (if you do not enroll): basic life insurance (company-paid, 1.5x base pay), long-term disability (company-paid), and short-term disability with 30-day elimination period. All other benefits default to "waive" including medical. You MUST actively elect a medical plan.
New hire benefits begin on date of hire. Qualifying life events allow mid-year changes within 31 days.
Enrollment system: Infor HR. Work: I-Connect > Tools and Services > Infor. Home: Tobie.org/Team-Members > Infor link. Microsoft Authenticator needed outside network.
IT Service Desk: 866-966-8268. HR Solutions Center: 800-890-5420 or ServiceNow.

=== ELIGIBILITY ===
Full-time: 30+ hours/week (0.75+ FTE). Part-time: 24-29 hours/week (0.6-0.725 FTE, higher premiums). PRN: not eligible for well-being incentives.
Spouse mandate: If spouse has employer group medical coverage elsewhere, they cannot enroll in Tobie medical. Spouse mandate only applies to medical (dental/vision/life exempt). Documentation required.
Children eligible up to age 26. Documentation: tax return or birth certificate.

=== MEDICAL PLANS (4 options, all include Rx through Capital Rx) ===

1. TOBIE PREMIER PLAN (3 tiers, lowest premiums for Tobie Plus Network)
Recommended for SC Region team members.
Tier 1 (Tobie Plus Network): Deductible $700 individual/$1,400 family. OOP Max $2,500/$5,000.
  - Preventive: $0. PCP: $10 copay. Specialist: $35 copay. Urgent Care: $15 copay.
  - Hospital Inpatient: 5%. Hospital Outpatient: no deductible, 5%. ER: 15%.
  - Mental Health Inpatient: 5%. Mental Health Office: $10 copay.
  - Maternity Hospital: 5%. Maternity Physician: $75 copay.
  - Physical Therapy: $10 copay (no visit limit).
Tier 2 (Alternative Network): Deductible $3,200/$6,400. OOP Max $6,800/$13,600. Generally 25% coinsurance.
Tier 3 (Out-of-Network): Deductible $7,000/$14,000. OOP Max $14,000/$28,000. Generally 50% coinsurance.
Rx OOP Max: $1,600 individual/$3,200 family. Out-of-network Rx not covered.
Full-time premiums (bi-weekly): EE $19.70, EE+Child $80.02, EE+Spouse $129.32, Family $149.20.
HRA: Wellness incentive up to $900 (EE), $1,175 (EE+Spouse or Family).

2. BLUE STANDARD PLAN (4 tiers)
Tier 1 (Enhanced/Tobie Network): Deductible $1,200/$2,400. OOP Max $4,200/$8,400.
  - Preventive: $0. PCP: $25 copay. Specialist: $65 copay. Urgent Care: $35 copay.
  - Hospital Inpatient: 15%. Hospital Outpatient: no deductible, 15%. ER: 20%.
  - Mental Health Inpatient: 15%. Mental Health Office: $25 copay.
  - Maternity Hospital: 15%. Maternity Physician: $200 copay.
  - Physical Therapy: $25 copay (no visit limit).
Tier 2 (Preferred/Blue Options PPO): Deductible $2,200/$4,400. OOP Max $6,200/$12,400. Generally 25% coinsurance.
Tier 3 (Non-Preferred): Deductible $3,200/$6,400. OOP Max $6,800/$13,600. Generally 40% coinsurance.
Tier 4 (Out-of-Network): Deductible $4,400/$8,800. OOP Max $9,400/$18,800. Generally 50%.
Rx OOP Max: $1,600/$3,200.
Full-time premiums (bi-weekly): EE $41.19, EE+Child $122.93, EE+Spouse $182.17, Family $230.42.
HRA: Wellness incentive up to $900 (EE), $1,175 (EE+Spouse or Family).

3. BLUE PREMIUM PLAN (4 tiers, lower deductibles/copays, higher premiums)
Tier 1 (Enhanced/Tobie Network): Deductible $900/$1,800. OOP Max $3,200/$6,400.
  - Preventive: $0. PCP: $20 copay. Specialist: $50 copay. Urgent Care: $20 copay.
  - Hospital Inpatient: 10%. Hospital Outpatient: no deductible, 10%. ER: 15%.
  - Mental Health Inpatient: 10%. Mental Health Office: $20 copay.
  - Maternity Hospital: 10%. Maternity Physician: $100 copay.
  - Physical Therapy: $20 copay (no visit limit).
Tier 2 (Preferred): Deductible $1,950/$3,900. OOP Max $5,000/$10,000. Generally 25%.
Tier 3 (Non-Preferred): Deductible $2,800/$5,600. OOP Max $5,600/$11,200. Generally 40%.
Tier 4 (Out-of-Network): Deductible $3,850/$7,700. OOP Max $7,700/$15,400. Generally 50%.
Rx OOP Max: $1,600/$3,200.
Full-time premiums (bi-weekly): EE $76.69, EE+Child $191.08, EE+Spouse $255.70, Family $335.11.
HRA fixed funds: EE $0, EE+Child $375, EE+Spouse $450, Family $750. Plus wellness incentive up to $900 (EE), $1,175 (EE+Spouse or Family).

4. BLUE HIGH DEDUCTIBLE HEALTH PLAN (HDHP) WITH HSA (4 tiers)
No copays. You pay 100% until deductible, then coinsurance. Preventive care at $0.
Tier 1 (Enhanced): Deductible $2,000/$4,000. OOP Max $6,000/$12,000. 10% coinsurance after deductible.
Tier 2 (Preferred): Deductible $3,000/$6,000. OOP Max $7,500/$15,000. 25% coinsurance.
Tier 3 (Non-Preferred): Deductible $4,000/$8,000. OOP Max $8,300/$16,600. 40% coinsurance.
Tier 4 (Out-of-Network): Deductible $7,000/$14,000. OOP Max $14,000/$28,000. 50%.
Rx OOP combined with medical. Preventive drugs at no cost.
HSA Tobie contribution: $750/individual, $1,500/family (prorated for new hires).
  Upfront lump sum: $250/individual, $500/family. Per paycheck: $19.23/individual, $38.46/family.
2026 HSA limits: $4,400 individual, $8,750 family, $1,000 catch-up (55+).
Full-time premiums (bi-weekly): EE $35.01, EE+Child $104.49, EE+Spouse $154.85, Family $195.86.

Tobacco-user surcharge: $45/pay period. Avoid by being tobacco-free 30 days prior to election, or completing Quitting Tobacco course or PCP cessation program by Oct 31, 2026.

=== PHARMACY (Capital Rx) ===
All medical plans include Rx through Capital Rx. Tobie/Walgreens pharmacies have lowest copays.
Generic drugs mandatory (unless DAW waiver). Specialty drugs (Tiers 4-6) via Tobie Specialty Pharmacy (855-307-6868).

Premier Plan (Tobie/Walgreens): Generics $5 (30-day)/$12 (90-day). Preferred brand $35/$85. Non-preferred $60/$180. Specialty generic $70. Specialty preferred $100. Specialty non-preferred $200.
Standard/Premium Plans (Tobie/Walgreens): Generics $10/$25. Preferred brand $40/$100. Non-preferred $80/$240. Specialty generic $100. Specialty preferred $150. Specialty non-preferred $400.
HDHP: Deductible then 10% coinsurance (Tobie/Walgreens) or 25% (non-Walgreens). Preventive drugs no cost.
Non-Walgreens retail: $150 brand drug deductible (non-HDHP plans).
Capital Rx: 866-622-2779, cap-rx.com/member-tools.

=== DENTAL (Cigna) ===
Two plans: Base Plan and Enhanced Plan. Both: preventive 100%, $50 individual/$150 family deductible.
Base Plan: Annual max starts $1,000 (increases $100/year with preventive care, starting 2027). No orthodontia. Premiums: EE $6.69, EE+Child $24.02, EE+Spouse $23.58, Family $30.61.
Enhanced Plan: Annual max $1,700 in-network/$1,300 non-network. Orthodontia $2,000 lifetime max ($100 deductible). Premiums: EE $11.59, EE+Child $34.61, EE+Spouse $33.77, Family $47.91.
Both: Basic services 20% (bridges 50%), major 50%, endodontics/periodontics/oral surgery 20%.
Cigna: 800-Cigna24, mycigna.com.

=== VISION (VSP) ===
Annual eye exams, lenses, frames or contacts. Discounts on laser vision, sunglasses, lens enhancements.
Premiums (bi-weekly): EE $5.17, EE+Child $8.29, EE+Spouse $8.11, Family $13.35.
VSP: 800-877-7195, vsp.com.

=== FLEXIBLE SPENDING ACCOUNTS (WEX) ===
Healthcare FSA: up to $3,300 (2025 limit, 2026 TBD). Dependent Care FSA: up to $7,500 ($3,750 if married filing separately).
FSA funds do not roll over. Unused money forfeited after claim deadline. Cannot have HSA + Healthcare FSA.
WEX: 866-451-3399, customer.wexinc.com.

=== WELL-BEING PROGRAMS ===
Premier/Standard/Premium team member: up to $900 HRA. Enrolled spouse: up to $275 HRA.
HDHP team member: up to $250 rewards/points. Non-enrolled eligible: up to $100 rewards.
PRN: not eligible.
HRA funds must be used by year-end (2026 fixed funds do not roll over). Switching to HDHP forfeits HRA.
Healthy Lifestyles Program for diabetes/hypertension management (requires Tobie medical enrollment + MyChart).
EAP (AllOne Health): 800-822-4847, Tobie.mylifeexpert.com.

=== VOLUNTARY BENEFITS ===
Accident Insurance (The Hartford): Pays benefit for covered injuries. No health questions. Portable. Employee-paid.
Critical Illness Insurance (The Hartford): Lump sum for heart attack, stroke, cancer. Choose benefit amount. Portable.
Hospital Care Plan (The Hartford): Fixed benefit for hospital stays. Portable. Employee-paid.
The Hartford: 866-547-4205, myhealthhub.app/thehartford.
MetLife Legal Plan: Attorney network for home buying, wills, traffic tickets. MetLife: 800-821-6400, legalplans.com.
Auto/Home Insurance (YouDecide): Competitive rates, payroll deduction, side-by-side comparison. 800-923-4609.
Pet Insurance (Nationwide): Through Team Member Advantages. youdecide.com/Tobie. Client ID: NOV668.

=== FINANCIAL BENEFITS ===
Short-Term Disability (The Hartford): 60% base pay, up to $2,500/week. Default: 30-day elimination period. Option: 15-day. Team member-paid (after-tax, so benefit is tax-free). Directors+ do not elect.
Long-Term Disability (The Hartford): 60% base pay, $15,000/month max, 90-day waiting period. Company-paid.
Basic Life Insurance (The Hartford): 1.5x base pay, up to $1,000,000. Company-paid. Auto-enrolled.
Supplemental Life: Guaranteed up to $500,000. Increments 1x-5x base pay (max $1,000,000 pending approval). Dependent life available.
AD&D: Employee-only or family. $25,000-$500,000. Spouses over 70 not eligible.
The Hartford (Disability/Life): 888-277-4647, mybenefits.thehartford.com.

Tobie Retirement Plus Plan (Fidelity): Auto-enrolled at 4% pre-tax. Dollar-for-dollar match on first 6%.
Contribute 1%-60% salary (pre-tax and/or Roth, 0.1% increments). Match vests after 3 years (1,000+ hours/year).
Default investment: State Street Target Retirement Fund. 90 days to opt out.
Auto Increase: 1-3% annual increase option. Loans: up to 50% vested balance ($1,000-$50,000).
2026 HSA limits: $4,400 individual, $8,750 family.
Fidelity: 800-343-0860, netbenefits.com/Tobie. Planning: 800-642-7131, fidelity.com/reserve.

=== WORK-LIFE BENEFITS ===
PTO by years of service (bi-weekly hours for 40-hr week): <1yr: 8.00, 1-2yr: 8.92, 2-5yr: 9.54, 5-15yr: 10.47, 15+: 12.00.
7 holidays: New Year's, MLK Jr. Day, Memorial Day, July 4th, Labor Day, Thanksgiving, Christmas.
Parental leave: 4 weeks at 100% base pay (after 12 months, 1,250 hours).
Caregiver leave: 1 week at 100% base pay.
Bereavement: 40 hrs (spouse/child), 24 hrs (parent/sibling/grandparent), 8 hrs (other in-laws).
Military leave: supplemental pay for difference between military and Tobie base pay.
Caregiver Support (Family First): 800-214-5410, care.family-first.com.
Adoption Assistance: Up to $3,500/child ($7,000/year max).
Tuition Reimbursement: After 90 days. Full-time: $5,250/year. Part-time: $2,625/year. Email: TuitionReimbursement@Tobie.org.
Consumer Discounts (YouDecide): youdecide.com/Tobie, 800-923-4609. Client ID: NOV668.

=== OUT-OF-AREA COVERAGE ===
Available for team members living 50+ miles from a Tobie hospital. Three tiers instead of four.
Blue Standard Out-of-Area: Tier 1 and Tier 2 share same deductible ($1,200/$2,400 individual/family). OOP Max $4,200/$8,400.
Blue Premium Out-of-Area: Tier 1 and Tier 2 share same deductible ($900/$1,800). OOP Max $3,200/$6,400.

=== KEY CONTACTS ===
HR Solutions Center: 800-890-5420, AskHR@Tobie.org, benefits.Tobie.org
IT Service Desk: 866-966-8268
BCBSNC (Medical/HRA): 877-722-4871, mycreatehealth.com/employee
Capital Rx (Pharmacy): 866-622-2779, cap-rx.com/member-tools
Tobie Specialty Pharmacy: 855-307-6868
WEX (HSA/FSA): 866-451-3399
Cigna (Dental): 800-Cigna24, mycigna.com
VSP (Vision): 800-877-7195, vsp.com
AllOne Health (EAP): 800-822-4847, Tobie.mylifeexpert.com
The Hartford (Voluntary): 866-547-4205, myhealthhub.app/thehartford
The Hartford (Disability/Life): 888-277-4647, mybenefits.thehartford.com
MetLife (Legal): 800-821-6400, legalplans.com
Fidelity (Retirement): 800-343-0860, netbenefits.com/Tobie
Family First (Caregiver): 800-214-5410, care.family-first.com
YouDecide (Discounts): 800-923-4609, youdecide.com/Tobie
`.trim();
