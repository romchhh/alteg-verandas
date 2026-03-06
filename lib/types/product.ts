export type ProductCategory =
  | 'angle'
  | 'plate'
  | 'channel'
  | 'i_beam'
  | 't_beam'
  | 'round_bar'
  | 't_profile'
  | 'z_profile'
  | 'tube_round'
  | 'square_bar'
  | 'sheet'
  | 'threshold'
  | 'tube_square'
  | 'tube_rectangular'
  | 'custom_profile';

export interface ProductCategoryInfo {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  specifications: string;
  specificationsEn: string;
  applications: string[];
  applicationsEn: string[];
  image: string;
}

export interface Product {
  id: string;
  category: ProductCategory | string;
  name: string;
  nameEn: string;
  dimensions: string; // e.g., "25x25x3"
  pricePerMeter?: number;
  pricePerKg?: number;
  weightPerMeter: number;
  standardLengths: number[]; // [1, 3, 6]
  image?: string;
  /** Optional additional images for gallery view. */
  images?: string[];
  applications?: string[];
  inStock: boolean;
  /** When true, product is hidden from public catalog (CMS/admin control). */
  hidden?: boolean;
  description?: string;
  descriptionEn?: string;
  material?: string; // e.g., "6063-T5", "6082-T6"
  finish?: string; // e.g., "Mill finish", "Anodized"
  /** Human-readable price unit label, e.g. "per m", "per m²", "per set". */
  priceUnit?: string;
  /** Optional: original supplier price per metre (for reference in admin). */
  supplierPricePerMeter?: number;
  /** Optional: original supplier price per m² for a kit/set (for reference in admin). */
  supplierPricePerSquareMeterSet?: number;
}
