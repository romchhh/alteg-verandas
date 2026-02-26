/**
 * Import/update a fixed list of products in the SQLite DB and mark all other products as out of stock.
 *
 * - Adds or updates products based on the table provided by ALTEG.
 * - Uses only built-in category ids (see ProductCategory type).
 * - All existing products that are NOT in this list are marked as inStock = false.
 *
 * Run with:
 *   npx tsx scripts/import-products-from-table.ts
 */

import type { Product } from '../lib/types/product';
import { getProducts, addProduct, updateProduct } from '../lib/data/products';
import {
  getCustomCategory,
  insertCustomCategoryRaw,
  getCustomCategories,
  deleteCustomCategory,
} from '../lib/data/categories';

const STD_LENGTHS: number[] = [1, 3, 6];

type RawProductInput = {
  code?: string; // Product Code (used as id when provided)
  description: string;
  dimensions: string;
  finish: string;
  weightKgPerM: number;
  pricePerKg?: number;
  pricePerM?: number;
  categoryId: string;
  inStock?: boolean;
};

/**
 * Source data copied from the pricing table in the brief.
 * All prices are ex. VAT, in GBP.
 */
const RAW_PRODUCTS: RawProductInput[] = [
  // 1  BPO-1015  Angle  20×20×3  mill finish  0,301  £10,70  £3,22  1 m / 3 m / 6 m
  {
    code: 'BPO-1015',
    description: 'Angle',
    dimensions: '20x20x3',
    finish: 'Mill finish',
    weightKgPerM: 0.301,
    pricePerKg: 10.7,
    pricePerM: 3.22,
    categoryId: 'angle',
  },
  // 2  BPO-0927  Angle  25×25×3
  {
    code: 'BPO-0927',
    description: 'Angle',
    dimensions: '25x25x3',
    finish: 'Mill finish',
    weightKgPerM: 0.382,
    pricePerKg: 10.7,
    pricePerM: 4.09,
    categoryId: 'angle',
  },
  // 3  BPZ-0348  Square Tube  20×20×1.5
  {
    code: 'BPZ-0348',
    description: 'Square Tube',
    dimensions: '20x20x1.5',
    finish: 'Mill finish',
    weightKgPerM: 0.3,
    pricePerKg: 10.7,
    pricePerM: 3.21,
    categoryId: 'tube_square',
  },
  // 4  BPO-1268  T-Bar  20×20×2
  {
    code: 'BPO-1268',
    description: 'T-Bar',
    dimensions: '20x20x2',
    finish: 'Mill finish',
    weightKgPerM: 0.206,
    pricePerKg: 11.54,
    pricePerM: 2.38,
    categoryId: 't_profile',
  },
  // 5  BPZ-0442  Rectangular Tube  40×15×2
  {
    code: 'BPZ-0442',
    description: 'Rectangular Tube',
    dimensions: '40x15x2',
    finish: 'Mill finish',
    weightKgPerM: 0.553,
    pricePerKg: 10.3,
    pricePerM: 5.7,
    categoryId: 'tube_rectangular',
  },
  // 6  BPO-6065  Channel Bar  12×20×2
  {
    code: 'BPO-6065',
    description: 'Channel Bar',
    dimensions: '12x20x2',
    finish: 'Mill finish',
    weightKgPerM: 0.26,
    pricePerKg: 11.5,
    pricePerM: 2.99,
    categoryId: 'channel',
  },
  // 7  BPZ-0548  Round Tube  Ø22×2
  {
    code: 'BPZ-0548',
    description: 'Round Tube',
    dimensions: 'Ø22x2',
    finish: 'Mill finish',
    weightKgPerM: 0.341,
    pricePerKg: 10.15,
    pricePerM: 3.46,
    categoryId: 'tube_round',
  },
  // 8  BPO-0968  Custom Profile  —  (no exact dimensions in table)
  {
    code: 'BPO-0968',
    description: 'Custom Profile',
    dimensions: '',
    finish: 'Mill finish',
    weightKgPerM: 0.141,
    pricePerKg: 12.36,
    pricePerM: 1.74,
    categoryId: 'custom_profile',
  },
  // 9  BPO-0219  Round Bar  Ø16
  {
    code: 'BPO-0219',
    description: 'Round Bar',
    dimensions: 'Ø16',
    finish: 'Mill finish',
    weightKgPerM: 0.67,
    pricePerKg: 9.55,
    pricePerM: 6.4,
    categoryId: 'round_bar',
  },
  // 10 BPO-3301  Flat Bar  8×3  -> category: plate (Flat Bar)
  {
    code: 'BPO-3301',
    description: 'Flat Bar',
    dimensions: '8x3',
    finish: 'Mill finish',
    weightKgPerM: 0.065,
    pricePerKg: 12.46,
    pricePerM: 0.81,
    categoryId: 'plate',
  },
  // 11 BPO-2675  Flat Bar  40×5  -> category: plate (Flat Bar)
  {
    code: 'BPO-2675',
    description: 'Flat Bar',
    dimensions: '40x5',
    finish: 'Mill finish',
    weightKgPerM: 0.235,
    pricePerKg: 11.38,
    pricePerM: 2.67,
    categoryId: 'plate',
  },
  // 12 BPO-0055  Round Bar  Ø6
  {
    code: 'BPO-0055',
    description: 'Round Bar',
    dimensions: 'Ø6',
    finish: 'Mill finish',
    weightKgPerM: 0.077,
    pricePerKg: 11.45,
    pricePerM: 0.88,
    categoryId: 'round_bar',
  },

  // 13 — Square Tube 40×40×2 ~0.8 350 10,77
  {
    description: 'Square Tube',
    dimensions: '40x40x2',
    finish: 'Mill finish',
    weightKgPerM: 0.8,
    pricePerKg: 10.77,
    // pricePerM will be derived from pricePerKg * weightKgPerM
    categoryId: 'tube_square',
  },
  // 14 — Rectangular Tube 60×40×2 ~1.0 300 10,77
  {
    description: 'Rectangular Tube',
    dimensions: '60x40x2',
    finish: 'Mill finish',
    weightKgPerM: 1.0,
    pricePerKg: 10.77,
    categoryId: 'tube_rectangular',
  },
  // 15 — Angle 40×40×4 ~1.2 250 11,78
  {
    description: 'Angle',
    dimensions: '40x40x4',
    finish: 'Mill finish',
    weightKgPerM: 1.2,
    pricePerKg: 11.78,
    categoryId: 'angle',
  },
  // 16 — T-slot profile 30×30 or 40×40 (to confirm) 200 12,77
  {
    description: 'T-slot Profile',
    dimensions: '30x30 / 40x40',
    finish: 'Mill finish',
    weightKgPerM: 1.0,
    pricePerKg: 12.77,
    categoryId: 't_profile',
    inStock: false,
  },
  // 17 — Handrail Tube Ø42.4×2 ~0.6 200 10,77
  {
    description: 'Handrail Tube',
    dimensions: 'Ø42.4x2',
    finish: 'Mill finish',
    weightKgPerM: 0.6,
    pricePerKg: 10.77,
    categoryId: 'tube_round',
  },
];

