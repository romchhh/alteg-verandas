import { NextResponse } from 'next/server';
import { PRODUCT_CATEGORIES } from '@/lib/constants/catalog';
import { getCategoryOverrides, getCustomCategories } from '@/lib/data/categories';

/**
 * Public API: returns categories for catalog, checkout, etc.
 * If custom categories exist in DB, returns only those (full replace). Otherwise returns built-in + overrides + custom.
 */
export async function GET() {
  try {
    const custom = getCustomCategories();
    if (custom.length > 0) {
      // When custom categories exist in DB, they fully define the list.
      return NextResponse.json(
        custom.map((c) => ({
          id: c.id,
          name: c.name,
          nameEn: c.name_en,
          description: c.description ?? '',
          image: c.image ?? '',
        }))
      );
    }

    // Fallback: built-in categories plus overrides.
    const overrides = getCategoryOverrides();
    const overrideMap = new Map(overrides.map((o) => [o.id, o]));

    const builtIn = Object.entries(PRODUCT_CATEGORIES).map(([key, val]) => {
      const ov = overrideMap.get(key);
      return {
        id: key,
        name: ov?.name ?? val.name,
        nameEn: ov?.name_en ?? val.nameEn,
        description: ov?.description ?? val.description,
        image: ov?.image ?? val.image,
      };
    });
    return NextResponse.json(builtIn);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
