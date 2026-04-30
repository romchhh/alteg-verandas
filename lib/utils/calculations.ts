import { Product } from '@/lib/types/product';
import { getVolumeDiscountByCartTotal, getLengthDiscount } from '@/lib/constants/prices';

/** Single source of truth for product pricing: explicit pricePerMeter only. */
export function getPricePerMeter(product: Product): number | undefined {
  if (product.pricePerMeter != null) {
    return product.pricePerMeter;
  }
  return undefined;
}

export interface CalculationResult {
  totalLength: number;
  totalWeight: number;
  materialCost: number;
  lengthDiscount: number;
  lengthDiscountAmount: number;
  discount: number;
  discountAmount: number;
  finalPrice: number;
}

/** Line total: material cost with length discount only. Volume discount is applied at cart level. */
export function calculateOrder(
  product: Product,
  length: number,
  quantity: number
): CalculationResult {
  const totalLength = length * quantity;
  const totalWeight = product.weightPerMeter * totalLength;

  const pricePerMeter = getPricePerMeter(product);
  const materialCost = pricePerMeter != null
    ? totalLength * pricePerMeter
    : 0;

  const lengthDiscount = getLengthDiscount(totalLength);
  const lengthDiscountAmount = materialCost * lengthDiscount;
  const afterLengthDiscount = materialCost - lengthDiscountAmount;

  return {
    totalLength,
    totalWeight,
    materialCost,
    lengthDiscount,
    lengthDiscountAmount,
    discount: 0,
    discountAmount: 0,
    finalPrice: afterLengthDiscount,
  };
}

/** Cart total with volume discount applied to subtotal (ex. VAT). */
export function calculateCartTotal(
  items: Array<{
    product: Product;
    length: number;
    quantity: number;
    calculatedPrice: number;
    calculatedWeight: number;
  }>
): {
  subtotal: number;
  totalWeight: number;
  discount: number;
  discountAmount: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.calculatedPrice, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.calculatedWeight, 0);
  const discount = getVolumeDiscountByCartTotal(subtotal);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;
  return {
    subtotal,
    totalWeight,
    discount,
    discountAmount,
    total,
  };
}

export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatWeight(weight: number, unit: string = 'kg'): string {
  if (weight < 1) {
    return `${(weight * 1000).toFixed(0)}g`;
  }
  return `${weight.toFixed(2)}${unit}`;
}

export function formatLength(length: number, unit: string = 'm'): string {
  if (length >= 1) {
    return `${length.toFixed(2)}${unit}`;
  }
  return `${(length * 1000).toFixed(0)}mm`;
}