/**
 * Ensure that category table is cleaned up / merged and that
 * all category ids used by RAW_PRODUCTS exist in the DB.
 *
 * - Merges duplicate marketing categories into system ones:
 *   - box_section  -> removed (covered by Square / Rectangular Tube)
 *   - flat_bar     -> removed (use Plate / Flat Bar)
 *   - tube_pipe    -> removed (use Round Tube / Pipe)
 * - Creates / normalises categories for ids used in RAW_PRODUCTS.
 */
function ensureCategoriesForRawProducts() {
  // 1) Remove redundant duplicate categories that we don't want to show.
  const redundantIds = ['box_section', 'flat_bar', 'tube_pipe'];
  for (const id of redundantIds) {
    const existing = getCustomCategory(id);
    if (existing) {
      deleteCustomCategory(id);
      console.log(`Deleted redundant category: ${id}`);
    }
  }

  // 2) Ensure categories for all ids used in the pricing table.
  const categoryIds = Array.from(new Set(RAW_PRODUCTS.map((p) => p.categoryId)));

  const CATEGORY_LABELS: Record<
    string,
    { name: string; nameEn: string; description?: string | null; image?: string | null }
  > = {
    angle: {
      name: 'Angle',
      nameEn: 'Angle',
      description: 'Aluminium angle profiles.',
      image: '/category-images/custom_profile.jpg', // fallback if needed
    },
    plate: {
      name: 'Plate / Flat Bar',
      nameEn: 'Plate / Flat Bar',
      description: 'Aluminium plate and flat bar profiles.',
      image: '/category-images/plate-flat-bar.jpg',
    },
    channel: {
      name: 'Channel',
      nameEn: 'Channel',
      description: 'Aluminium channel profiles.',
    },
    tube_round: {
      name: 'Round Tube / Pipe',
      nameEn: 'Round Tube / Pipe',
      description: 'Aluminium round tube and pipe profiles.',
      image: '/category-images/tube-round.png',
    },
    tube_square: {
      name: 'Square Tube',
      nameEn: 'Square Tube',
      description: 'Aluminium square tube profiles.',
      image: '/category-images/tube-square.png',
    },
    tube_rectangular: {
      name: 'Rectangular Tube',
      nameEn: 'Rectangular Tube',
      description: 'Aluminium rectangular tube profiles.',
      image: '/category-images/tube-profiles.jpg',
    },
    round_bar: {
      name: 'Round Bar',
      nameEn: 'Round Bar',
      description: 'Solid round aluminium bar.',
    },
    t_profile: {
      name: 'T Profile',
      nameEn: 'T Profile',
      description: 'Aluminium T profile and T-slot systems.',
      image: '/api/uploads/mlf5k6b2-zqqmdp.png',
    },
    custom_profile: {
      name: 'Custom Profile',
      nameEn: 'Custom Profile',
      description: 'Custom aluminium extrusion profile according to drawing.',
      image: '/category-images/custom_profile.jpg',
    },
  };

  for (const id of categoryIds) {
    const existing = getCustomCategory(id);
    if (existing) continue;

    const labels =
      CATEGORY_LABELS[id] ??
      ({
        name: id,
        nameEn: id,
        description: null,
        image: null,
      } as const);

    insertCustomCategoryRaw({
      id,
      name: labels.name,
      nameEn: labels.nameEn,
      description: labels.description ?? null,
      image: labels.image ?? null,
    });
  }
}

