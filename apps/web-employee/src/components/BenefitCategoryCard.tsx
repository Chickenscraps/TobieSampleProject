import { ExternalLink, AlertCircle } from 'lucide-react';
import { BenefitCategory } from '@/types/benefits';
import { getIcon } from '@/lib/icons';

// Map category IDs to their illustration images
const categoryImages: Record<string, { src: string; alt: string }> = {
  medical: {
    src: '/images/medical-ichra.png',
    alt: 'Doctor speaking with patient, with insurance symbol overlay.',
  },
  pharmacy: {
    src: '/images/pharmacy.png',
    alt: 'Pharmacist handing a prescription medicine bottle to a patient at a counter.',
  },
  dental: {
    src: '/images/dental.png',
    alt: 'Dentist examining a patient\'s teeth in a dental clinic.',
  },
  vision: {
    src: '/images/vision.png',
    alt: 'Optometrist fitting eyeglasses on a patient during an eye exam.',
  },
  'life-add': {
    src: '/images/life-disability.png',
    alt: 'Family walking together outdoors, symbolizing life insurance protection.',
  },
  disability: {
    src: '/images/life-disability.png',
    alt: 'Family walking together outdoors, symbolizing disability insurance protection.',
  },
  retirement: {
    src: '/images/retirement.png',
    alt: 'Couple reviewing financial charts on a tablet, planning for retirement.',
  },
  worklife: {
    src: '/images/work-life.png',
    alt: 'Woman relaxing and reading a book, representing work-life balance.',
  },
};

interface BenefitCategoryCardProps {
  category: BenefitCategory;
}

export function BenefitCategoryCard({ category }: BenefitCategoryCardProps) {
  const IconComponent = getIcon(category.icon);
  const illustration = categoryImages[category.id];

  return (
    <div className="benefit-card bg-white border border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Illustration */}
      {illustration && (
        <div className="w-full h-32 bg-brand-surface flex items-center justify-center overflow-hidden">
          <img
            src={illustration.src}
            alt={illustration.alt}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-11 h-11 bg-tobie-50 flex items-center justify-center">
          <IconComponent className="h-5.5 w-5.5 text-tobie-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">
            {category.title}
          </h3>
          {category.carrier && (
            <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium bg-tobie-50 text-tobie-700">
              {category.carrier}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {category.summary}
      </p>

      {/* Key Details */}
      <ul className="space-y-1.5 mb-4 flex-1">
        {category.keyDetails.map((detail, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="flex-shrink-0 w-2 h-2 mt-1.5 bg-tobie-500" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>

      {/* Warnings */}
      {category.warnings && category.warnings.length > 0 && (
        <div className="mb-4">
          {category.warnings.map((warning, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200"
            >
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 font-medium">{warning}</p>
            </div>
          ))}
        </div>
      )}

      {/* Employer-paid badge */}
      {category.employerPaid && (
        <div className="mb-4 px-3 py-2 bg-accent-50 border border-accent-200">
          <p className="text-xs text-accent-700 font-medium">
            Employer-Paid: {category.employerPaid}
          </p>
        </div>
      )}

      {/* CTA Links */}
      {category.links && category.links.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-gray-100">
          {category.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-tobie-600 hover:text-tobie-700 transition-colors"
            >
              {link.label}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
