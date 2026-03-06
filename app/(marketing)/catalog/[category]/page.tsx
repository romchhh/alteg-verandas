import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types/product';
import { getProducts } from '@/lib/data/products';
import { formatCurrency, getPricePerMeter } from '@/lib/utils/calculations';
import { CatalogFilters, type SortOption } from '@/components/catalog/CatalogFilters';

type CatalogCategoryKey = 'verandas' | 'fencing' | 'profiles' | 'accessories';

const CATALOG_CONFIG: Record<
  CatalogCategoryKey,
  {
    title: string;
    subtitle: string;
    description: string;
    breadcrumbLabel: string;
    filterLabel: string;
    priceHint: string;
    heroImage: string;
    heroAlt: string;
    match: (p: Product) => boolean;
  }
> = {
  verandas: {
    title: 'Verandas & Canopies',
    subtitle: 'Standard veranda kits — guide pricing (from, excl. VAT)',
    description:
      'Choose from a range of veranda kit sizes in polycarbonate or laminated safety glass (VSG). Final pricing will be confirmed for your exact dimensions, roof type and colour.',
    breadcrumbLabel: 'Verandas & Canopies',
    filterLabel: 'Roof type',
    priceHint: 'Typical veranda projects start from approximately £1,500–£3,000 (from price, excl. VAT).',
    heroImage:
      'https://images.unsplash.com/photo-1523419409543-3e4f83b9b4c2?w=1600&auto=format&fit=crop&q=80',
    heroAlt: 'Aluminium veranda and patio cover on a modern UK home',
    match: (p) =>
      (p.applications ?? []).includes('Verandas & Canopies'),
  },
  fencing: {
    title: 'Aluminium Fencing',
    subtitle: 'Guide pricing for aluminium fencing runs (from, excl. VAT)',
    description:
      'Modern aluminium privacy fencing as a long‑life alternative to timber. Use this overview to understand guide prices for typical fence lengths.',
    breadcrumbLabel: 'Aluminium Fencing',
    filterLabel: 'Fence height',
    priceHint: 'Guide pricing from around £100 per metre for a 1 m high fence in RAL 7016 (from price, excl. VAT).',
    heroImage:
      'https://images.unsplash.com/photo-1609918488960-6721c37cb0c7?w=1600&auto=format&fit=crop&q=80',
    heroAlt: 'Contemporary aluminium garden fencing',
    match: (p) =>
      (p.applications ?? []).includes('Aluminium Fencing'),
  },
  profiles: {
    title: 'Profile Systems',
    subtitle: 'Support posts, rafters and profiles for verandas and fencing',
    description:
      'Here you will later find the main aluminium profiles used in veranda and fencing systems. For now we list a few test profiles to illustrate the structure.',
    breadcrumbLabel: 'Profile Systems',
    filterLabel: 'Profile type',
    priceHint: 'Pricing depends on profile, alloy and length. Send us your list for an accurate quotation.',
    heroImage:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&auto=format&fit=crop&q=80',
    heroAlt: 'Aluminium profiles and beams in production',
    match: (p) =>
      (p.applications ?? []).includes('Profile Systems'),
  },
  accessories: {
    title: 'Accessories & Guttering',
    subtitle: 'Seals, guttering and fixings for veranda and fencing systems',
    description:
      'Accessories complete the installation: gutter systems, downpipes, EPDM seals and small parts matched to our veranda and fencing ranges.',
    breadcrumbLabel: 'Accessories & Guttering',
    filterLabel: 'Accessory type',
    priceHint: 'Accessories are usually priced per kit or per metre. Use this page as a guide and then request a detailed quote.',
    heroImage:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&auto=format&fit=crop&q=80',
    heroAlt: 'Aluminium guttering, seals and accessories',
    match: (p) =>
      (p.applications ?? []).includes('Accessories & Guttering'),
  },
};

function getProductPrice(p: Product): number | undefined {
  return getPricePerMeter(p);
}

