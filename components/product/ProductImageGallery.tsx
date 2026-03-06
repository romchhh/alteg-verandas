 'use client';

import React, { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const validImages = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  if (validImages.length === 0) {
    return (
      <div className="relative aspect-[4/3] md:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          No image
        </div>
      </div>
    );
  }

  const active = validImages[Math.min(activeIndex, validImages.length - 1)];

  return (
    <div className="w-full">
      <div className="relative aspect-[4/3] md:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
        <img
          src={active}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      {validImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {validImages.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-16 rounded-md overflow-hidden border ${
                index === activeIndex ? 'border-[#050544]' : 'border-gray-200'
              } flex-shrink-0`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

