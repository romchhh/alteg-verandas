/**
 * Delete specific categories (including ones currently treated as "built-in")
 * and optionally their products.
 *
 * Run with:
 *   npx tsx scripts/delete-categories.ts
 */

import { getDb } from '../lib/db/sqlite';
import { deleteUploadFile } from '../lib/utils/uploadPath';
import { isServerUploadUrl } from '../lib/utils/image';

// IDs in the database, not display names.
// For your case:
// - "Square Bar"        -> square_bar
// - "Sheet"             -> sheet
// - "Checker plate"     -> checker_plate
// - "Mesh"              -> mesh
const CATEGORY_IDS_TO_DELETE = ['square_bar', 'sheet', 'checker_plate', 'mesh'] as const;

async function main() {
  const db = getDb();

  // Collect all images we should try to remove from disk
  type Row = { image: string | null };

  const placeholders = CATEGORY_IDS_TO_DELETE.map(() => '?').join(', ');

  const catImages = db
    .prepare(`SELECT image FROM custom_categories WHERE id IN (${placeholders})`)
    .all(...CATEGORY_IDS_TO_DELETE) as Row[];

  const overrideImages = db
    .prepare(`SELECT image FROM category_overrides WHERE id IN (${placeholders})`)
    .all(...CATEGORY_IDS_TO_DELETE) as Row[];

  const productImages = db
    .prepare(`SELECT image FROM products WHERE category IN (${placeholders})`)
    .all(...CATEGORY_IDS_TO_DELETE) as Row[];

  const allImages = [...catImages, ...overrideImages, ...productImages]
    .map((r) => r.image)
    .filter((img): img is string => typeof img === 'string' && img.trim().length > 0);

  // Delete DB records inside a transaction
  const tx = db.transaction(() => {
    // Delete products belonging to these categories
    db.prepare(`DELETE FROM products WHERE category IN (${placeholders})`).run(...CATEGORY_IDS_TO_DELETE);

    // Delete custom categories (even if their ids happen to be in BUILT_IN_IDS)
    db.prepare(`DELETE FROM custom_categories WHERE id IN (${placeholders})`).run(...CATEGORY_IDS_TO_DELETE);

    // Delete overrides for these ids (so built-in definitions no longer have overrides)
    db.prepare(`DELETE FROM category_overrides WHERE id IN (${placeholders})`).run(...CATEGORY_IDS_TO_DELETE);
  });

  tx();

  // Try to remove associated uploaded files (only /uploads/... paths)
  for (const url of allImages) {
    if (isServerUploadUrl(url)) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await deleteUploadFile(url);
        // eslint-disable-next-line no-console
        console.log('Deleted image file for', url);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to delete image file', url, e);
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log('Deleted categories:', CATEGORY_IDS_TO_DELETE.join(', '));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('delete-categories.ts failed:', err);
  process.exit(1);
});

