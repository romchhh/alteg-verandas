import { Product, ProductCategory } from '@/lib/types/product';
import { getDb } from '@/lib/db/sqlite';

function rowToProduct(row: {
  id: string;
  category: string;
  name: string;
  name_en: string;
  dimensions: string;
  price_per_meter: number | null;
  price_per_kg: number | null;
  weight_per_meter: number;
  standard_lengths: string;
  in_stock: number;
  hidden?: number;
  material: string | null;
  finish: string | null;
  image: string | null;
  images?: string | null;
  description: string | null;
  description_en: string | null;
  applications: string | null;
  price_unit?: string | null;
  supplier_price_per_meter?: number | null;
  supplier_price_per_m2_set?: number | null;
}): Product {
  const standardLengths = JSON.parse(row.standard_lengths || '[]') as number[];
  const applications = row.applications ? (JSON.parse(row.applications) as string[]) : undefined;
  return {
    id: row.id,
    category: row.category as ProductCategory,
    name: row.name,
    nameEn: row.name_en,
    dimensions: row.dimensions,
    pricePerMeter: row.price_per_meter ?? undefined,
    pricePerKg: row.price_per_kg ?? undefined,
    weightPerMeter: row.weight_per_meter,
    standardLengths,
    inStock: Boolean(row.in_stock),
    hidden: Boolean(row.hidden ?? 0),
    material: row.material ?? undefined,
    finish: row.finish ?? undefined,
    image: row.image ?? undefined,
    images: row.images ? (JSON.parse(row.images) as string[]) : undefined,
    description: row.description ?? undefined,
    descriptionEn: row.description_en ?? undefined,
    applications,
    priceUnit: row.price_unit ?? undefined,
    supplierPricePerMeter: row.supplier_price_per_meter ?? undefined,
    supplierPricePerSquareMeterSet: row.supplier_price_per_m2_set ?? undefined,
  };
}

type ProductRow = Parameters<typeof rowToProduct>[0];

export async function getProducts(): Promise<Product[]> {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM products ORDER BY created_at DESC').all() as ProductRow[];
  return rows.map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const database = getDb();
  const row = database.prepare('SELECT * FROM products WHERE id = ?').get(id);
  return row ? rowToProduct(row as ProductRow) : null;
}

export async function saveProducts(products: Product[]): Promise<void> {
  const database = getDb();
  const tx = database.transaction(() => {
    database.prepare('DELETE FROM products').run();
    const stmt = database.prepare(`
      INSERT INTO products (id, category, name, name_en, dimensions, price_per_meter, price_per_kg, weight_per_meter, standard_lengths, in_stock, hidden, material, finish, image, images, description, description_en, applications, price_unit, supplier_price_per_meter, supplier_price_per_m2_set)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of products) {
      stmt.run(
        p.id,
        p.category,
        p.name,
        p.nameEn,
        p.dimensions,
        p.pricePerMeter ?? null,
        p.pricePerKg ?? null,
        p.weightPerMeter,
        JSON.stringify(p.standardLengths),
        p.inStock ? 1 : 0,
        p.hidden ? 1 : 0,
        p.material ?? null,
        p.finish ?? null,
        p.image ?? null,
        p.images ? JSON.stringify(p.images) : null,
        p.description ?? null,
        p.descriptionEn ?? null,
        p.applications ? JSON.stringify(p.applications) : null,
        p.priceUnit ?? null,
        p.supplierPricePerMeter ?? null,
        p.supplierPricePerSquareMeterSet ?? null
      );
    }
  });
  tx();
}

export async function addProduct(product: Product): Promise<void> {
  const database = getDb();
  const exists = database.prepare('SELECT 1 FROM products WHERE id = ?').get(product.id);
  if (exists) {
    throw new Error(`Product with id ${product.id} already exists`);
  }
  database.prepare(`
    INSERT INTO products (id, category, name, name_en, dimensions, price_per_meter, price_per_kg, weight_per_meter, standard_lengths, in_stock, hidden, material, finish, image, images, description, description_en, applications, price_unit, supplier_price_per_meter, supplier_price_per_m2_set)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    product.id,
    product.category,
    product.name,
    product.nameEn,
    product.dimensions,
    product.pricePerMeter ?? null,
    product.pricePerKg ?? null,
    product.weightPerMeter,
    JSON.stringify(product.standardLengths),
    product.inStock ? 1 : 0,
    product.hidden ? 1 : 0,
    product.material ?? null,
    product.finish ?? null,
    product.image ?? null,
    product.images ? JSON.stringify(product.images) : null,
    product.description ?? null,
    product.descriptionEn ?? null,
    product.applications ? JSON.stringify(product.applications) : null,
    product.priceUnit ?? null,
    product.supplierPricePerMeter ?? null,
    product.supplierPricePerSquareMeterSet ?? null
  );
}

export async function updateProduct(id: string, update: Partial<Product>): Promise<void> {
  const product = await getProductById(id);
  if (!product) throw new Error(`Product ${id} not found`);

  const merged: Product = { ...product, ...update };
  const database = getDb();
  database.prepare(`
    UPDATE products SET
      category = ?, name = ?, name_en = ?, dimensions = ?,
      price_per_meter = ?, price_per_kg = ?, weight_per_meter = ?,
      standard_lengths = ?, in_stock = ?, hidden = ?, material = ?, finish = ?,
      image = ?, images = ?, description = ?, description_en = ?, applications = ?, price_unit = ?, supplier_price_per_meter = ?, supplier_price_per_m2_set = ?
    WHERE id = ?
  `).run(
    merged.category,
    merged.name,
    merged.nameEn,
    merged.dimensions,
    merged.pricePerMeter ?? null,
    merged.pricePerKg ?? null,
    merged.weightPerMeter,
    JSON.stringify(merged.standardLengths),
    merged.inStock ? 1 : 0,
    merged.hidden ? 1 : 0,
    merged.material ?? null,
    merged.finish ?? null,
    merged.image ?? null,
    merged.images ? JSON.stringify(merged.images) : null,
    merged.description ?? null,
    merged.descriptionEn ?? null,
    merged.applications ? JSON.stringify(merged.applications) : null,
    merged.priceUnit ?? null,
    merged.supplierPricePerMeter ?? null,
    merged.supplierPricePerSquareMeterSet ?? null,
    id
  );
}

export async function deleteProduct(id: string): Promise<void> {
  const database = getDb();
  const result = database.prepare('DELETE FROM products WHERE id = ?').run(id);
  if (result.changes === 0) throw new Error(`Product ${id} not found`);
}

export async function bulkUpdateProducts(updates: {
  pricePerKg?: number;
  weightPerMeter?: number;
}): Promise<number> {
  if (updates.pricePerKg == null && updates.weightPerMeter == null) return 0;
  const products = await getProducts();
  let count = 0;
  for (const p of products) {
    const newPricePerKg = updates.pricePerKg ?? p.pricePerKg;
    const newWeightPerMeter = updates.weightPerMeter ?? p.weightPerMeter;
    const newPricePerMeter =
      newPricePerKg != null && newWeightPerMeter != null
        ? newPricePerKg * newWeightPerMeter
        : p.pricePerMeter;
    await updateProduct(p.id, {
      pricePerKg: newPricePerKg,
      weightPerMeter: newWeightPerMeter,
      pricePerMeter: newPricePerMeter,
    });
    count += 1;
  }
  return count;
}
