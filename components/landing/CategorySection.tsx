import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types/product';
import { formatCurrency } from '@/lib/utils/calculations';

export interface CategorySectionProps {
  id: string;
  title: string;
  description: string;
  catalogHref: string;
  catalogLabel: string;
  /** CTA button under the product grid — leads to quote/contact form (per TZ) */
  quoteButtonLabel: string;
  quoteButtonHref: string;
  products: Product[];
}

export function CategorySection({
  id,
  title,
  description,
  catalogHref,
  catalogLabel,
  quoteButtonLabel,
  quoteButtonHref,
  products,
}: CategorySectionProps) {
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

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-gray-600 text-center">
              Products for this category will appear here once they are added to the catalog.
            </p>
            <Link
              href={quoteButtonHref}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-[#050544] text-white hover:bg-[#445DFE] rounded-none shadow-sm hover:shadow-md transition-colors"
            >
              {quoteButtonLabel}
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </Link>
          </div>
        ) : (
          <>
            <div className="-mx-4 px-4 lg:mx-0 lg:px-0">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {products.map((product) => {
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
                  const imgSrc =
                    product.image && imgIsServer ? product.image : product.image ?? '';

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col bg-white min-w-0"
                    >
                      <div className="relative h-56 sm:h-64 bg-gray-100">
                        {imgSrc ? (
                          imgIsServer ? (
                            <Image
                              src={imgSrc}
                              alt={product.nameEn}
                              fill
                              className="object-cover"
                              sizes="256px"
                            />
                          ) : (
                            <img
                              src={imgSrc}
                              alt={product.nameEn}
                              className="h-full w-full object-cover"
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
                        <div className="mt-auto">
                          <p className="text-sm font-semibold text-[#E65100]">
                            {fromText}{' '}
                            {price != null && (
                              <span className="text-xs text-gray-600">excl. VAT</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={quoteButtonHref}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-[#050544] text-white hover:bg-[#445DFE] rounded-none shadow-sm hover:shadow-md transition-colors"
              >
                {quoteButtonLabel}
                <span aria-hidden="true" className="ml-1">
                  →
                </span>
              </Link>
              <Link
                href={catalogHref}
                className="text-sm font-medium text-[#050544] hover:text-[#445DFE] underline underline-offset-2 transition-colors"
              >
                {catalogLabel}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
