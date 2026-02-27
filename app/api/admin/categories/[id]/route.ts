import { NextRequest, NextResponse } from 'next/server';
import {
  getCategoryOverride,
  upsertCategoryOverride,
  isValidCategoryId,
} from '@/lib/data/categories';
import { PRODUCT_CATEGORIES } from '@/lib/constants/catalog';
import { deleteUploadFile } from '@/lib/utils/uploadPath';
import { isServerUploadUrl } from '@/lib/utils/image';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  if (isValidCategoryId(id)) {
    const override = getCategoryOverride(id);
    const base = PRODUCT_CATEGORIES[id];
    return NextResponse.json({
      id,
      name: override?.name ?? base.name,
      nameEn: override?.name_en ?? base.nameEn,
      description: override?.description ?? base.description ?? '',
      image: override?.image ?? base.image ?? '',
    });
  }
  return NextResponse.json({ error: 'Category not found' }, { status: 404 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name : undefined;
    const nameEn = typeof body.nameEn === 'string' ? body.nameEn : undefined;
    const description = typeof body.description === 'string' ? body.description : undefined;
    const image = typeof body.image === 'string' ? body.image : undefined;
    const newImage = image ?? '';

    if (!isValidCategoryId(id)) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    const override = getCategoryOverride(id);
    const base = PRODUCT_CATEGORIES[id];
    const oldImage = override?.image ?? base?.image ?? '';
    if (oldImage && isServerUploadUrl(oldImage) && oldImage !== newImage) {
      await deleteUploadFile(oldImage);
    }
    upsertCategoryOverride(id, { name, nameEn, description, image });
    const updatedOverride = getCategoryOverride(id);
    return NextResponse.json({
      id,
      name: updatedOverride?.name ?? base.name,
      nameEn: updatedOverride?.name_en ?? base.nameEn,
      description: updatedOverride?.description ?? base.description ?? '',
      image: updatedOverride?.image ?? base.image ?? '',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  // Deleting categories is not supported when only built-in categories are used.
  return NextResponse.json(
    { error: 'Deleting categories is disabled.' },
    { status: 400 }
  );
}
