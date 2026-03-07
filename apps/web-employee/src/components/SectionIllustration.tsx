import type { IllustrationEntry, IllustrationVariant } from '@/lib/image-manifest';

/**
 * Variant-based styling for illustrations.
 * - hero: wide banner, centred, generous height
 * - sectionHeader: medium, centred above section heading
 * - benefitCard: compact card header image
 * - ctaBlock: medium, sits beside or above CTA copy
 * - icon: small inline icon
 */
const variantStyles: Record<
  IllustrationVariant,
  { container: string; img: string }
> = {
  hero: {
    container: 'w-full flex justify-center',
    img: 'w-full max-h-[340px] object-contain',
  },
  sectionHeader: {
    container: 'flex justify-center mb-6',
    img: 'w-52 sm:w-64 max-h-48 object-contain',
  },
  benefitCard: {
    container: 'w-full h-44 bg-brand-surface flex items-center justify-center overflow-hidden',
    img: 'w-full h-full object-contain p-2',
  },
  ctaBlock: {
    container: 'flex justify-center',
    img: 'w-40 sm:w-52 max-h-44 object-contain',
  },
  icon: {
    container: 'flex items-center justify-center',
    img: 'w-10 h-10 object-contain',
  },
};

interface SectionIllustrationProps {
  illustration: IllustrationEntry;
  /** Override the variant from the illustration entry */
  variant?: IllustrationVariant;
  /** Extra container className */
  className?: string;
  /** Override image className */
  imgClassName?: string;
  /** Whether to use eager loading (for above-the-fold content) */
  priority?: boolean;
}

export function SectionIllustration({
  illustration,
  variant,
  className = '',
  imgClassName = '',
  priority = false,
}: SectionIllustrationProps) {
  const v = variant ?? illustration.variant;
  const styles = variantStyles[v];

  return (
    <div className={`${styles.container} ${className}`}>
      <img
        src={illustration.src}
        alt={illustration.alt}
        width={illustration.width}
        height={illustration.height}
        className={imgClassName || styles.img}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        decoding={priority ? 'sync' : 'async'}
      />
    </div>
  );
}
