/**
 * Replace categories in DB with the new category set and seed products
 * from the pricing table + placeholders.
 *
 * Deletes ALL existing custom categories, category overrides, and products,
 * then inserts:
 * - Categories:
 *   Angle, Box Section, Channel, Flat Bar, Mesh, Round Bar, Sheet, Square Bar,
 *   Tube / Pipe, RSJs / I-beams, Checker plate, T-Section,
 *   Aluminium, Brass, Bronze, Cast Iron, Copper
 * - Products:
 *   - All rows from the provided pricing table, mapped to the new categories
 *   - For every category, at least one fake product with price 0 and not in stock
 *
 * Run:
 *   npx tsx scripts/replace-categories-and-products.ts
 */
import {
  deleteAllCustomCategories,
  deleteAllCategoryOverrides,
  insertCustomCategoryRaw,
} from '../lib/data/categories';
import { saveProducts } from '../lib/data/products';
import type { Product } from '../lib/types/product';

// EXACTLY these 12 categories (your list)
const NEW_CATEGORIES: { id: string; nameEn: string; description: string }[] = [
  {
    id: 'angle',
    nameEn: 'Angle',
    description:
      'Angles and corner trims in various sizes for structural and decorative use. Strong, lightweight, corrosion resistant.',
  },
  {
    id: 'box_section',
    nameEn: 'Box Section',
    description:
      'Box sections and square hollow sections for frames, posts, racks and general fabrication.',
  },
  {
    id: 'channel',
    nameEn: 'Channel',
    description:
      'U- and C-channels for construction, framing, tracks and general engineering applications.',
  },
  {
    id: 'flat_bar',
    nameEn: 'Flat Bar',
    description:
      'Flat bars and strips for brackets, plates and general fabrication. Easy to cut and drill.',
  },
  {
    id: 'mesh',
    nameEn: 'Mesh',
    description:
      'Mesh, perforated and expanded products for guarding, screening and ventilation.',
  },
  {
    id: 'round_bar',
    nameEn: 'Round Bar',
    description:
      'Solid round bar for turning, machining and fabrication across many industries.',
  },
  {
    id: 'sheet',
    nameEn: 'Sheet',
    description:
      'Sheet and plate for cladding, fabrication, panels and general use. Various thicknesses.',
  },
  {
    id: 'square_bar',
    nameEn: 'Square Bar',
    description:
      'Solid square bar for general engineering and fabrication, easy to machine and weld.',
  },
  {
    id: 'tube_pipe',
    nameEn: 'Tube / Pipe',
    description:
      'Round and rectangular tube / pipe for structures, frames, handrails and general fabrication.',
  },
  {
    id: 'rsj_ibeam',
    nameEn: 'RSJs / I-beams',
    description:
      'RSJs and I-beams for load-bearing structures where high strength is required.',
  },
  {
    id: 'checker_plate',
    nameEn: 'Checker plate',
    description:
      'Checker (tread) plate for anti-slip flooring, ramps and industrial walkways.',
  },
  {
    id: 't_section',
    nameEn: 'T-Section',
    description:
      'T-sections and T-slot profiles for framing, sliding systems and modular constructions.',
  },
];

const STD_LENGTHS = [1, 3, 6];

type RawProductInput = {
  code?: string;
  description: string;
  dimensions: string;
  finish: string;
  weightKgPerM: number;
  pricePerKg?: number;
  pricePerM?: number;
  categoryId: string;
  inStock?: boolean;
};

