import { NextRequest, NextResponse } from 'next/server';
import { PRODUCT_CATEGORIES } from '@/lib/constants/catalog';
import {
  getCategoryOverrides,
  getCustomCategories,
  addCustomCategory,
  BUILT_IN_IDS,
} from '@/lib/data/categories';

function getMergedList(): { id: string; name: string; nameEn: string; description: string; image: string; isCustom?: boolean }[] {
  const overrides = getCategoryOverrides();
  const overrideMap = new Map(overrides.map((o) => [o.id, o]));
  const builtIn = Object.entries(PRODUCT_CATEGORIES).map(([key, val]) => {
    const ov = overrideMap.get(key);
    return {
      id: key,
      name: ov?.name ?? val.name,
      nameEn: ov?.name_en ?? val.nameEn,
      description: ov?.description ?? val.description,
      image: ov?.image ?? val.image ?? '',
    };
  });
  const custom = getCustomCategories().map((c) => ({
    id: c.id,
    name: c.name,
    nameEn: c.name_en,
    description: c.description ?? '',
    image: c.image ?? '',
    isCustom: true,
  }));
  return [...builtIn, ...custom];
}

export async function GET() {
  try {
    const custom = getCustomCategories();
    if (custom.length > 0) {
      return NextResponse.json(
        custom.map((c) => ({
          id: c.id,
          name: c.name,
          nameEn: c.name_en,
          description: c.description ?? '',
          image: c.image ?? '',
          isCustom: true,
        }))
      );
    }
    const categories = getMergedList();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = typeof body.id === 'string' ? body.id.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const nameEn = typeof body.nameEn === 'string' ? body.nameEn.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : undefined;
    const image = typeof body.image === 'string' ? body.image.trim() : undefined;

    if (!id || !name || !nameEn) {
      return NextResponse.json(
        { error: 'id, name and nameEn are required' },
        { status: 400 }
      );
    }
    if (BUILT_IN_IDS.has(id)) {
      return NextResponse.json(
        { error: 'This id is reserved for a built-in category' },
        { status: 400 }
      );
    }

    addCustomCategory({ id, name, nameEn, description, image });
    const list = getMergedList();
    const created = list.find((c) => c.id === id);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create category' },
      { status: 500 }
    );
  }
}