function matchesRoof(nameEn: string, roofValues: string[]): boolean {
  if (roofValues.length === 0) return true;
  const lower = nameEn.toLowerCase();
  return roofValues.some((r) => {
    if (r === 'polycarbonate') return lower.includes('poly');
    if (r === 'vsg') return lower.includes('vsg') || lower.includes('glass') || lower.includes('safety');
    return lower.includes(r.toLowerCase());
  });
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryCatalogPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const slug = category as CatalogCategoryKey;
  const config = CATALOG_CONFIG[slug];
  const raw = await searchParams;

  if (!config) {
    return (
      <main className="min-h-screen bg-white pt-24 md:pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#050544] mb-3">Category not found</h1>
          <p className="text-gray-600 mb-6">
            The requested category does not exist. Please return to the main categories page.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-[#050544] text-white hover:bg-[#445DFE] rounded-none transition-colors"
          >
            Back to categories
          </Link>
        </div>
      </main>
    );
  }

  const allProducts = await getProducts();
  const categoryProducts = allProducts.filter(config.match);
  const firstProductWithImage = categoryProducts.find((p) => p.image);

  // Read raw min/max price from query without stripping decimals; normalise comma to dot
  const minPriceParam = typeof raw.minPrice === 'string' ? raw.minPrice : '';
  const maxPriceParam = typeof raw.maxPrice === 'string' ? raw.maxPrice : '';
  const sortVal = Array.isArray(raw.sort) ? raw.sort[0] : raw.sort;
  const sortParam = (['price_asc', 'price_desc', 'name'].includes(String(sortVal ?? ''))
    ? sortVal
    : 'price_asc') as SortOption;
  const roofParam = Array.isArray(raw.roof) ? raw.roof : raw.roof ? [raw.roof] : [];
  const materialParam = Array.isArray(raw.material) ? raw.material : raw.material ? [raw.material] : [];
  const finishParam = Array.isArray(raw.finish) ? raw.finish : raw.finish ? [raw.finish] : [];

  const normalisePrice = (value: string): number =>
    value ? Number(value.replace(',', '.')) : NaN;

  const minPriceNum = normalisePrice(minPriceParam);
  const maxPriceNum = normalisePrice(maxPriceParam);

  let products = categoryProducts.filter((p) => {
    const price = getProductPrice(p);
    if (!Number.isNaN(minPriceNum) && price != null && price < minPriceNum) return false;
    if (!Number.isNaN(maxPriceNum) && price != null && price > maxPriceNum) return false;
    if (roofParam.length && !matchesRoof(p.nameEn, roofParam)) return false;
    if (materialParam.length && (!p.material || !materialParam.includes(p.material))) return false;
    if (finishParam.length && (!p.finish || !finishParam.includes(p.finish))) return false;
    return true;
  });

  const priceAsc = (a: Product, b: Product) => (getProductPrice(a) ?? 0) - (getProductPrice(b) ?? 0);
  const priceDesc = (a: Product, b: Product) => (getProductPrice(b) ?? 0) - (getProductPrice(a) ?? 0);
  const nameSort = (a: Product, b: Product) => a.nameEn.localeCompare(b.nameEn);

  if (sortParam === 'price_desc') products = [...products].sort(priceDesc);
  else if (sortParam === 'name') products = [...products].sort(nameSort);
  else products = [...products].sort(priceAsc);

  const prices = categoryProducts.map((p) => getProductPrice(p)).filter((v): v is number => v != null);
  const priceMin = prices.length ? Math.min(...prices) : 0;
  const priceMax = prices.length ? Math.max(...prices) : 10000;

  const roofOptions =
    slug === 'verandas'
      ? [
          { value: 'polycarbonate', label: 'Polycarbonate' },
          { value: 'vsg', label: 'Safety glass / VSG' },
        ]
      : [];
  const materialOptions = [...new Set(categoryProducts.map((p) => p.material).filter(Boolean))] as string[];
  const finishOptions = [...new Set(categoryProducts.map((p) => p.finish).filter(Boolean))] as string[];

  return (
    <main className="min-h-screen bg-white pt-16 md:pt-20">
      {/* Hero / breadcrumbs */}
      <section className="relative border-b border-gray-200 bg-[#050544] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={firstProductWithImage?.image ?? config.heroImage}
            alt={firstProductWithImage?.nameEn ?? config.heroAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={slug === 'verandas'}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/10" />
        </div>
        <div className="relative py-10 sm:py-14 md:py-16 lg:py-20 min-h-[260px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[440px] flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-xs sm:text-sm text-white/80 mb-2 flex flex-wrap gap-1 items-center">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span className="opacity-70">/</span>
              <Link href="/categories" className="hover:text-white">
                Categories
              </Link>
              <span className="opacity-70">/</span>
              <span className="text-white font-medium">{config.breadcrumbLabel}</span>
            </nav>

            <div className="flex flex-col gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl font-bold text-white leading-tight mb-2">
                  {config.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl">
                  {config.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CatalogFilters
                categorySlug={slug}
                minPrice={minPriceParam}
                maxPrice={maxPriceParam}
                sort={sortParam}
                roof={roofParam}
                material={materialParam}
                finish={finishParam}
                priceRange={{ min: priceMin, max: priceMax }}
                roofOptions={roofOptions}
                materialOptions={materialOptions}
                finishOptions={finishOptions}
                resultCount={products.length}
              />
              <span className="text-sm text-gray-600">
                <span className="font-medium text-[#050544]">{products.length}</span>{' '}
                {products.length === 1 ? 'result' : 'results'}
              </span>
            </div>

            {/* Products grid */}
            <div>
              <p className="text-sm text-gray-700 mb-4">{config.description}</p>

              {products.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-600">
                  No products have been added to this category yet. Seed products will appear here once
                  they are created in the database.
                </div>
              ) : (
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

                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col bg-white"
                      >
                        <div className="relative h-56 sm:h-64 bg-gray-100">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.nameEn}
                              fill
                              className="object-cover"
                              sizes="(min-width: 1024px) 25vw, 50vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
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
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