/**
 * For every category in DB, ensure there is at least one product.
 * For categories without any products, create a placeholder product
 * marked as out of stock.
 */
async function ensurePlaceholderProductsForAllCategories() {
  const categories = getCustomCategories();
  if (categories.length === 0) return;

  const allProducts = await getProducts();
  const productsByCategory = new Map<string, Product[]>();
  for (const p of allProducts) {
    const list = productsByCategory.get(p.category) ?? [];
    list.push(p);
    productsByCategory.set(p.category, list);
  }

  for (const cat of categories) {
    const productsForCat = productsByCategory.get(cat.id) ?? [];
    if (productsForCat.length > 0) continue;

    const placeholderId = `placeholder-${cat.id}`;
    if (allProducts.some((p) => p.id === placeholderId)) continue;

    const nameBase = cat.name_en || cat.name || cat.id;

    const placeholder: Product = {
      id: placeholderId,
      category: cat.id,
      name: `${nameBase} – placeholder`,
      nameEn: `${nameBase} – placeholder`,
      dimensions: 'N/A',
      pricePerMeter: undefined,
      pricePerKg: undefined,
      weightPerMeter: 0,
      standardLengths: STD_LENGTHS,
      material: 'Aluminium',
      finish: 'Mill finish',
      inStock: false,
      hidden: false,
    };

    try {
      await addProduct(placeholder);
      console.log(`Inserted placeholder product for category ${cat.id}`);
    } catch (err) {
      console.warn(`Could not insert placeholder for category ${cat.id}:`, err);
    }
  }
}

function buildProductFromRaw(raw: RawProductInput, index: number): Product {
  const id = raw.code && raw.code.trim().length > 0 ? raw.code.trim() : `manual-${index + 1}`;
  const safeDimensions = raw.dimensions.replace(/×/g, 'x').trim();
  const pricePerM =
    raw.pricePerM ??
    (raw.pricePerKg != null ? parseFloat((raw.pricePerKg * raw.weightKgPerM).toFixed(2)) : undefined);

  const baseName = `${raw.description} ${safeDimensions}`.trim();
  const finishSuffix = raw.finish ? `, ${raw.finish}` : '';

  return {
    id,
    category: raw.categoryId,
    name: `${baseName}${finishSuffix}`,
    nameEn: `${baseName}${finishSuffix}`,
    dimensions: safeDimensions,
    pricePerMeter: pricePerM,
    pricePerKg: raw.pricePerKg,
    weightPerMeter: raw.weightKgPerM,
    standardLengths: STD_LENGTHS,
    material: 'Aluminium',
    finish: raw.finish,
    inStock: raw.inStock ?? true,
  };
}

async function main() {
  console.log('Ensuring categories exist for all products in the table...');
  ensureCategoriesForRawProducts();

  console.log('Loading existing products from DB...');
  const existing = await getProducts();
  const existingById = new Map(existing.map((p) => [p.id, p]));

  const keepInStockIds = new Set<string>();

  console.log('Upserting products from pricing table...');
  for (let i = 0; i < RAW_PRODUCTS.length; i += 1) {
    const raw = RAW_PRODUCTS[i];
    const product = buildProductFromRaw(raw, i);
    keepInStockIds.add(product.id);

    if (existingById.has(product.id)) {
      await updateProduct(product.id, {
        category: product.category,
        name: product.name,
        nameEn: product.nameEn,
        dimensions: product.dimensions,
        pricePerMeter: product.pricePerMeter,
        pricePerKg: product.pricePerKg,
        weightPerMeter: product.weightPerMeter,
        standardLengths: product.standardLengths,
        material: product.material,
        finish: product.finish,
        inStock: true,
        hidden: false,
      });
      console.log(`Updated product ${product.id}`);
    } else {
      await addProduct(product);
      console.log(`Inserted product ${product.id}`);
    }
  }

  console.log('Marking all other products as out of stock...');
  for (const p of existing) {
    if (!keepInStockIds.has(p.id) && p.inStock) {
      await updateProduct(p.id, { inStock: false });
      console.log(`Set out of stock: ${p.id}`);
    }
  }

  console.log('Ensuring at least one (out of stock) product exists for every category...');
  await ensurePlaceholderProductsForAllCategories();

  console.log(
    `Done. Total in table: ${RAW_PRODUCTS.length}. All other existing products are now marked as out of stock.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

