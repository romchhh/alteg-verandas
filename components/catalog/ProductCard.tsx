'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductCategoryInfo } from '@/lib/types/product';
import { Button } from '@/components/shared/Button';
import { useCartStore } from '@/store/cart';
import { Modal } from '@/components/shared/Modal';
import { SuccessAlert } from '@/components/shared/SuccessAlert';
import { getPricePerMeter } from '@/lib/utils/calculations';
import { getLengthDiscount } from '@/lib/constants/prices';
import { getUploadImageSrc, isServerUploadUrl } from '@/lib/utils/image';

interface ProductCardProps {
  product: Product;
  categoryInfo: ProductCategoryInfo;
}

const MIN_CUSTOM_LENGTH = 0.1;
const MAX_CUSTOM_LENGTH = 25;

const DEFAULT_PRODUCT_IMAGE = '/production_1.jpg';

export const ProductCard: React.FC<ProductCardProps> = ({ product, categoryInfo }) => {
  // Try product image first (if it's a server upload), then category image (if it's a server upload), then default
  let rawImage: string | null = null;
  if (product.image && isServerUploadUrl(product.image)) {
    rawImage = product.image;
  } else if (categoryInfo.image && isServerUploadUrl(categoryInfo.image)) {
    rawImage = categoryInfo.image;
  }
  // Use direct /uploads/ path for Next.js Image optimization (auto WebP conversion)
  const displaySrc = rawImage ? getUploadImageSrc(rawImage, true) : DEFAULT_PRODUCT_IMAGE;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [length, setLength] = useState(product.standardLengths[0]);
  const [lengthInput, setLengthInput] = useState(product.standardLengths[0].toString());
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState('1');
  const [freeCutting, setFreeCutting] = useState(false);
  const [additionalProcessing, setAdditionalProcessing] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const effectiveLength = Math.min(MAX_CUSTOM_LENGTH, Math.max(MIN_CUSTOM_LENGTH, length));

  useEffect(() => {
    if (isModalOpen) {
      const defaultLen = product.standardLengths[0];
      setLength(defaultLen);
      setLengthInput(defaultLen.toString());
      setQuantity(1);
      setQuantityInput('1');
      setFreeCutting(false);
      setAdditionalProcessing('');
    }
  }, [isModalOpen, product.id, product.standardLengths]);

  const handleLengthInputChange = (value: string) => {
    setLengthInput(value);
    if (value === '' || value === '-' || value === '.') return;
    const num = parseFloat(value.replace(',', '.'));
    if (!Number.isNaN(num) && num >= MIN_CUSTOM_LENGTH && num <= MAX_CUSTOM_LENGTH) {
      setLength(num);
    }
  };

  const lengthNum = parseFloat(lengthInput.replace(',', '.'));
  const isLengthInvalid =
    lengthInput !== '' &&
    lengthInput !== '-' &&
    lengthInput !== '.' &&
    (Number.isNaN(lengthNum) || lengthNum < MIN_CUSTOM_LENGTH || lengthNum > MAX_CUSTOM_LENGTH);

  const handleLengthInputBlur = () => {
    const num = parseFloat(lengthInput.replace(',', '.'));
    if (lengthInput === '' || Number.isNaN(num) || num < MIN_CUSTOM_LENGTH || num > MAX_CUSTOM_LENGTH) {
      const defaultLen = product.standardLengths[0] ?? MIN_CUSTOM_LENGTH;
      setLength(defaultLen);
      setLengthInput(defaultLen.toString());
    } else {
      setLength(num);
      setLengthInput(num.toString());
    }
  };

  const handleQuantityChange = (value: string) => {
    setQuantityInput(value);
    const num = parseInt(value, 10);
    if (value !== '' && !Number.isNaN(num) && num >= 1) setQuantity(num);
  };

  const handleQuantityBlur = () => {
    const num = parseInt(quantityInput, 10);
    if (quantityInput === '' || Number.isNaN(num) || num < 1) {
      setQuantity(1);
      setQuantityInput('1');
    } else {
      setQuantity(num);
      setQuantityInput(num.toString());
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product, effectiveLength, quantity, freeCutting, additionalProcessing.trim() || undefined);
    setIsModalOpen(false);
    setIsSuccessAlertOpen(true);
  };

  const handleViewCart = () => {
    setIsSuccessAlertOpen(false);
    // Trigger cart to open
    const cartButton = document.querySelector('[aria-label="Shopping Cart"]') as HTMLButtonElement;
    if (cartButton) {
      cartButton.click();
    }
  };

  const pricePerMeter = getPricePerMeter(product);
  const getPriceBreakdown = () => {
    if (pricePerMeter == null) return null;
    const totalLength = effectiveLength * quantity;
    const materialCost = totalLength * pricePerMeter;
    const lengthDiscountRate = getLengthDiscount(totalLength);
    const discountAmount = materialCost * lengthDiscountRate;
    const finalPrice = materialCost - discountAmount;
    return { materialCost, lengthDiscountRate, discountAmount, finalPrice };
  };
  const calculatePrice = () => {
    const b = getPriceBreakdown();
    return b ? b.finalPrice.toFixed(2) : '0.00';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
        {/* Product Image */}
        <div className="relative h-48 bg-gray-100">
          <Image
            src={displaySrc}
            alt={product.nameEn}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
          />
          {product.inStock ? (
            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-emerald-200/80">
              In stock
            </div>
          ) : (
            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-red-600 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-red-200/80">
              Out of stock
            </div>
          )}
        </div>

        {/* Product Info - Compact View */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-[#050544] mb-1">{product.nameEn}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.dimensions}</p>

          {/* Material - First Row */}
          <p className="text-xs text-gray-500 mb-1">
            <strong>Material:</strong> {product.material}
          </p>

          {/* Weight - Second Row */}
          <p className="text-xs text-gray-500 mb-1">
            <strong>Weight:</strong> {product.weightPerMeter} kg/m
          </p>

          {/* Lengths - Third Row */}
          <p className="text-xs text-gray-500 mb-1">
            <strong>Lengths:</strong> {product.standardLengths.join(', ')}m
          </p>

          {/* Price - Fourth Row */}
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              From{' '}
              <span className="text-base font-bold text-[#445DFE]">
                £{(pricePerMeter ?? product.pricePerKg ?? 0).toFixed(2)}
              </span>
              {pricePerMeter != null ? '/m' : '/kg'}
            </p>
          </div>

          {/* Buttons - Fifth Row */}
          <div className="mt-auto flex flex-col gap-2">
            <Button
              onClick={() => {
                if (!product.inStock) return;
                setIsModalOpen(true);
              }}
              variant="primary"
              disabled={!product.inStock}
              aria-disabled={!product.inStock}
              className={`w-full bg-[#445DFE] text-white py-2 px-3 text-xs sm:text-sm transition-colors duration-300 ${
                product.inStock ? 'hover:bg-[#050544]' : 'opacity-60 cursor-not-allowed'
              }`}
            >
              {product.inStock ? 'Add to Order' : 'Out of stock'}
            </Button>
            <Link
              href="/wholesale"
              className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-[#445DFE] py-2 px-3 text-center text-xs sm:text-sm text-[#445DFE] transition-colors duration-300 hover:bg-[#445DFE] hover:text-white"
            >
              <span>Request wholesale price</span>
              <span className="mt-0.5 block text-[10px] sm:text-xs opacity-90">(Available for orders 500kg+)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Add to Order Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <div className="relative w-full aspect-square max-h-56 sm:max-h-72 overflow-hidden bg-gray-100 mb-4">
            <Image
              src={displaySrc}
              alt={product.nameEn}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 512px"
            />
          </div>
          <h2 className="text-2xl font-bold text-[#050544] mb-4">{product.nameEn}</h2>
          <p className="text-gray-900 mb-6">{product.dimensions}</p>

          <div className="space-y-4">
            {/* Length Selection - same as calculator */}
            <div>
              <label className="block text-sm font-semibold text-[#050544] mb-2">
                Select Length (meters):
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Choose a standard length or enter your own below.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.standardLengths.map((stdLength) => (
                  <button
                    key={stdLength}
                    type="button"
                    onClick={() => {
                      setLength(stdLength);
                      setLengthInput(stdLength.toString());
                    }}
                    className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                      length === stdLength
                        ? 'bg-[#445DFE] text-white border-[#445DFE]'
                        : 'bg-white text-[#050544] border-gray-300 hover:border-[#445DFE]'
                    }`}
                  >
                    {stdLength}m
                  </button>
                ))}
              </div>
              <label className="block text-sm font-medium text-[#050544] mb-1">
                Custom length (m)
              </label>
              <input
                type="number"
                min={MIN_CUSTOM_LENGTH}
                max={MAX_CUSTOM_LENGTH}
                step="0.1"
                value={lengthInput}
                onChange={(e) => handleLengthInputChange(e.target.value)}
                onBlur={handleLengthInputBlur}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-[#050544] ${
                  isLengthInvalid ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-gray-300 focus:border-[#445DFE]'
                }`}
                placeholder="e.g. 2.5, 4.2"
                aria-describedby="product-custom-length-hint"
                aria-invalid={isLengthInvalid}
              />
              <p id="product-custom-length-hint" className={`text-xs mt-1 ${isLengthInvalid ? 'text-red-600' : 'text-gray-500'}`}>
                {isLengthInvalid ? `Length must be between ${MIN_CUSTOM_LENGTH}m and ${MAX_CUSTOM_LENGTH}m.` : 'Enter length in metres (max 25m). Used when you don’t use a quick-select option above.'}
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Quantity:
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={quantityInput}
                onChange={(e) => handleQuantityChange(e.target.value)}
                onBlur={handleQuantityBlur}
                className="w-full max-w-[140px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#445DFE] text-gray-900"
              />
            </div>

            {/* Free Cutting Option */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={freeCutting}
                  onChange={(e) => setFreeCutting(e.target.checked)}
                  className="w-4 h-4 text-[#445DFE] focus:ring-[#445DFE] rounded"
                />
                <span className="text-sm text-gray-900">Free cutting to size</span>
              </label>
              {freeCutting && (
                <input
                  type="text"
                  placeholder="e.g. 2×1.5m, 1×0.5m or instructions (optional)"
                  value={additionalProcessing}
                  onChange={(e) => setAdditionalProcessing(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#445DFE] text-gray-900 text-sm"
                />
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-[#E9EDF4] p-4 rounded">
              {(() => {
                const b = getPriceBreakdown();
                const hasDiscount = b && b.lengthDiscountRate > 0;
                return (
                  <>
                    {hasDiscount && b && (
                      <>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Subtotal:</span>
                          <span className="line-through">£{b.materialCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-700 mb-2">
                          <span>Length discount ({(b.lengthDiscountRate * 100).toFixed(0)}%):</span>
                          <span>-£{b.discountAmount.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-[#445DFE]">£{calculatePrice()}</span>
                    </div>
                    <p className="text-xs text-gray-900 mt-2">
                      {quantity} × {effectiveLength}m = {(quantity * effectiveLength).toFixed(1)}m total
                    </p>
                  </>
                );
              })()}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-900 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddToCart}
                variant="primary"
                className="flex-1 bg-[#445DFE] hover:bg-[#050544] text-white"
              >
                Add to Order
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Success Alert */}
      <SuccessAlert
        isOpen={isSuccessAlertOpen}
        onClose={() => setIsSuccessAlertOpen(false)}
        onViewCart={handleViewCart}
        productName={product.nameEn}
        quantity={quantity}
        length={effectiveLength}
      />
    </>
  );
};
