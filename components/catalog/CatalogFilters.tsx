'use client';

import React, { useCallback, useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export type SortOption = 'price_asc' | 'price_desc' | 'name';

export interface CatalogFiltersProps {
  categorySlug: string;
  /** Current values from URL */
  minPrice: string;
  maxPrice: string;
  sort: SortOption;
  roof: string[];
  material: string[];
  finish: string[];
  /** Available options (from products) */
  priceRange: { min: number; max: number };
  roofOptions: { value: string; label: string }[];
  materialOptions: string[];
  finishOptions: string[];
  resultCount: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name A–Z' },
];

function buildQuery(
  current: URLSearchParams,
  updates: Record<string, string | string[] | undefined>
): URLSearchParams {
  const next = new URLSearchParams(current);
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === '') {
      next.delete(key);
      continue;
    }
    if (Array.isArray(value)) {
      next.delete(key);
      value.filter(Boolean).forEach((v) => next.append(key, v));
      continue;
    }
    next.set(key, value);
  }
  return next;
}

export function CatalogFilters({
  categorySlug,
  minPrice,
  maxPrice,
  sort,
  roof,
  material,
  finish,
  priceRange,
  roofOptions,
  materialOptions,
  finishOptions,
  resultCount,
}: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const updateFilters = useCallback(
    (updates: Record<string, string | string[] | undefined>) => {
      startTransition(() => {
        const current = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
        const next = buildQuery(current, updates);
        const q = next.toString();
        router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
      });
    },
    [pathname, router]
  );

  // Derive current numeric bounds from props (URL params + available range)
  const priceMinNum = Math.max(
    priceRange.min,
    minPrice ? parseFloat(minPrice) || priceRange.min : priceRange.min
  );
  const priceMaxNum = Math.min(
    priceRange.max,
    maxPrice ? parseFloat(maxPrice) || priceRange.max : priceRange.max
  );

  // Local UI state for sliders so they move immediately, independent of navigation
  const [localMin, setLocalMin] = useState(priceMinNum);
  const [localMax, setLocalMax] = useState(priceMaxNum);

  // Keep local slider state in sync when URL / props change
  React.useEffect(() => {
    setLocalMin(priceMinNum);
  }, [priceMinNum]);

  React.useEffect(() => {
    setLocalMax(priceMaxNum);
  }, [priceMaxNum]);
  const rangeSpan = priceRange.max - priceRange.min;
  const step =
    rangeSpan <= 100
      ? Math.max(Math.round(rangeSpan / 40), 1)
      : rangeSpan <= 1000
      ? 10
      : 50;
  const minVal = Math.min(localMin, localMax);
  const maxVal = Math.max(localMin, localMax);

  const handleMinPriceSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const v = Math.min(raw, localMax);
    setLocalMin(v);
    updateFilters({ minPrice: v <= priceRange.min ? undefined : String(v) });
  };

  const handleMaxPriceSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const v = Math.max(raw, localMin);
    setLocalMax(v);
    updateFilters({ maxPrice: v >= priceRange.max ? undefined : String(v) });
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ sort: (e.target.value as SortOption) || undefined });
  };

  const toggleRoof = (value: string) => {
    const next = roof.includes(value) ? roof.filter((r) => r !== value) : [...roof, value];
    updateFilters({ roof: next.length ? next : undefined });
  };

  const toggleMaterial = (value: string) => {
    const next = material.includes(value) ? material.filter((m) => m !== value) : [...material, value];
    updateFilters({ material: next.length ? next : undefined });
  };

  const toggleFinish = (value: string) => {
    const next = finish.includes(value) ? finish.filter((f) => f !== value) : [...finish, value];
    updateFilters({ finish: next.length ? next : undefined });
  };

  const clearAll = () => {
    startTransition(() => router.push(pathname, { scroll: false }));
  };

  const hasActiveFilters =
    minPrice !== '' ||
    maxPrice !== '' ||
    sort !== 'price_asc' ||
    roof.length > 0 ||
    material.length > 0 ||
    finish.length > 0;

  const filtersContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#050544]">
          Filters
        </h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-[#445DFE] hover:text-[#050544] transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#050544] transition-colors"
            aria-label="Close filters"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Price range — sliders */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Price range (excl. VAT)
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[11px] text-gray-600 mb-1">
                <span>From</span>
                <span className="font-semibold text-[#050544]">£{minVal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={step}
                value={minVal}
                onChange={handleMinPriceSlider}
                className="w-full h-2 rounded-full appearance-none bg-gray-200 accent-[#445DFE] cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#445DFE] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#445DFE] [&::-moz-range-thumb]:border-0"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-gray-600 mb-1">
                <span>To</span>
                <span className="font-semibold text-[#050544]">£{maxVal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={step}
                value={maxVal}
                onChange={handleMaxPriceSlider}
                className="w-full h-2 rounded-full appearance-none bg-gray-200 accent-[#445DFE] cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#445DFE] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#445DFE] [&::-moz-range-thumb]:border-0"
              />
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-gray-500">
            £{minVal.toLocaleString()} – £{maxVal.toLocaleString()} (guide)
          </p>
        </div>

        {/* Sort */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Sort by
          </h3>
          <select
            value={sort}
            onChange={handleSort}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#050544] focus:border-[#445DFE] focus:ring-1 focus:ring-[#445DFE] focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Roof type (verandas) */}
        {roofOptions.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Roof type
            </h3>
            <ul className="space-y-2">
              {roofOptions.map((opt) => (
                <li key={opt.value}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={roof.includes(opt.value)}
                      onChange={() => toggleRoof(opt.value)}
                      className="h-4 w-4 rounded border-gray-300 text-[#445DFE] focus:ring-[#445DFE]"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-[#050544]">
                      {opt.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Material */}
        {materialOptions.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Material
            </h3>
            <ul className="space-y-2">
              {materialOptions.map((opt) => (
                <li key={opt}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={material.includes(opt)}
                      onChange={() => toggleMaterial(opt)}
                      className="h-4 w-4 rounded border-gray-300 text-[#445DFE] focus:ring-[#445DFE]"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-[#050544]">
                      {opt}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Finish */}
        {finishOptions.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Finish
            </h3>
            <ul className="space-y-2">
              {finishOptions.map((opt) => (
                <li key={opt}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={finish.includes(opt)}
                      onChange={() => toggleFinish(opt)}
                      className="h-4 w-4 rounded border-gray-300 text-[#445DFE] focus:ring-[#445DFE]"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-[#050544]">
                      {opt}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-600">
          {isPending ? (
            <span className="animate-pulse">Updating…</span>
          ) : (
            <>
              <span className="text-[#050544] font-semibold">{resultCount}</span>{' '}
              {resultCount === 1 ? 'result' : 'results'}
            </>
          )}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Filter trigger button — visible on all screens; filters open only on click */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#050544] shadow-sm hover:bg-gray-50 transition-colors"
        aria-expanded={drawerOpen}
        aria-controls="catalog-filters-drawer"
        id="catalog-filters-trigger"
      >
        <FilterIcon className="w-5 h-5 text-[#445DFE]" />
        Filters
        {hasActiveFilters && (
          <span className="ml-1 min-w-[1.25rem] rounded-full bg-[#445DFE] px-1.5 py-0.5 text-xs font-bold text-white">
            {(minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (sort !== 'price_asc' ? 1 : 0) + roof.length + material.length + finish.length}
          </span>
        )}
      </button>

      {/* Backdrop when drawer is open */}
      <div
        role="presentation"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden
      />

      {/* Filters panel — slides in from left when user clicks the filter icon */}
      <aside
        id="catalog-filters-drawer"
        aria-labelledby="catalog-filters-trigger"
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-[min(320px,90vw)] overflow-y-auto rounded-r-2xl border-r border-gray-200 bg-white p-5 shadow-xl transition-transform duration-200 ease-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {filtersContent}
      </aside>
    </>
  );
}
