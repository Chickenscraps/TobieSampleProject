export interface EnrollmentInfo {
  openEnrollmentPeriod: string;
  effectiveDate: string;
  enrollmentDeadlineDays: number;
  enrollmentSystem: string;
  enrollmentSteps: EnrollmentStep[];
  qualifyingLifeEvents: string[];
  requiredDocumentation: DocumentationRequirement[];
  defaultBenefits: string[];
  importantNotes: string[];
}

export interface EnrollmentStep {
  step: number;
  title: string;
  description: string;
}

export interface DocumentationRequirement {
  dependent: string;
  documents: string[];
}

export const enrollmentInfo: EnrollmentInfo = {
  openEnrollmentPeriod: 'November each year',
  effectiveDate: 'January 1 of the upcoming plan year',
  enrollmentDeadlineDays: 31,
  enrollmentSystem: 'Infor HR & Workforce Management',

  enrollmentSteps: [
    {
      step: 1,
      title: 'Access Infor',
      description:
        'On a work computer: from I-Connect, select Tools and Services > Team Member Services > Infor HR & Workforce Management. On a personal computer: go to Tobie.org/Team-Members and select the Infor link. Outside the Tobie network, use Microsoft Authenticator to authenticate.',
    },
    {
      step: 2,
      title: 'Prepare Your Information',
      description:
        'Have information ready for yourself, your dependents and your life insurance beneficiaries, including full names, dates of birth and Social Security numbers.',
    },
    {
      step: 3,
      title: 'Review and Compare Plans',
      description:
        'Visit benefits.Tobie.org for medical plan comparison tools, plan summaries and detailed information about all benefit options.',
    },
    {
      step: 4,
      title: 'Make Your Elections',
      description:
        'Select your medical plan, dental plan, vision coverage, FSA contributions, voluntary benefits, and life insurance options. Designate beneficiaries for life insurance and the retirement plan.',
    },
    {
      step: 5,
      title: 'Upload Required Documentation',
      description:
        'If enrolling dependents in medical coverage, upload marriage certificates, proof of joint debt/ownership, spouse mandate documentation, and/or birth certificates or tax returns for children.',
    },
    {
      step: 6,
      title: 'Submit Enrollment',
      description:
        'Review all selections carefully and submit. Once enrolled, you may not cancel or change elections until the next Open Enrollment unless you experience a qualifying life event.',
    },
  ],

  qualifyingLifeEvents: [
    'Change in marital status (marriage, divorce, legal separation)',
    'Change in number of eligible dependents (birth, adoption, placement for adoption)',
    'Loss of other health coverage',
    'Change in employment status affecting benefit eligibility',
    'Change in dependent eligibility (e.g., child aging out at 26)',
    'Court order requiring coverage for a dependent',
    'Entitlement to Medicare or Medicaid',
    'COBRA qualifying event',
  ],

  requiredDocumentation: [
    {
      dependent: 'Spouse',
      documents: [
        'Copy of marriage certificate',
        'Proof of joint debt/ownership (must show both names, dated within past 90 days)',
        'Spouse mandate documentation (one of the following): current proof of unemployment benefits, letter from spouse employer confirming no medical coverage eligibility, or 2024/2025 federal tax return verifying spouse is self-employed/retired/disabled/unemployed',
      ],
    },
    {
      dependent: 'Children (up to age 26)',
      documents: [
        'Copy of front page of current federal income tax return listing the child(ren) (financial information and all but last 4 SSN digits may be removed)',
        'If child is not on tax return: copy of birth certificate showing team member name',
      ],
    },
  ],

  defaultBenefits: [
    'Basic life insurance (company-paid, 1.5x base pay up to $1,000,000)',
    'Long-term disability insurance (company-paid, 60% of base pay, $15,000/month max)',
    'Short-term disability insurance with 30-day elimination period (voluntary, team member-paid)',
  ],

  importantNotes: [
    'You must actively elect a medical plan. Failure to do so will result in no medical coverage with Tobie.',
    'All other benefit elections will default to "waive" if you do not actively enroll.',
    'New hire flexible benefits begin on the date of hire.',
    'Employment status change benefits take effect on the date of the status change.',
    'Physician practice affiliation benefits take effect on the date of practice affiliation.',
    'You have 31 days from a qualifying life event to make changes in Infor.',
    'Benefit changes must be consistent with the qualifying life event.',
    'For questions or assistance, call 800-890-5420 or submit an inquiry via ServiceNow.',
    'For technical help accessing Infor HR, call the IT Service Desk at 866-966-8268.',
    'Payroll premiums are bi-weekly and pre-tax, which lowers the amount of taxes you pay.',
  ],
};
