import type { FAQItem } from '@/types/benefits';

export const faqItems: FAQItem[] = [
  {
    id: 'faq-open-enrollment',
    question: 'When is Open Enrollment?',
    answer:
      'Open Enrollment is held in November each year. Benefits elected during Open Enrollment become effective January 1 of the upcoming plan year. You have 31 days to enroll in Infor and submit required documentation if enrolling dependents in medical coverage.',
    category: 'enrollment',
  },
  {
    id: 'faq-eligibility',
    question: 'Who is eligible for Tobie benefits?',
    answer:
      'Benefits-eligible team members include full-time employees classified as working 30 hours or more per week (minimum 0.75 FTE) and part-time employees working 24 to 29 hours per week (0.6 to 0.725 FTE). Part-time employees pay higher premium contributions. PRN team members are not eligible for well-being incentives. New hire flexible benefits begin on the date of hire.',
    category: 'enrollment',
  },
  {
    id: 'faq-default-enrollment',
    question: 'What happens if I do not actively enroll in benefits?',
    answer:
      'If you do not actively enroll, you will be assigned a default package that includes only: basic life insurance (company-paid), long-term disability insurance (company-paid), and short-term disability insurance with a 30-day elimination period (voluntary, team member-paid). All other benefit elections, including medical coverage, will default to "waive." You must take action to elect a medical plan.',
    category: 'enrollment',
  },
  {
    id: 'faq-qualifying-life-event',
    question: 'What is a qualifying life event and how do I make changes?',
    answer:
      'A qualifying life event (QLE) includes changes in marital status, change in the number of eligible dependents (birth, adoption), or other IRS-qualifying events. If you experience a QLE, you must make benefit changes in Infor within 31 days of the event date and upload verification documentation. Changes must be consistent with the qualifying life event. Changes are effective on the date of the event.',
    category: 'enrollment',
  },
  {
    id: 'faq-spouse-mandate',
    question: 'What is the spouse mandate for medical coverage?',
    answer:
      'If your spouse is employed and eligible for employer-sponsored group medical coverage, they cannot be enrolled in a Tobie medical plan. If your spouse is self-employed, unemployed, retired, disabled, or their employer does not offer group medical coverage, they may be eligible for Tobie medical coverage with satisfactory documentation. The spouse mandate only applies to medical coverage. A spouse can be enrolled in dental, vision and life insurance regardless of other coverage eligibility.',
    category: 'medical',
  },
  {
    id: 'faq-medical-plans-overview',
    question: 'How do the four medical plans differ?',
    answer:
      'Tobie offers four medical plans: (1) Tobie Premier Plan - lowest premiums and costs in the Tobie Plus Network (3 tiers); best for SC Region team members. (2) Blue Standard Plan - moderate premiums, 4 tiers, HRA wellness incentives up to $900. (3) Blue Premium Plan - higher premiums but lower deductibles/copays, 4 tiers, HRA fixed funds plus wellness incentives. (4) Blue HDHP with HSA - highest deductible but includes HSA with $750/individual or $1,500/family employer contribution; no copays, you pay 100% until deductible then coinsurance applies. All plans include prescription drug coverage through Capital Rx.',
    category: 'medical',
  },
  {
    id: 'faq-hsa',
    question: 'What is an HSA and how does the HDHP work?',
    answer:
      'A Health Savings Account (HSA) is a tax-free savings account available with the Blue High Deductible Health Plan. Tobie contributes $750/individual or $1,500/family annually (prorated for new hires). The HSA has a triple tax advantage: contributions are tax-deductible, earnings grow tax-free, and withdrawals for qualified medical expenses are tax-free. The 2026 contribution limits are $4,400 (individual) and $8,750 (family), with a $1,000 catch-up for age 55+. With the HDHP, you pay 100% of medical expenses until you meet the deductible ($2,000 individual / $4,000 family for Tier 1), then coinsurance (typically 10% in-network) applies. Preventive care and preventive drugs are covered at no cost. HSA funds roll over year to year and are always yours.',
    category: 'medical',
  },
  {
    id: 'faq-hra',
    question: 'What is a Health Reimbursement Account (HRA)?',
    answer:
      'An HRA is an employer-funded account that helps offset out-of-pocket medical costs. Funds are automatically applied when claims are processed and distributed as reimbursements for copays. Team members on the Tobie Premier, Blue Standard, or Blue Premium Plan can earn HRA funds through the well-being program (up to $900 for team member, $275 for spouse). The Blue Premium Plan also provides fixed HRA funds for certain coverage tiers. HRA funds must be used by year-end and do not roll over. If you switch to the HDHP, existing HRA balances are forfeited.',
    category: 'medical',
  },
  {
    id: 'faq-dental',
    question: 'What dental plan options are available?',
    answer:
      'Tobie offers two dental plans administered by Cigna: the Base Plan and Enhanced Plan. Both cover preventive care at 100% with a $50 individual / $150 family deductible. The Base Plan starts with a $1,000 annual maximum that can increase $100/year with preventive use (starting 2027). The Enhanced Plan has a $1,700 annual maximum (in-network) and covers orthodontia with a $2,000 lifetime maximum. Base Plan premiums start at $6.69/pay period; Enhanced Plan starts at $11.59/pay period (employee only).',
    category: 'dental-vision',
  },
  {
    id: 'faq-vision',
    question: 'What does vision coverage include?',
    answer:
      'The vision plan is administered by VSP and covers annual eye exams, lenses, and frames or contact lenses in lieu of eyeglasses. Many in-network services are covered in full or with a copay. Discounts are available on laser vision correction, additional glasses, sunglasses and lens enhancements. Premiums start at $5.17/pay period for employee only.',
    category: 'dental-vision',
  },
  {
    id: 'faq-fsa',
    question: 'What are Flexible Spending Accounts (FSAs)?',
    answer:
      'FSAs, administered by WEX, allow you to set aside pre-tax money for eligible expenses. The Healthcare FSA limit is up to $3,300 (2025 limit; 2026 not yet set at publication). The Dependent Care FSA limit is $7,500 ($3,750 if married filing separately). Important: FSA balances do not carry over year to year. Unused money after the claim submission deadline is forfeited. Note: You cannot have both an HSA (HDHP) and a Healthcare FSA.',
    category: 'financial',
  },
  {
    id: 'faq-wellbeing',
    question: 'How does the well-being program work?',
    answer:
      'All team members are encouraged to participate in well-being activities. Benefits-eligible team members can earn incentives: Premier/Standard/Premium plan members earn up to $900 (HRA) for team member and $275 (HRA) for enrolled spouse. HDHP members earn up to $250 in rewards/points. Non-enrolled benefits-eligible team members earn up to $100. The Healthy Lifestyles Program provides tools for managing diabetes and hypertension for enrolled members with an active MyChart account.',
    category: 'general',
  },
  {
    id: 'faq-retirement',
    question: 'What are the basics of the Tobie Retirement Plus Plan?',
    answer:
      'The Tobie Retirement Plus Plan is managed by Fidelity Investments. New hires are automatically enrolled at a 4% pre-tax contribution rate directed to a State Street Target Retirement Fund. Tobie matches dollar-for-dollar on the first 6% you contribute. You can contribute 1% to 60% of salary in pre-tax and/or Roth. The match vests after 3 years (1,000+ hours/year). You have 90 days to opt out. An Auto Increase Program can raise your contribution 1-3% annually. Loans available up to 50% of vested balance ($1,000-$50,000).',
    category: 'financial',
  },
  {
    id: 'faq-voluntary',
    question: 'What voluntary benefits are available?',
    answer:
      'Tobie offers several voluntary benefits: Accident Insurance (pays for covered injuries), Critical Illness Insurance (lump sum for heart attack, stroke, cancer), Hospital Care Plan (fixed benefit for hospital stays) - all through The Hartford. Additionally: MetLife Legal Plan for legal services, Auto and Home Insurance through YouDecide with payroll deduction, and Nationwide Pet Insurance. All voluntary benefits are employee-paid and most are portable.',
    category: 'general',
  },
  {
    id: 'faq-enrollment-system',
    question: 'How do I access the enrollment system (Infor)?',
    answer:
      'Enroll through Infor HR. On a work computer: from I-Connect, select Tools and Services > Team Member Services > Infor HR & Workforce Management. On a personal computer: go to Tobie.org/Team-Members and select the Infor link. If accessing outside the Tobie network, you will need Microsoft Authenticator. Call the IT Service Desk at 866-966-8268 for help with Microsoft Authenticator.',
    category: 'enrollment',
  },
  {
    id: 'faq-out-of-area',
    question: 'What is out-of-area coverage?',
    answer:
      'Out-of-area plans are available to team members who live beyond a 50-mile radius of a Tobie hospital. These plans have three tiers instead of four: Tobie Network (Tier 1), Blue Options PPO Network (Tier 2), and Out-of-Network (Tier 3). Deductibles and cost-sharing differ slightly from the standard in-area plans. If you qualify, the out-of-area plans will automatically appear in your medical plan options when you enroll in Infor.',
    category: 'medical',
  },
  {
    id: 'faq-change-elections',
    question: 'Can I change my benefit elections after enrollment?',
    answer:
      'Once you enroll, you may not cancel or change your elections until the next Open Enrollment period unless you experience a qualifying life event (QLE). Examples include marriage, divorce, birth/adoption of a child, or loss of other coverage. You have 31 days from the event to submit changes in Infor with supporting documentation. Changes must be consistent with the qualifying life event.',
    category: 'enrollment',
  },
  {
    id: 'faq-capital-rx',
    question: 'What is Capital Rx and how do pharmacy benefits work?',
    answer:
      'Capital Rx is the pharmacy benefits manager for all Tobie medical plans. Prescriptions filled at Tobie or Walgreens pharmacies have the lowest copays. Generic drugs are mandatory unless a dispense-as-written waiver is prescribed. Specialty drugs (Tiers 4-6) must be filled by the Tobie Specialty Pharmacy (855-307-6868). The Rx OOP maximum is $1,600 individual / $3,200 family for non-HDHP plans. For the HDHP, the pharmacy OOP is combined with medical ($6,000 individual / $12,000 family) and preventive drugs are at no cost.',
    category: 'medical',
  },
  {
    id: 'faq-tobacco-surcharge',
    question: 'What is the tobacco-user surcharge and how can I avoid it?',
    answer:
      'Tobacco users pay an additional $45 per pay period for medical coverage. Tobacco-free is defined as not using any tobacco products within 30 days prior to your benefits election date. To avoid the surcharge, you can confirm tobacco-free status during enrollment, or complete the Quitting Tobacco video course in the Tobie well-being portal by October 31, 2026, or obtain PCP documentation of completing a cessation program. Submit proof via ServiceNow HR Inquiry. Refunds may take up to three pay periods.',
    category: 'medical',
  },
];