// Source pricing table rows (as per your brief).
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
  // 8  BPO-0968  Custom Profile — (no exact dimensions in table)
  {
    code: 'BPO-0968',
    description: 'Custom Profile',
    dimensions: '',
    finish: 'Mill finish',
    weightKgPerM: 0.141,
    pricePerKg: 12.36,
    pricePerM: 1.74,
    // Use a special category id so it has no visible category on the site.
    // You can reassign the category later in the admin.
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
  // 10  BPO-3301  Flat Bar  8×3
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
  // 11  BPO-2675  Flat Bar  40×5
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
  // 12  BPO-0055  Round Bar  Ø6
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
  // 16 — T-slot profile 30×30 or 40×40  200 12,77
  {
    description: 'T-slot Profile',
    dimensions: '30x30 / 40x40',
    finish: 'Mill finish',
    weightKgPerM: 1.0,
    pricePerKg: 12.77,
    categoryId: 't_profile',
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

function mapOldCategoryToNew(oldId: string, description: string): string {
  const lowerDesc = description.toLowerCase();

  // Special case: Handrail Tube should be treated as Round Bar
  if (lowerDesc.includes('handrail tube')) {
    return 'round_bar';
  }

  // All Tube-related products (TUBE in name or old id is tube_*) go to Tube / Pipe
  if (
    oldId === 'tube_square' ||
    oldId === 'tube_round' ||
    oldId === 'tube_rectangular' ||
    lowerDesc.includes('tube')
  ) {
    return 'tube_pipe';
  }

  if (oldId === 'angle') return 'angle';
  if (oldId === 'channel') return 'channel';
  if (oldId === 'round_bar') return 'round_bar';
  if (oldId === 'plate') return 'flat_bar';
  if (oldId === 't_profile') return 't_section';

  // Custom profile -> no category on site (you can reassign category later in admin)
  if (oldId === 'custom_profile') return 'uncategorised';

  return 'aluminium';
}

function slugifyId(base: string): string {
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildProductsFromRaw(): Product[] {
  const products: Product[] = RAW_PRODUCTS.map((rp) => {
    const idBase = rp.code ?? `${rp.description}-${rp.dimensions || 'na'}`;
    const id = slugifyId(idBase);
    const category = mapOldCategoryToNew(rp.categoryId, rp.description);
    const pricePerKg = rp.pricePerKg;
    const weightPerMeter = rp.weightKgPerM;
    const pricePerMeter =
      rp.pricePerM ??
      (pricePerKg != null && weightPerMeter != null
        ? pricePerKg * weightPerMeter
        : undefined);

    const nameEn = `${rp.description} ${rp.dimensions}`.trim();

    const product: Product = {
      id,
      category,
      name: nameEn,
      nameEn,
      dimensions: rp.dimensions || 'N/A',
      pricePerMeter,
      pricePerKg,
      weightPerMeter,
      standardLengths: STD_LENGTHS,
      inStock: rp.inStock ?? true,
      hidden: false,
      material: 'Aluminium',
      finish: rp.finish,
      image: undefined,
      description: '',
      descriptionEn: '',
      applications: [],
    };

    return product;
  });

  return products;
}

function buildPlaceholderProducts(existing: Product[]): Product[] {
  const existingIds = new Set(existing.map((p) => p.id));

  return NEW_CATEGORIES.map((cat) => {
    const id = `placeholder-${cat.id}`;
    if (existingIds.has(id)) {
      return null;
    }

    const product: Product = {
      id,
      category: cat.id,
      name: `${cat.nameEn} – placeholder`,
      nameEn: `${cat.nameEn} – placeholder`,
      dimensions: 'N/A',
      pricePerMeter: 0,
      pricePerKg: 0,
      weightPerMeter: 0,
      standardLengths: STD_LENGTHS,
      inStock: false,
      hidden: false,
      material: 'Aluminium',
      finish: 'N/A',
      image: undefined,
      description: 'Placeholder product used when no specific items are configured.',
      descriptionEn: 'Placeholder product used when no specific items are configured.',
      applications: [],
    };

    return product;
  }).filter((p): p is Product => p !== null);
}

async function main() {
  console.log('Replacing categories and products...');

  // 1. Remove old category overrides and custom categories
  deleteAllCategoryOverrides();
  console.log('Cleared category_overrides.');
  deleteAllCustomCategories();
  console.log('Cleared custom_categories.');

  // 2. Insert new categories (raw insert so we can use ids like "angle", "tube_pipe", "aluminium")
  for (const cat of NEW_CATEGORIES) {
    insertCustomCategoryRaw({
      id: cat.id,
      name: cat.nameEn,
      nameEn: cat.nameEn,
      description: cat.description,
      image: null,
    });
  }
  console.log(`Inserted ${NEW_CATEGORIES.length} categories.`);

  // 3. Build products from pricing table
  const realProducts = buildProductsFromRaw();

  // 4. Add fake placeholder products (price 0, not in stock) for every category
  const placeholderProducts = buildPlaceholderProducts(realProducts);

  const products: Product[] = [...realProducts, ...placeholderProducts];

  // 5. Replace all products (delete existing + insert new)
  await saveProducts(products);
  console.log(
    `Replaced products: ${realProducts.length} from table + ${placeholderProducts.length} placeholders = ${products.length} total.`,
  );

  console.log('Done. Restart the app or refresh to see new categories and products.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
