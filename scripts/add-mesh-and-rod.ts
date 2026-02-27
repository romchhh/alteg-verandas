/**
 * Ensure Mesh and Rod categories exist and have sample products (out of stock).
 *
 * Run with:
 *   npx tsx scripts/add-mesh-and-rod.ts
 */

import { addCustomCategory, getCustomCategory } from '../lib/data/categories';
import { addProduct, getProductById } from '../lib/data/products';
import type { Product } from '../lib/types/product';

async function ensureCategories() {
  const mesh = getCustomCategory('mesh');
  if (!mesh) {
    addCustomCategory({
      id: 'mesh',
      name: 'Mesh',
      nameEn: 'Mesh',
      description: 'Wire mesh, gratings and perforated metal sheets.',
      image: '', // you can set /uploads/... later from admin
    });
    // eslint-disable-next-line no-console
    console.log('Created category: mesh');
  }

  const rod = getCustomCategory('rod');
  if (!rod) {
    addCustomCategory({
      id: 'rod',
      name: 'Rod',
      nameEn: 'Rod',
      description: 'Solid metal rods and bars for construction and fabrication.',
      image: '',
    });
    // eslint-disable-next-line no-console
    console.log('Created category: rod');
  }
}

async function ensureSampleProducts() {
  const samples: Product[] = [
    {
      id: 'mesh-50x50x3',
      category: 'mesh',
      name: 'Mesh 50x50x3 (sample, not in stock)',
      nameEn: 'Mesh 50x50x3 (sample, not in stock)',
      dimensions: '50x50x3',
      pricePerMeter: undefined,
      pricePerKg: undefined,
      weightPerMeter: 0,
      standardLengths: [1, 2, 3],
      inStock: false,
      hidden: false,
      material: 'Steel',
      finish: 'Galvanized',
      image: '',
      description: 'Example mesh product used as a placeholder.',
      descriptionEn: 'Example mesh product used as a placeholder.',
      applications: ['Fencing', 'Cages'],
    },
    {
      id: 'rod-10mm',
      category: 'rod',
      name: 'Rod Ø10 (sample, not in stock)',
      nameEn: 'Rod Ø10 (sample, not in stock)',
      dimensions: 'Ø10',
      pricePerMeter: undefined,
      pricePerKg: undefined,
      weightPerMeter: 0,
      standardLengths: [1, 3, 6],
      inStock: false,
      hidden: false,
      material: 'Steel',
      finish: 'Mill finish',
      image: '',
      description: 'Example rod product used as a placeholder.',
      descriptionEn: 'Example rod product used as a placeholder.',
      applications: ['Fabrication', 'Construction'],
    },
  ];

  for (const p of samples) {
    const existing = await getProductById(p.id);
    if (existing) {
      // eslint-disable-next-line no-console
      console.log('Product already exists, skip:', p.id);
      continue;
    }
    try {
      // eslint-disable-next-line no-await-in-loop
      await addProduct(p);
      // eslint-disable-next-line no-console
      console.log('Created product:', p.id);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to create product', p.id, e);
    }
  }
}

async function main() {
  await ensureCategories();
  await ensureSampleProducts();
  // eslint-disable-next-line no-console
  console.log('Mesh and Rod categories and sample products ensured.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('add-mesh-and-rod.ts failed:', err);
  process.exit(1);
});

