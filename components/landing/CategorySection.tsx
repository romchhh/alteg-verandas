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
  products: Product[];
}

export function CategorySection({
  id,
  title,
  description,
  catalogHref,
  catalogLabel,
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
          <p className="text-sm text-gray-600 text-center">
            Products for this category will appear here once they are added to the catalog.
          </p>
        ) : (
          <>
            <div className="-mx-4 px-4 overflow-x-auto pb-3 lg:mx-0 lg:px-0">
              <div className="flex flex-nowrap gap-3">
                {products.map((product) => {
                  const price =
                    product.pricePerMeter ??
                    (product.pricePerKg && product.weightPerMeter
                      ? product.pricePerKg * product.weightPerMeter
                      : undefined);
                  const fromText =
                    price != null ? `from ${formatCurrency(price)}` : 'Price on request';

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="w-64 flex-shrink-0 border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col bg-white min-w-0"
                    >
                      <div className="relative h-48 sm:h-52 bg-gray-100">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.nameEn}
                            fill
                            className="object-cover"
                            sizes="256px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-[#050544] mb-1.5 line-clamp-2">
                          {product.nameEn}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{product.dimensions}</p>
                        <div className="mt-auto">
                          <p className="text-sm font-semibold text-[#E65100]">
                            {fromText}{' '}
                            <span className="text-xs text-gray-600">excl. VAT</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 text-right">
              <Link
                href={catalogHref}
                className="text-sm font-semibold text-[#050544] hover:text-[#445DFE] inline-flex items-center gap-1 transition-colors"
              >
                {catalogLabel}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
