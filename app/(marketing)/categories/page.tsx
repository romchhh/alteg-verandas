import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types/product';
import { getProducts } from '@/lib/data/products';
import { getUploadImageSrc, isServerUploadUrl } from '@/lib/utils/image';

const CATEGORY_CONFIG: Array<{
  id: 'verandas' | 'fencing' | 'profiles' | 'accessories';
  title: string;
  description: string;
  heroDescription: string;
  bulletPoints: string[];
  catalogHref: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  match: (p: Product) => boolean;
}> = [
  {
    id: 'verandas',
    title: 'Verandas & Canopies',
    description:
      'Tailor‑made aluminium verandas and canopies for British homes. Polycarbonate or safety glass, standard sizes and bespoke on request.',
    heroDescription:
      'Made‑to‑measure aluminium verandas and canopies for British homes. Available with polycarbonate or laminated safety glass (VSG) roofing, powder‑coated structure and integrated guttering.',
    bulletPoints: [
      'Typical sizes from approx. 4×3 m up to 7×4.5 m',
      'Standard depths and widths, bespoke options on request',
      'From price shown on the UK site, excl. VAT',
    ],
    catalogHref: '/catalog/verandas',
    primaryCtaLabel: 'View verandas catalog',
    secondaryCtaLabel: 'Get veranda quote',
    match: (p) =>
      (p.applications ?? []).includes('Verandas & Canopies'),
  },
  {
    id: 'fencing',
    title: 'Aluminium Fencing',
    description:
      'Modern privacy fencing that never needs painting. Powder‑coated aluminium boards and posts, low maintenance and long life.',
    heroDescription:
      'Modern aluminium privacy fencing as a long‑life alternative to timber panels and concrete posts. Boards, posts and capping are powder‑coated and low‑maintenance.',
    bulletPoints: [
      'Guide pricing from around £100 per metre (from price, excl. VAT)',
      'Typical fence height around 1 m, higher options available',
      'Standard RAL 7016 anthracite grey, other colours to order',
    ],
    catalogHref: '/catalog/fencing',
    primaryCtaLabel: 'View fencing catalog',
    secondaryCtaLabel: 'Get fencing quote',
    match: (p) =>
      (p.applications ?? []).includes('Aluminium Fencing'),
  },
  {
    id: 'profiles',
    title: 'Profile Systems',
    description:
      'Aluminium support posts, rafters and fence profiles for verandas and fencing. Trade supply across the UK.',
    heroDescription:
      'Aluminium profile systems for verandas, canopies and fencing: support posts, rafters and beams, fence posts and infill profiles for trade and project customers.',
    bulletPoints: [
      'Support posts (e.g. around 110×110 mm with base plates)',
      'Load‑bearing roof beams and rafters for glass and polycarbonate roofs',
      'Fence posts, boards, capping and rails for aluminium fencing',
    ],
    catalogHref: '/catalog/profiles',
    primaryCtaLabel: 'View profiles catalog',
    secondaryCtaLabel: 'Enquire about profiles',
    match: (p) =>
      (p.applications ?? []).includes('Profile Systems'),
  },
  {
    id: 'accessories',
    title: 'Accessories & Guttering',
    description:
      'Seals, gaskets, guttering and fixings for watertight veranda and fencing installations.',
    heroDescription:
      'Finishing components for watertight, long‑life installations: seals, gaskets, guttering, fixings and trims matched to our veranda and fencing systems.',
    bulletPoints: [
      'EPDM rubber seals and gaskets for glass and polycarbonate',
      'Wall connection profiles and cover cap seals',
      'Aluminium gutters, downpipes, end caps and fixings',
    ],
    catalogHref: '/catalog/accessories',
    primaryCtaLabel: 'View accessories catalog',
    secondaryCtaLabel: 'Ask about accessories',
    match: (p) =>
      (p.applications ?? []).includes('Accessories & Guttering'),
  },
];

export default async function CategoriesPage() {
  const allProducts = await getProducts();

  return (
    <main className="min-h-screen bg-white pt-16 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#050544] to-[#445DFE] text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight tracking-tight">
              Product Categories
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Explore our main product areas: verandas &amp; canopies, aluminium fencing, profile systems
              and accessories.
            </p>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
            {CATEGORY_CONFIG.map((cat) => {
              const firstProductWithImage = allProducts.find(
                (p) => cat.match(p) && p.image
              );
              const rawImageSrc =
                firstProductWithImage?.image ??
                (cat.id === 'verandas'
                  ? 'https://images.unsplash.com/photo-1523419409543-3e4f83b9b4c2?w=900&auto=format&fit=crop&q=80'
                  : cat.id === 'fencing'
                  ? 'https://images.unsplash.com/photo-1609918488960-6721c37cb0c7?w=900&auto=format&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop&q=80');
              const imageIsServer = rawImageSrc && isServerUploadUrl(rawImageSrc);
              const imageSrc = rawImageSrc
                ? imageIsServer
                  ? getUploadImageSrc(rawImageSrc, true)
                  : rawImageSrc
                : '';
              const imageAlt =
                firstProductWithImage?.nameEn ??
                (cat.id === 'verandas'
                  ? 'Aluminium veranda attached to a modern UK home'
                  : cat.id === 'fencing'
                  ? 'Contemporary aluminium garden fencing'
                  : cat.id === 'profiles'
                  ? 'Aluminium profiles and beams in production'
                  : 'Aluminium guttering, seals and accessories');

              return (
                <article
                  key={cat.id}
                  className="border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#445DFE]/40 transition-all duration-300"
                >
                  <div className="relative h-56 sm:h-64 md:h-72 bg-gray-100">
                    {imageSrc ? (
                      imageIsServer ? (
                        <Image
                          src={imageSrc}
                          alt={imageAlt}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 50vw, 100vw"
                        />
                      ) : (
                        <img
                          src={imageSrc}
                          alt={imageAlt}
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
                  <div className="p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#050544] mb-2">
                      {cat.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 mb-4">
                      {cat.heroDescription}
                    </p>
                    <ul className="text-sm text-gray-700 mb-5 list-disc list-inside space-y-1">
                      {cat.bulletPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={cat.catalogHref}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold border border-[#050544] text-[#050544] hover:bg-[#050544] hover:text-white rounded-none transition-colors"
                      >
                        {cat.primaryCtaLabel}
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-[#050544] text-white hover:bg-[#445DFE] rounded-none transition-colors"
                      >
                        {cat.secondaryCtaLabel}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

