'use client';

import React, { useState } from 'react';
import { ProductOrderModal } from './ProductOrderModal';

interface ProductOrderButtonProps {
  productId: string;
  productName: string;
  className?: string;
}

export function ProductOrderButton({ productId, productName, className = '' }: ProductOrderButtonProps) {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOrderModalOpen(true)}
        className={className}
      >
        Request a quote
      </button>
      <ProductOrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        productId={productId}
        productName={productName}
      />
    </>
  );
}
