import { NextRequest, NextResponse } from 'next/server';
import { PRODUCT_CATEGORIES } from '@/lib/constants/catalog';

/**
 * Admin category detail API is read-only; updates/deletes are disabled.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const base = PRODUCT_CATEGORIES[id as keyof typeof PRODUCT_CATEGORIES];
  if (!base) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
  return NextResponse.json({
    id,
    name: base.name,
    nameEn: base.nameEn,
    description: base.description,
    image: base.image ?? '',
    isCustom: false,
  });
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Editing categories is disabled. Categories are defined in code.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Deleting categories is disabled. Categories are defined in code.' },
    { status: 405 }
  );
}
