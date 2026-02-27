import { NextResponse } from 'next/server';
import { PRODUCT_CATEGORIES } from '@/lib/constants/catalog';
import { getCategoryOverrides } from '@/lib/data/categories';

/**
 * Public API: returns categories for catalog, checkout, etc.
 * If custom categories exist in DB, returns only those (full replace). Otherwise returns built-in + overrides + custom.
 */
export async function GET() {
  try {
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
    return NextResponse.json([...builtIn]);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
