'use client';

import { useState } from 'react';
import { ExternalLink, AlertCircle, ChevronDown } from 'lucide-react';
import { BenefitCategory } from '@/types/benefits';
import { getIcon } from '@/lib/icons';
import { benefitCardImages } from '@/lib/image-manifest';
import { SectionIllustration } from './SectionIllustration';

interface BenefitCategoryCardProps {
  category: BenefitCategory;
}

const CATEGORY_COLORS: Record<string, string> = {
  medical: '#2563EB',
  'fsa-hsa': '#059669',
  'life-add': '#7C3AED',
  disability: '#D97706',
  voluntary: '#E11D48',
  retirement: '#4F46E5',
  worklife: '#0D9488',
};

export function BenefitCategoryCard({ category }: BenefitCategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = getIcon(category.icon);
  const illustration = benefitCardImages[category.id];
  const borderColor = CATEGORY_COLORS[category.id] || '#1E6BB0';

  // Show first 2 key details in collapsed view, rest in expanded
  const previewDetails = category.keyDetails.slice(0, 2);
  const expandedDetails = category.keyDetails.slice(2);
  const hasExpandableContent = expandedDetails.length > 0 || category.warnings?.length || category.employerPaid || (category.links && category.links.length > 0);

  return (
    <div className="bg-white shadow-card border border-gray-100 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 border-l-[3px] flex flex-col overflow-hidden" style={{ borderLeftColor: borderColor }}>
      {/* Compact Header — icon, title, carrier */}
      <div className="px-5 pt-5 pb-0">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-tobie-50 flex items-center justify-center">
            <IconComponent className="h-5 w-5 text-tobie-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 leading-tight">
              {category.title}
            </h3>
            {category.carrier && (
              <span className="inline-block mt-0.5 text-xs font-medium text-tobie-600">
                {category.carrier}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary — always visible */}
      <div className="px-5 pt-3 pb-2">
        <p className="text-xs text-gray-600 leading-relaxed">
          {category.summary}
        </p>
      </div>

      {/* Preview key details — first 2 always visible */}
      <ul className="px-5 pb-3 space-y-1">
        {previewDetails.map((detail, index) => (
          <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
            <span className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-tobie-500" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>

      {/* Expanded Content */}
      {hasExpandableContent && (
        <>
          <div
            className="accordion-content"
            style={{
              maxHeight: isExpanded ? '600px' : '0px',
              opacity: isExpanded ? 1 : 0,
            }}
          >
            <div className="px-5 pb-3">
              {/* Remaining key details */}
              {expandedDetails.length > 0 && (
                <ul className="space-y-1 mb-3">
                  {expandedDetails.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 bg-tobie-500" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Illustration (shown only when expanded) */}
              {illustration && (
                <div className="mb-3">
                  <SectionIllustration
                    illustration={illustration}
                    variant="benefitCard"
                  />
                </div>
              )}

              {/* Warnings */}
              {category.warnings && category.warnings.length > 0 && (
                <div className="mb-3 space-y-1.5">
                  {category.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200"
                    >
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 font-medium">{warning}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Employer-paid badge */}
              {category.employerPaid && (
                <div className="mb-3 px-2.5 py-2 bg-accent-50 border border-accent-200">
                  <p className="text-xs text-accent-700 font-medium">
                    Employer-Paid: {category.employerPaid}
                  </p>
                </div>
              )}

              {/* CTA Links */}
              {category.links && category.links.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                  {category.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target={link.url.startsWith('http') ? '_blank' : undefined}
                      rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-tobie-600 hover:text-tobie-700 transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Expand/Collapse button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-medium text-tobie-600 hover:text-tobie-700 hover:bg-tobie-50 border-t border-gray-100 transition-colors mt-auto"
          >
            {isExpanded ? 'Show Less' : 'Learn More'}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </>
      )}
    </div>
  );
}
