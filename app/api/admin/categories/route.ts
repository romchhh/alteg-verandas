import { NextResponse } from 'next/server';
import { PRODUCT_CATEGORIES } from '@/lib/constants/catalog';

/**
 * Admin API for categories is now read-only.
 * Categories are defined as built-in types in code; custom DB categories are disabled.
 */
export async function GET() {
  try {
    const categories = Object.entries(PRODUCT_CATEGORIES).map(([id, val]) => ({
      id,
      name: val.name,
      nameEn: val.nameEn,
      description: val.description,
      image: val.image ?? '',
      isCustom: false,
    }));
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Creating categories via admin is disabled. Categories are defined in code.' },
    { status: 405 }
  );
}
