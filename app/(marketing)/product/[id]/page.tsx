import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Product } from '@/lib/types/product';
import { getProductById, getProducts } from '@/lib/data/products';
import { formatCurrency, getPricePerMeter } from '@/lib/utils/calculations';
import { ProductOrderButton } from '@/components/product/ProductOrderButton';

const APPLICATION_TO_SLUG: Record<string, string> = {
  'Verandas & Canopies': 'verandas',
  'Aluminium Fencing': 'fencing',
  'Profile Systems': 'profiles',
  'Accessories & Guttering': 'accessories',
};

function getCategorySlug(product: Product): { slug: string; label: string } | null {
  const app = product.applications?.[0];
  if (!app) return null;
  const slug = APPLICATION_TO_SLUG[app];
  return slug ? { slug, label: app } : { slug: 'categories', label: app };
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product || product.hidden) notFound();

  const allProducts = await getProducts();
  const categorySlug = getCategorySlug(product);
  const price = getPricePerMeter(product);
  const priceText = price != null ? `from ${formatCurrency(price)}` : 'Price on request';

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && !p.hidden)
    .filter((p) => {
      if (product.applications?.length) {
        return (p.applications ?? []).some((a) => product.applications!.includes(a));
      }
      return p.category === product.category;
    })
    .slice(0, 10);

  const descriptionBullets: string[] = [];
  if (product.descriptionEn) descriptionBullets.push(product.descriptionEn);
  if (product.material) descriptionBullets.push(`Material: ${product.material}`);
  if (product.finish) descriptionBullets.push(`Finish: ${product.finish}`);
  if (product.dimensions) descriptionBullets.push(`Dimensions: ${product.dimensions}`);
  if (descriptionBullets.length === 0 && product.applications?.length) {
    descriptionBullets.push(`Category: ${product.applications.join(', ')}`);
  }

  return (
    <main className="min-h-screen bg-white pt-16 md:pt-20 pb-16">
      <section className="border-b border-gray-200 bg-[#F5F7FB] py-4 sm:py-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs sm:text-sm text-gray-600 mb-2 flex flex-wrap gap-1 items-center">
            <Link href="/" className="hover:text-[#050544]">Home</Link>
            <span className="opacity-60">/</span>
            <Link href="/categories" className="hover:text-[#050544]">Categories</Link>
            {categorySlug && (
              <>
                <span className="opacity-60">/</span>
                <Link href={`/catalog/${categorySlug.slug}`} className="hover:text-[#050544]">
                  {categorySlug.label}
                </Link>
              </>
            )}
            <span className="opacity-60">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[180px] sm:max-w-none">
              {product.nameEn}
            </span>
          </nav>
        </div>
      </section>

      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.nameEn}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              {product.dimensions && (
                <div className="absolute top-4 left-4 rounded-lg bg-amber-400 px-3 py-2 text-sm font-bold text-gray-900 shadow-md">
                  {product.dimensions} · Aluminium
                </div>
              )}
            </div>

            {/* Right: details */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#050544] mb-2 leading-tight">
                {product.nameEn}
              </h1>
              <p className="text-sm text-gray-500 mb-3">Art. no. {product.id}</p>
              <div className="flex items-center gap-2 mb-4">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden />
                    In stock
                  </span>
                ) : (
                  <span className="text-sm text-amber-700">On request</span>
                )}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#E65100] mb-4">
                {priceText}{' '}
                <span className="text-sm font-normal text-gray-600">excl. VAT</span>
              </p>
              <ProductOrderButton
                productId={product.id}
                productName={product.nameEn}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#050544] hover:bg-[#445DFE] text-white font-semibold rounded-none transition-colors"
              />

              {product.applications?.length ? (
                <p className="mt-4 text-xs text-gray-500">
                  Categories: {product.applications.join(', ')}
                </p>
              ) : null}

              {descriptionBullets.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-[#050544] mb-3">
                    Details
                  </h2>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {descriptionBullets.map((text, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#445DFE]">•</span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-[#050544] mb-6">
                Similar products
              </h2>
              <div className="-mx-4 px-4 overflow-x-auto pb-4 lg:mx-0 lg:px-0">
                <div className="flex gap-3">
                  {relatedProducts.map((p) => {
                    const pPrice = getPricePerMeter(p);
                    const pText = pPrice != null ? `from ${formatCurrency(pPrice)}` : 'Price on request';
                    return (
                      <Link
                        key={p.id}
                        href={`/product/${p.id}`}
                            className="w-64 flex-shrink-0 border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white flex flex-col hover:shadow-md transition-shadow"
                          >
                            <div className="relative h-48 bg-gray-100">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.nameEn}
                              fill
                              className="object-cover"
                              sizes="224px"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                            <div className="p-5 flex flex-col flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-[#050544] mb-1.5 line-clamp-2">
                                  {p.nameEn}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">{p.dimensions}</p>
                          <p className="text-sm font-semibold text-[#E65100] mt-auto">
                            {pText} <span className="text-xs text-gray-600">excl. VAT</span>
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
