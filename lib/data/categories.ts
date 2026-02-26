import { getDb } from '@/lib/db/sqlite';
import type { ProductCategory } from '@/lib/types/product';
import { PRODUCT_CATEGORIES } from '@/lib/constants/catalog';

export const BUILT_IN_IDS = new Set<string>([
  'angle',
  'plate',
  'channel',
  'i_beam',
  't_beam',
  'round_bar',
  't_profile',
  'z_profile',
  'tube_round',
  'square_bar',
  'sheet',
  'threshold',
  'tube_square',
  'tube_rectangular',
  'custom_profile',
]);

export interface CategoryOverride {
  id: string;
  name: string | null;
  name_en: string | null;
  description: string | null;
  image: string | null;
}

export interface CustomCategory {
  id: string;
  name: string;
  name_en: string;
  description: string | null;
  image: string | null;
}

export function getCategoryOverrides(): CategoryOverride[] {
  const database = getDb();
  const rows = database.prepare('SELECT id, name, name_en, description, image FROM category_overrides').all() as CategoryOverride[];
  return rows;
}

export function getCategoryOverride(id: string): CategoryOverride | null {
  const database = getDb();
  const row = database.prepare('SELECT id, name, name_en, description, image FROM category_overrides WHERE id = ?').get(id) as CategoryOverride | undefined;
  return row ?? null;
}

export function upsertCategoryOverride(
  id: string,
  data: { name?: string; nameEn?: string; description?: string; image?: string }
): void {
  const database = getDb();
  const existing = getCategoryOverride(id);
  const base = BUILT_IN_IDS.has(id) ? (PRODUCT_CATEGORIES as Record<string, { name: string; nameEn: string; description: string; image?: string }>)[id] : null;
  const name = data.name ?? existing?.name ?? base?.name ?? null;
  const name_en = data.nameEn ?? existing?.name_en ?? base?.nameEn ?? null;
  const description = data.description ?? existing?.description ?? base?.description ?? null;
  const image = data.image !== undefined ? data.image : (existing?.image ?? base?.image ?? null);

  database
    .prepare(
      `INSERT INTO category_overrides (id, name, name_en, description, image) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = ?, name_en = ?, description = ?, image = ?`
    )
    .run(id, name, name_en, description, image, name, name_en, description, image);
}

export function isValidCategoryId(id: string): id is ProductCategory {
  return BUILT_IN_IDS.has(id);
}

export function isCustomCategoryId(id: string): boolean {
  return !BUILT_IN_IDS.has(id);
}

export function getCustomCategories(): CustomCategory[] {
  const database = getDb();
  const rows = database.prepare('SELECT id, name, name_en, description, image FROM custom_categories ORDER BY name_en').all() as CustomCategory[];
  return rows;
}

export function getCustomCategory(id: string): CustomCategory | null {
  const database = getDb();
  const row = database.prepare('SELECT id, name, name_en, description, image FROM custom_categories WHERE id = ?').get(id) as CustomCategory | undefined;
  return row ?? null;
}

export function addCustomCategory(data: { id: string; name: string; nameEn: string; description?: string; image?: string }): void {
  if (BUILT_IN_IDS.has(data.id)) {
    throw new Error('Category id is reserved for built-in category');
  }
  const database = getDb();
  database
    .prepare(
      `INSERT INTO custom_categories (id, name, name_en, description, image) VALUES (?, ?, ?, ?, ?)`
    )
    .run(
      data.id,
      data.name,
      data.nameEn,
      data.description ?? null,
      data.image ?? null
    );
}

export function updateCustomCategory(id: string, data: { name?: string; nameEn?: string; description?: string; image?: string }): void {
  const database = getDb();
  const existing = getCustomCategory(id);
  if (!existing) return;
  const name = data.name ?? existing.name;
  const name_en = data.nameEn ?? existing.name_en;
  const description = data.description !== undefined ? data.description : existing.description;
  const image = data.image !== undefined ? data.image : existing.image;

  database
    .prepare('UPDATE custom_categories SET name = ?, name_en = ?, description = ?, image = ? WHERE id = ?')
    .run(name, name_en, description, image, id);
}

export function deleteCustomCategory(id: string): void {
  if (BUILT_IN_IDS.has(id)) {
    throw new Error('Cannot delete built-in category');
  }
  const database = getDb();
  database.prepare('DELETE FROM custom_categories WHERE id = ?').run(id);
}

/** Delete all custom categories (for seed/replace scripts). */
export function deleteAllCustomCategories(): void {
  const database = getDb();
  database.prepare('DELETE FROM custom_categories').run();
}

/** Delete all category overrides (for seed/replace scripts). */
export function deleteAllCategoryOverrides(): void {
  const database = getDb();
  database.prepare('DELETE FROM category_overrides').run();
}

/** Insert a custom category by raw SQL (allows any id, including built-in ids). Use for full replace. */
export function insertCustomCategoryRaw(data: {
  id: string;
  name: string;
  nameEn: string;
  description?: string | null;
  image?: string | null;
}): void {
  const database = getDb();
  database
    .prepare(
      `INSERT INTO custom_categories (id, name, name_en, description, image) VALUES (?, ?, ?, ?, ?)`
    )
    .run(
      data.id,
      data.name,
      data.nameEn,
      data.description ?? null,
      data.image ?? null
    );
}
