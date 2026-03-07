'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/utils/bodyScrollLock';
import type { GalleryItem } from '@/lib/gallery';

// Bento-style layout for first 10 images only
const BENTO_LAYOUT = [
  'col-span-2 row-span-2', // 1 - hero large
  '', '',
  '', 'col-span-2', // 4 wide
  '', '',
  'row-span-2', '', // 7 tall
  'col-span-2', '', // 9 wide
  '', 'col-span-2', // 10 wide
];

const BENTO_COUNT = 10;

export interface FactoryGalleryProps {
  items: GalleryItem[];
}

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export const FactoryGallery: React.FC<FactoryGalleryProps> = ({ items }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryItems = items;

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null || galleryItems.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length);
  }, [lightboxIndex, galleryItems.length]);

  const goNext = useCallback(() => {
    if (lightboxIndex === null || galleryItems.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % galleryItems.length);
  }, [lightboxIndex, galleryItems.length]);

  // Keyboard: Arrow Left/Right to scroll, Escape to close; lock body scroll
  useEffect(() => {
    if (lightboxIndex === null) return;
    lockBodyScroll();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
    };
  }, [lightboxIndex, goPrev, goNext, closeLightbox]);

  if (galleryItems.length === 0) {
    return null;
  }

  const bentoItems = galleryItems.slice(0, BENTO_COUNT);
  const restItems = galleryItems.slice(BENTO_COUNT);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#050544] mb-3 sm:mb-4 leading-tight tracking-tight">
              Where We Build
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our facilities where we manufacture aluminium veranda kits, canopies and fencing for homes across the UK.
            </p>
          </div>

          {/* Bento-style grid — first 10 items */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[160px] lg:auto-rows-[180px] grid-flow-dense">
            {bentoItems.map((item, index) => {
              const layout = BENTO_LAYOUT[index] || '';
              return (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className={`relative overflow-hidden group ${layout} min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px] bg-black`}
                  aria-label={`View ${item.alt}`}
                >
                  {item.type === 'video' ? (
                    <>
                      <video
                        src={item.src}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 flex items-center justify-center">
                          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#050544] ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </button>
              );
            })}
          </div>

          {/* Remaining items: one row on desktop (4 cols), two rows of 2 on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3 md:mt-4 mb-20 sm:mb-16 md:mb-16 lg:mb-0 auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[160px] lg:auto-rows-[180px]">
            {restItems.map((item, i) => {
              const index = BENTO_COUNT + i;
              const isLargeItem = item.type === 'video';
              const videoSpan = isLargeItem ? 'col-span-2 lg:row-span-2' : '';
              const videoHeight = item.type === 'video' ? 'min-h-[240px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[360px]' : 'min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px]';
              return (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className={`relative overflow-hidden group ${videoHeight} bg-black ${videoSpan}`}
                  aria-label={`View ${item.alt}`}
                >
                  {item.type === 'video' ? (
                    <>
                      <video
                        src={item.src}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 flex items-center justify-center">
                          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#050544] ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </button>
              );
            })}
          </div>

          {/* Lightbox: darkened overlay, no white box, arrows on sides */}
          {lightboxIndex !== null && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Gallery lightbox"
              onClick={closeLightbox}
            >
              <div className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {/* Left arrow */}
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
                {/* Media: image or video */}
                <div className="relative w-full max-w-5xl aspect-video flex-shrink-0 max-h-[90vh]">
                  {galleryItems[lightboxIndex].type === 'video' ? (
                    <video
                      src={galleryItems[lightboxIndex].src}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Image
                      src={galleryItems[lightboxIndex].src}
                      alt={galleryItems[lightboxIndex].alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 1024px"
                    />
                  )}
                </div>
                {/* Right arrow */}
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </div>
              {/* Close button */}
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors z-10"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Counter */}
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-sm font-medium pointer-events-none">
                {lightboxIndex + 1} / {galleryItems.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
