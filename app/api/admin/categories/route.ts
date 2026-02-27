import { NextRequest, NextResponse } from 'next/server';
import { PRODUCT_CATEGORIES } from '@/lib/constants/catalog';
import {
  getCategoryOverrides,
  BUILT_IN_IDS,
} from '@/lib/data/categories';

function getMergedList(): { id: string; name: string; nameEn: string; description: string; image: string }[] {
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
  return builtIn;
}

export async function GET() {
  try {
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
    // Creating completely new category IDs is no longer supported.
    // We only allow editing of existing built-in categories via overrides.
    if (!BUILT_IN_IDS.has(id)) {
      return NextResponse.json(
        { error: 'Creating new categories is disabled. Use existing category ids only.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Use PATCH /api/admin/categories/{id} to update existing categories.' },
      { status: 405 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create category' },
      { status: 500 }
    );
  }
}
