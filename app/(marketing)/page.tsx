import React from 'react';
import type { Product } from '@/lib/types/product';
import { HeroSection } from '@/components/landing/HeroSection';
import { CategorySection } from '@/components/landing/CategorySection';
import { VerandasCategorySection } from '@/components/landing/VerandasCategorySection';
import { HowToOrderSection } from '@/components/landing/HowToOrderSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { MapSection } from '@/components/landing/MapSection';
import { FactoryGallery } from '@/components/landing/FactoryGallery';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';
import { getProducts } from '@/lib/data/products';
import { getGalleryItems } from '@/lib/gallery';

// Ensure homepage always reads latest products from SQLite in production
export const dynamic = 'force-dynamic';

const CATEGORIES: Array<{
  id: string;
  title: string;
  description: string;
  catalogHref: string;
  catalogLabel: string;
  quoteButtonLabel: string;
  quoteButtonHref: string;
  match: (p: Product) => boolean;
}> = [
  {
    id: 'verandas',
    title: 'Verandas & Canopies',
    description:
      'Tailor‑made aluminium verandas and canopies for British homes. Polycarbonate or safety glass, standard sizes and bespoke on request.',
    catalogHref: '/catalog/verandas',
    catalogLabel: 'Show more',
    quoteButtonLabel: 'Need a bespoke size? Request a custom quote',
    quoteButtonHref: '/contact',
    match: (p) =>
      (p.applications ?? []).includes('Verandas & Canopies'),
  },
  {
    id: 'fencing',
    title: 'Aluminium Fencing',
    description:
      'Modern privacy fencing that never needs painting. Powder‑coated aluminium boards and posts, low maintenance and long life. From £100 per metre (1 m height, RAL 7016 anthracite; other colours on request).',
    catalogHref: '/catalog/fencing',
    catalogLabel: 'Show more',
    quoteButtonLabel: 'Get Fencing Quote',
    quoteButtonHref: '/contact',
    match: (p) =>
      (p.applications ?? []).includes('Aluminium Fencing'),
  },
  {
    id: 'profiles',
    title: 'Profile Systems',
    description:
      'Aluminium support posts, rafters and fence profiles for verandas and fencing. Trade supply across the UK.',
    catalogHref: '/catalog/profiles',
    catalogLabel: 'Show more',
    quoteButtonLabel: 'Enquire About Profiles',
    quoteButtonHref: '/contact',
    match: (p) =>
      (p.applications ?? []).includes('Profile Systems'),
  },
  {
    id: 'accessories',
    title: 'Accessories & Guttering',
    description:
      'Seals, gaskets, guttering and fixings for watertight veranda and fencing installations.',
    catalogHref: '/catalog/accessories',
    catalogLabel: 'Show more',
    quoteButtonLabel: 'Ask About Accessories',
    quoteButtonHref: '/contact',
    match: (p) =>
      (p.applications ?? []).includes('Accessories & Guttering'),
  },
];

export default async function HomePage() {
  const allProducts = await getProducts();
  const galleryItems = getGalleryItems();
  const verandaCategory = CATEGORIES.find((c) => c.id === 'verandas');
  const verandaProducts = verandaCategory
    ? allProducts.filter(verandaCategory.match)
    : [];
  const fencingCategory = CATEGORIES.find((c) => c.id === 'fencing');
  const profilesCategory = CATEGORIES.find((c) => c.id === 'profiles');
  const fencingProducts = fencingCategory
    ? allProducts.filter(fencingCategory.match)
    : [];
  const profileProducts = profilesCategory
    ? allProducts.filter(profilesCategory.match)
    : [];

  return (
    <main className="min-h-screen">
      <FaqJsonLd />
      <HeroSection />

      {/* Verandas section — split into polycarbonate and glass rows */}
      {verandaCategory && verandaProducts.length > 0 && (
        <VerandasCategorySection
          id={verandaCategory.id}
          title={verandaCategory.title}
          description={verandaCategory.description}
          catalogHref={verandaCategory.catalogHref}
          quoteButtonHref={verandaCategory.quoteButtonHref}
          quoteButtonLabel={verandaCategory.quoteButtonLabel}
          products={verandaProducts}
        />
      )}

      {/* Other product categories — fencing mixes with profiles, others show first 4 products */}
      {CATEGORIES.filter((cat) => cat.id !== 'verandas').map((cat) => {
        let products: Product[];

        if (cat.id === 'fencing') {
          const extraProfiles = profileProducts.slice(0, 3);
          products = [...fencingProducts, ...extraProfiles];
        } else {
          products = allProducts.filter(cat.match).slice(0, 4);
        }

        return (
          <CategorySection
            key={cat.id}
            id={cat.id}
            title={cat.title}
            description={cat.description}
            catalogHref={cat.catalogHref}
            catalogLabel={cat.catalogLabel}
            quoteButtonLabel={cat.quoteButtonLabel}
            quoteButtonHref={cat.quoteButtonHref}
            products={products}
          />
        );
      })}

      <FactoryGallery items={galleryItems} />
      <HowToOrderSection />
      <FAQSection />
      <MapSection />
    </main>
  );
}
