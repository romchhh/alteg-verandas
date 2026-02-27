'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProductCard } from '@/components/catalog/ProductCard';
import { PRODUCT_CATEGORIES, CATALOG_PRODUCTS } from '@/lib/constants/catalog';
import { Product, ProductCategory, ProductCategoryInfo } from '@/lib/types/product';
import { Button } from '@/components/shared/Button';
import { useContactModalStore } from '@/store/contactModal';
import { getUploadImageSrc, isServerUploadUrl } from '@/lib/utils/image';

const INITIAL_PRODUCTS = 20; // 5 rows on desktop (4 columns x 5 rows = 20 products)
const PRODUCTS_PER_PAGE = 20; // Load 20 more products each time (5 more rows)

function CustomQuoteCTA() {
  const openContactModal = useContactModalStore((s) => s.open);
  return (
    <div className="text-center">
      <h3 className="text-2xl sm:text-3xl font-bold text-[#050544] mb-4">
        Can&apos;t find the profile you need?
      </h3>
      <p className="text-base sm:text-lg text-gray-700 mb-6">
        Send us a drawing or description — we&apos;ll manufacture to order.
      </p>
      <Button
        onClick={() => openContactModal('quote')}
        variant="primary"
        className="bg-[#050544] hover:bg-[#445DFE] text-white px-8 py-4 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Contact us!
      </Button>
    </div>
  );
}

