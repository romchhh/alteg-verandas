import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types/product';
import { formatCurrency } from '@/lib/utils/calculations';

export interface VerandasCategorySectionProps {
  id: string;
  title: string;
  description: string;
  catalogHref: string;
  quoteButtonHref: string;
  quoteButtonLabel: string;
  products: Product[];
}

export const VerandasCategorySection: React.FC<VerandasCategorySectionProps> = ({
  id,
  title,
  description,
  catalogHref,
  quoteButtonHref,
  quoteButtonLabel,
  products,
}) => {
  // Heuristic split: polycarbonate vs VSG/safety glass
  const polycarbonate = products.filter(
    (p) =>
      /poly/i.test(p.nameEn) ||
      (p.applications ?? []).some((a) =>
        /polycarbonate|Terrace roofing kits – polycarbonate/i.test(a)
      )
  );
  const vsg = products.filter(
    (p) =>
      /vsg|glass/i.test(p.nameEn) ||
      (p.applications ?? []).some((a) =>
        /VSG|Terrace roofing kits – VSG glass/i.test(a)
      )
  );

  const renderGrid = (items: Product[]) => {
    if (items.length === 0) {
      return (
        <p className="text-sm text-gray-600 text-center">
          Products for this roof type will appear here once they are added to the catalog.
        </p>
      );
    }

    return (
      <div className="-mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {items.slice(0, 4).map((product) => {
            const price =
              product.pricePerMeter ??
              (product.pricePerKg && product.weightPerMeter
                ? product.pricePerKg * product.weightPerMeter
                : undefined);
            const isSetHeuristic =
              product.id.startsWith('LED-SET-') ||
              product.id.startsWith('FENCE-SET-') ||
              /set/i.test(product.nameEn);
            const unitLabel =
              price != null
                ? product.priceUnit ?? (isSetHeuristic ? 'per set' : 'per m')
                : '';
            const fromText =
              price != null ? `from ${formatCurrency(price)} ${unitLabel}` : 'Price on request';

            const imgIsServer = product.image && product.image.startsWith('/uploads/');
            const imgSrc = product.image && imgIsServer ? product.image : product.image ?? '';

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col bg-white min-w-0"
              >
                <div className="relative aspect-square bg-gray-100">
                  {imgSrc ? (
                    imgIsServer ? (
                      <Image
                        src={imgSrc}
                        alt={product.nameEn}
                        fill
                        className="object-cover object-left-top"
                        sizes="256px"
                      />
                    ) : (
                      <img
                        src={imgSrc}
                        alt={product.nameEn}
                        className="h-full w-full object-cover object-left-top"
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[#050544] mb-2 line-clamp-2">
                    {product.nameEn}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{product.dimensions}</p>
                  <div className="mt-auto space-y-2">
                    <p className="text-sm font-semibold text-[#E65100]">
                      {fromText}{' '}
                      {price != null && (
                        <span className="text-xs text-gray-600">excl. VAT</span>
                      )}
                    </p>
                    <div className="pt-1">
                      <span className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold bg-[#050544] text-white hover:bg-[#445DFE] rounded-none transition-colors">
                        Request a quote
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section
      id={id}
      className="scroll-mt-24 bg-[#F5F7FB] py-10 sm:py-14 md:py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#050544] mb-2">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Polycarbonate grid */}
        <div className="mb-8 sm:mb-10">
          <h3 className="text-lg sm:text-xl font-semibold text-[#050544] mb-3 text-center sm:text-left">
            Polycarbonate roof veranda kits
          </h3>
          {renderGrid(polycarbonate)}
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={quoteButtonHref}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-[#050544] text-white hover:bg-[#445DFE] rounded-none shadow-sm hover:shadow-md transition-colors"
            >
              Need a bespoke size? Request a custom quote
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </Link>
            <Link
              href={catalogHref}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold border border-[#050544] text-[#050544] hover:bg-[#050544] hover:text-white rounded-none shadow-sm hover:shadow-md transition-colors ml-0 sm:ml-auto"
            >
              Show more veranda sizes
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* VSG grid */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#050544] mb-3 text-center sm:text-left">
            Safety glass (VSG) veranda kits
          </h3>
          {renderGrid(vsg)}
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={quoteButtonHref}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-[#050544] text-white hover:bg-[#445DFE] rounded-none shadow-sm hover:shadow-md transition-colors"
            >
              Need a bespoke size? Request a custom quote
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </Link>
            <Link
              href={catalogHref}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold border border-[#050544] text-[#050544] hover:bg-[#050544] hover:text-white rounded-none shadow-sm hover:shadow-md transition-colors ml-0 sm:ml-auto"
            >
              Show more veranda sizes
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

