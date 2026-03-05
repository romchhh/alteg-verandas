'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types/product';
import { Input } from '@/components/shared/Input';
import { formatCurrency, getPricePerMeter } from '@/lib/utils/calculations';

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductSearchModal({ isOpen, onClose }: ProductSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          setError('Failed to search products.');
          setResults([]);
          setIsLoading(false);
          return;
        }
        const data = (await res.json()) as { products: Product[] };
        setResults(data.products || []);
        setIsLoading(false);
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
        setError('Network error. Please try again.');
        setIsLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden
      />

      {/* Right sidebar panel */}
      <aside
        aria-label="Search products"
        className="fixed inset-y-0 right-0 z-50 w-full max-w-[min(420px,90vw)] bg-white shadow-2xl border-l border-gray-200 flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Search products</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <Input
          fullWidth
          type="text"
          placeholder="Search by name, description, material..."
          value={query}
          onChange={handleChange}
          className="text-black placeholder-gray-500"
        />
        {query.trim().length < 2 && (
          <p className="text-xs text-gray-500">
            Type at least 2 characters to search across product name, description and material.
          </p>
        )}
        {isLoading && (
          <p className="text-sm text-gray-600">Searching…</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {!isLoading && !error && query.trim().length >= 2 && results.length === 0 && (
          <p className="text-sm text-gray-600">No products found for this query.</p>
        )}
        {!isLoading && results.length > 0 && (
          <div className="max-h-[420px] overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
            {results.map((product) => {
              const price = getPricePerMeter(product);
              const priceText = price != null ? `from ${formatCurrency(price)}` : 'Price on request';
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="flex items-start gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.nameEn}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-[#050544] line-clamp-1">
                        {product.nameEn}
                      </p>
                      <p className="text-xs font-semibold text-[#E65100] whitespace-nowrap">
                        {priceText} <span className="text-[10px] text-gray-600">excl. VAT</span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {product.dimensions}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {product.material || product.finish || (product.applications && product.applications.join(', '))}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        </div>
      </aside>
    </>
  );
}

