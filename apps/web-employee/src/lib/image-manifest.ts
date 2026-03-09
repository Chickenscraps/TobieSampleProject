/**
 * Central image manifest for all site illustrations.
 * Every illustration reference should go through this file for easy maintenance.
 */

export type IllustrationVariant = 'hero' | 'sectionHeader' | 'benefitCard' | 'ctaBlock' | 'icon';

export interface IllustrationEntry {
  src: string;
  alt: string;
  variant: IllustrationVariant;
  width: number;
  height: number;
}

// ─── Hero ────────────────────────────────────────────────────
export const heroIllustration: IllustrationEntry = {
  src: '/images/hero-banner.png',
  alt: 'Diverse team of professionals holding documents, welcoming employees to the benefits guide.',
  variant: 'hero',
  width: 750,
  height: 329,
};

// ─── Section Headers ─────────────────────────────────────────
export const benefitsOverviewIllustration: IllustrationEntry = {
  src: '/images/benefits-overview.png',
  alt: 'Collage of healthcare, financial, and wellness scenes representing the full benefits package.',
  variant: 'sectionHeader',
  width: 724,
  height: 265,
};

export const faqIllustration: IllustrationEntry = {
  src: '/images/faq-illustration.png',
  alt: 'Support representative with headset next to a question mark speech bubble, answering frequently asked questions.',
  variant: 'sectionHeader',
  width: 400,
  height: 266,
};

export const providerDirectoryIllustration: IllustrationEntry = {
  src: '/images/provider-directory.png',
  alt: 'Person browsing a provider search interface with doctor profile cards.',
  variant: 'sectionHeader',
  width: 389,
  height: 201,
};

export const searchCareIllustration: IllustrationEntry = {
  src: '/images/search-care.png',
  alt: 'Person searching for healthcare providers with a magnifying glass over doctor profiles.',
  variant: 'sectionHeader',
  width: 387,
  height: 211,
};

// ─── Benefit Cards ───────────────────────────────────────────
export const benefitCardImages: Record<string, IllustrationEntry> = {
  medical: {
    src: '/images/medical.png',
    alt: 'Doctor consulting with a patient in a clinic setting.',
    variant: 'benefitCard',
    width: 471,
    height: 266,
  },
  pharmacy: {
    src: '/images/pharmacy.png',
    alt: 'Pharmacist handing medication to a patient at a pharmacy counter.',
    variant: 'benefitCard',
    width: 434,
    height: 277,
  },
  dental: {
    src: '/images/dental.png',
    alt: 'Dentist examining a patient in a dental clinic.',
    variant: 'benefitCard',
    width: 483,
    height: 285,
  },
  vision: {
    src: '/images/vision.png',
    alt: 'Optometrist fitting eyeglasses on a patient during an eye exam.',
    variant: 'benefitCard',
    width: 519,
    height: 286,
  },
  'life-add': {
    src: '/images/life-disability.png',
    alt: 'Happy family standing together, symbolizing life insurance protection.',
    variant: 'benefitCard',
    width: 447,
    height: 277,
  },
  disability: {
    src: '/images/life-disability.png',
    alt: 'Family together outdoors, representing disability insurance security.',
    variant: 'benefitCard',
    width: 447,
    height: 277,
  },
  retirement: {
    src: '/images/retirement.png',
    alt: 'Financial advisor showing growth charts on a tablet to a colleague.',
    variant: 'benefitCard',
    width: 470,
    height: 266,
  },
  worklife: {
    src: '/images/work-life.png',
    alt: 'Woman relaxing and reading a book, representing work-life balance.',
    variant: 'benefitCard',
    width: 484,
    height: 276,
  },
};

// ─── CTA Blocks ──────────────────────────────────────────────
export const downloadGuideIllustration: IllustrationEntry = {
  src: '/images/download-guide.png',
  alt: 'Documents and download icon representing the downloadable benefits guide.',
  variant: 'ctaBlock',
  width: 253,
  height: 153,
};

export const enrollmentCtaIllustration: IllustrationEntry = {
  src: '/images/enrollment-cta.png',
  alt: 'Employee completing enrollment on a laptop with a calendar in the background.',
  variant: 'ctaBlock',
  width: 372,
  height: 210,
};

export const supportIllustration: IllustrationEntry = {
  src: '/images/support.png',
  alt: 'Support team member helping an employee, with virtual assistance available.',
  variant: 'ctaBlock',
  width: 422,
  height: 190,
};

// ─── Quick Link Icons ────────────────────────────────────────
export const quickLinkIconImages: Record<string, string> = {
  'Benefits Guide': '/images/icon-benefits-guide.png',
  'Enrollment Portal': '/images/icon-enrollment.png',
  'Medical Resources': '/images/icon-medical-resources.png',
  'Contact HR': '/images/icon-contact-hr.png',
  'Find a Provider': '/images/icon-find-provider.png',
  'EAP Resources': '/images/icon-vision-care.png',
};