export const CatalogSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [displayCount, setDisplayCount] = useState(INITIAL_PRODUCTS);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, ProductCategoryInfo> | null>(null);
  const [productsFromApi, setProductsFromApi] = useState<Product[] | null>(null);

  // Desired display order for catalog categories
  const CATEGORY_DISPLAY_ORDER: string[] = [
    'angle',
    'box_section',
    'channel',
    'flat_bar',
    'mesh',
    'round_bar',
    'sheet',
    'square_bar',
    'tube_pipe',
    'rsj_ibeam',
    'checker_plate',
    't_section',
  ];

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.ok ? res.json() : null)
      .then((list: { id: string; name: string; nameEn: string; description: string; image?: string }[] | null) => {
        if (!Array.isArray(list)) return;
        const next: Record<string, ProductCategoryInfo> = {};
        list.forEach((c) => {
          const base = PRODUCT_CATEGORIES[c.id as ProductCategory];
          if (base) {
            next[c.id] = { ...base, name: c.name, nameEn: c.nameEn, description: c.description, image: c.image || base.image };
          } else {
            next[c.id] = {
              name: c.name,
              nameEn: c.nameEn,
              description: c.description,
              descriptionEn: c.description,
              specifications: '',
              specificationsEn: '',
              applications: [],
              applicationsEn: [],
              image: c.image || '',
            };
          }
        });
        setCategoriesMap(next);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.ok ? res.json() : null)
      .then((data: { products?: Product[] } | null) => {
        if (data && Array.isArray(data.products)) setProductsFromApi(data.products);
      })
      .catch(() => {});
  }, []);

  const productsListRaw = productsFromApi !== null && productsFromApi.length > 0 ? productsFromApi : CATALOG_PRODUCTS;

  // Hide products whose category no longer exists in the category list
  const productsList = productsListRaw.filter((p) => {
    const catId = String(p.category);
    const map = categoriesMap ?? (PRODUCT_CATEGORIES as Record<string, ProductCategoryInfo>);
    return !!map[catId];
  });

  const filteredProductsRaw =
    selectedCategory === 'all'
      ? productsList
      : productsList.filter((p) => String(p.category) === selectedCategory);

  // Show in-stock products first, then out-of-stock
  const filteredProducts = [...filteredProductsRaw].sort((a, b) => {
    if (a.inStock === b.inStock) return 0;
    return a.inStock ? -1 : 1;
  });

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;
  const rawCategoriesEntries = Object.entries(categoriesMap ?? PRODUCT_CATEGORIES);
  const categories = [...rawCategoriesEntries].sort(([a], [b]) => {
    const ia = CATEGORY_DISPLAY_ORDER.indexOf(a);
    const ib = CATEGORY_DISPLAY_ORDER.indexOf(b);
    const sa = ia === -1 ? Number.MAX_SAFE_INTEGER : ia;
    const sb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib;
    return sa - sb || a.localeCompare(b);
  });
  const categoriesRef = useRef(categories);
  categoriesRef.current = categories;

  // Reset display count when category changes
  useEffect(() => {
    setDisplayCount(INITIAL_PRODUCTS);
  }, [selectedCategory]);

  // Sync selected category from hash only on mount and on hashchange (not every render), so user can change category by clicking
  useEffect(() => {
    const syncFromHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.slice(1);
      if (!hash.startsWith('category-')) return;
      const cat = hash.replace('category-', '');
      const cats = categoriesRef.current;
      if (cats.some(([key]) => key === cat)) {
        setSelectedCategory(cat);
        const id = `category-${cat}`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        });
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + PRODUCTS_PER_PAGE);
  };

  return (
    <section id="catalog" className="scroll-mt-20 md:scroll-mt-24 pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#050544] mb-2 sm:mb-3 leading-tight tracking-tight px-2">
          Aluminium Products Direct from ALTEG
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed px-2">
            Standard aluminium profiles in stock. Cutting to size. Retail and wholesale supply across the UK.
          </p>

          {/* Advantages */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div className="bg-transparent border border-black rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-[#445DFE] mb-1 sm:mb-2">£77+</div>
              <div className="text-xs sm:text-sm text-black leading-tight">Free UK Delivery (ex. VAT)</div>
            </div>
            <div className="bg-transparent border border-black rounded-lg p-3 sm:p-4">
              <div className="font-bold text-[#445DFE] mb-1 sm:mb-2 break-words text-[clamp(0.75rem,4vw,1.5rem)] sm:text-xl md:text-2xl">Competitive</div>
              <div className="text-xs sm:text-sm text-black leading-tight">Pricing</div>
            </div>
            <div className="bg-transparent border border-black rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-[#445DFE] mb-1 sm:mb-2">Free</div>
              <div className="text-xs sm:text-sm text-black leading-tight">Cutting to Size</div>
            </div>
            <div className="bg-transparent border border-black rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-[#445DFE] mb-1 sm:mb-2">All items</div>
              <div className="text-xs sm:text-sm text-black leading-tight">cut to preferred size upon request</div>
            </div>
          </div>
        </div>

        {/* Category Filter - Horizontal Scroll with Background Images */}
        <div className="mb-8 sm:mb-12 relative">
          {/* Scroll Indicators */}
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {/* Mobile Scroll Hint */}
          <div className="sm:hidden text-center mb-2">
            <span className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Swipe to see all categories
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-hide px-4 sm:px-0 py-4 snap-x snap-mandatory">
            <div className="flex gap-3 sm:gap-4">
              {/* All Products Category */}
              <button
                id="category-all"
                onClick={() => setSelectedCategory('all')}
                className={`flex-shrink-0 snap-center flex flex-col h-40 w-[calc((100vw-3.5rem)/2.4)] sm:h-40 sm:w-52 rounded-xl overflow-hidden group transition-all duration-300 border-2 scroll-mt-24 ${
                  selectedCategory === 'all'
                    ? 'border-[#445DFE] shadow-lg scale-105'
                    : 'border-transparent shadow-md hover:shadow-lg'
                }`}
              >
                <div className="relative flex-1 min-h-0 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
                    style={{
                      backgroundImage: `url(/production_1.jpg)`,
                    }}
                  />
                </div>
                <div className="bg-[#050544] px-3 py-2 flex items-center justify-center min-h-[3rem]">
                  <h3 className="text-white font-bold text-center text-xs sm:text-base leading-tight line-clamp-2">
                    All Products
                  </h3>
                </div>
              </button>

              {/* Category Cards */}
              {categories.map(([key, info]) => (
                <button
                  key={key}
                  id={`category-${key}`}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex-shrink-0 snap-center flex flex-col h-40 w-[calc((100vw-3.5rem)/2.4)] sm:h-40 sm:w-52 rounded-xl overflow-hidden group transition-all duration-300 border-2 scroll-mt-24 ${
                    selectedCategory === key
                      ? 'border-[#445DFE] shadow-lg scale-105'
                      : 'border-transparent shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="relative flex-1 min-h-0 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
                      style={{
                        backgroundImage: (() => {
                          const base = info.image || '/production_1.jpg';
                          if (isServerUploadUrl(base)) {
                            return `url(${getUploadImageSrc(base, true)})`;
                          }
                          return `url(${base})`;
                        })(),
                      }}
                    />
                  </div>
                  <div className="bg-[#050544] px-3 py-2 flex items-center justify-center min-h-[3rem]">
                    <h3 className="text-white font-bold text-center text-xs sm:text-base leading-tight line-clamp-2">
                      {info.nameEn}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Scroll Hint */}
          <div className="hidden sm:flex justify-center mt-3">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Scroll horizontally to see all categories
            </span>
          </div>

          {/* Selected category description */}
          {selectedCategory !== 'all' && categoriesMap?.[selectedCategory]?.descriptionEn && (
            <div className="mt-4 p-4 bg-[#E9EDF4] rounded-lg border border-[#050544]/10">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {categoriesMap[selectedCategory].descriptionEn}
              </p>
            </div>
          )}
        </div>

        {/* Products Grid - 2 columns on mobile, 2 on small tablets, 3 on tablets, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryInfo={(() => {
                const cat = (categoriesMap ?? (PRODUCT_CATEGORIES as Record<string, ProductCategoryInfo>))[product.category] ?? (PRODUCT_CATEGORIES as Record<string, ProductCategoryInfo>)[product.category] ?? { name: '', nameEn: product.category, description: '', descriptionEn: '', specifications: '', specificationsEn: '', applications: [], applicationsEn: [], image: '' };
                const categoryImage = (PRODUCT_CATEGORIES as Record<string, { image?: string }>)[product.category]?.image;
                return { ...cat, image: cat.image || categoryImage || '' };
              })()}
            />
          ))}
        </div>

        {/* Show More Button */}
        {hasMore && (
          <div className="text-center mb-12">
            <Button
              onClick={handleShowMore}
              variant="outline"
              className="border-2 border-[#445DFE] text-[#445DFE] hover:bg-[#445DFE] hover:text-white px-8 py-3 text-base font-semibold transition-all duration-300"
            >
              Show More ({filteredProducts.length - displayCount} remaining)
            </Button>
          </div>
        )}

        {/* No products found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No products found in this category.</p>
            <Button
              onClick={() => setSelectedCategory('all')}
              variant="primary"
              className="bg-[#445DFE] hover:bg-[#050544] text-white"
            >
              View All Products
            </Button>
          </div>
        )}

        {/* Custom Order CTA */}
        <div className="max-w-3xl mx-auto mt-12 sm:mt-16 bg-transparent rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 border-2 border-black">
          <CustomQuoteCTA />
        </div>
      </div>
    </section>
  );
};
