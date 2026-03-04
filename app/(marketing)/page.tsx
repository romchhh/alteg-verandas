import React from 'react';
import type { Product } from '@/lib/types/product';
import { HeroSection } from '@/components/landing/HeroSection';
import { CategorySection } from '@/components/landing/CategorySection';
import { TrustSection } from '@/components/landing/TrustSection';
import { HowToOrderSection } from '@/components/landing/HowToOrderSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { MapSection } from '@/components/landing/MapSection';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';
import { getProducts } from '@/lib/data/products';

const CATEGORIES: Array<{
  id: string;
  title: string;
  description: string;
  catalogHref: string;
  catalogLabel: string;
  match: (p: Product) => boolean;
}> = [
  {
    id: 'verandas',
    title: 'Verandas & Canopies',
    description:
      'Tailor‑made aluminium verandas and canopies for British homes. Polycarbonate or safety glass, standard sizes and bespoke on request.',
    catalogHref: '/catalog/verandas',
    catalogLabel: 'View all verandas',
    match: (p) =>
      (p.applications ?? []).includes('Verandas & Canopies') ||
      p.category === 'custom_profile',
  },
  {
    id: 'fencing',
    title: 'Aluminium Fencing',
    description:
      'Modern privacy fencing that never needs painting. Powder‑coated aluminium boards and posts, low maintenance and long life.',
    catalogHref: '/catalog/fencing',
    catalogLabel: 'View all fencing',
    match: (p) =>
      (p.applications ?? []).includes('Aluminium Fencing') ||
      p.category === 'square_bar',
  },
  {
    id: 'profiles',
    title: 'Profile Systems',
    description:
      'Aluminium support posts, rafters and fence profiles for verandas and fencing. Trade supply across the UK.',
    catalogHref: '/catalog/profiles',
    catalogLabel: 'View all profiles',
    match: (p) =>
      (p.applications ?? []).includes('Profile Systems') ||
      p.category === 'angle' ||
      p.category === 'channel',
  },
  {
    id: 'accessories',
    title: 'Accessories & Guttering',
    description:
      'Seals, gaskets, guttering and fixings for watertight veranda and fencing installations.',
    catalogHref: '/catalog/accessories',
    catalogLabel: 'View all accessories',
    match: (p) =>
      (p.applications ?? []).includes('Accessories & Guttering') ||
      p.category === 'sheet',
  },
];

export default async function HomePage() {
  const allProducts = await getProducts();

  return (
    <main className="min-h-screen">
      <FaqJsonLd />
      <HeroSection />

      {/* Product categories — same layout for all */}
      {CATEGORIES.map((cat) => (
        <CategorySection
          key={cat.id}
          id={cat.id}
          title={cat.title}
          description={cat.description}
          catalogHref={cat.catalogHref}
          catalogLabel={cat.catalogLabel}
          products={allProducts.filter(cat.match)}
        />
      ))}

      <TrustSection />
      <HowToOrderSection />
      <FAQSection />
      <MapSection />
    </main>
  );
}
