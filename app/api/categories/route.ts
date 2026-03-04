import { NextResponse } from 'next/server';
import { PRODUCT_CATEGORIES } from '@/lib/constants/catalog';

/**
 * Public API: returns built-in product categories for catalog/checkout.
 * DB-stored categories are no longer used; categories are defined in code only.
 */
export async function GET() {
  try {
    const builtIn = Object.entries(PRODUCT_CATEGORIES).map(([key, val]) => ({
      id: key,
      name: val.name,
      nameEn: val.nameEn,
      description: val.description,
      image: val.image,
    }));
    return NextResponse.json(builtIn);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
