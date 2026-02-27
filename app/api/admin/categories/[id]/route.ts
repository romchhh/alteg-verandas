import { NextRequest, NextResponse } from 'next/server';
import {
  getCategoryOverride,
  upsertCategoryOverride,
  getCustomCategory,
  updateCustomCategory,
  deleteCustomCategory,
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
  const custom = getCustomCategory(id);
  if (custom) {
    return NextResponse.json({
      id: custom.id,
      name: custom.name,
      nameEn: custom.name_en,
      description: custom.description ?? '',
      image: custom.image ?? '',
      isCustom: true,
    });
  }
  if (isValidCategoryId(id)) {
    const override = getCategoryOverride(id);
    const base = PRODUCT_CATEGORIES[id];
    return NextResponse.json({
      id,
      name: override?.name ?? base.name,
      nameEn: override?.name_en ?? base.nameEn,
      description: override?.description ?? base.description ?? '',
      image: override?.image ?? base.image ?? '',
      isCustom: false,
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

    // If a custom category exists in the DB, always treat it as custom,
    // even if the id matches a built-in category id.
    const existingCustom = getCustomCategory(id);
    if (existingCustom) {
      const oldImage = existingCustom.image ?? '';
      if (oldImage && isServerUploadUrl(oldImage) && oldImage !== newImage) {
        await deleteUploadFile(oldImage);
      }
      updateCustomCategory(id, { name, nameEn, description, image });
      const updated = getCustomCategory(id);
      return NextResponse.json({
        id: updated!.id,
        name: updated!.name,
        nameEn: updated!.name_en,
        description: updated!.description ?? '',
        image: updated!.image ?? '',
        isCustom: true,
      });
    }

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
      isCustom: false,
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
  const custom = getCustomCategory(id);
  if (!custom) {
    return NextResponse.json(
      { error: 'Cannot delete built-in category' },
      { status: 400 }
    );
  }
  try {
    deleteCustomCategory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete category' },
      { status: 500 }
    );
  }
}
