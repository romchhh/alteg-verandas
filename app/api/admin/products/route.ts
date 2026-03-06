import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/data/products';
import { Product, ProductCategory } from '@/lib/types/product';
import { z } from 'zod';

const PRODUCT_CATEGORIES: ProductCategory[] = [
  'angle', 'plate', 'channel', 'i_beam', 't_beam', 'round_bar',
  't_profile', 'z_profile', 'tube_round', 'square_bar', 'sheet',
  'threshold', 'tube_square', 'tube_rectangular',
];

const productCreateSchema = z.object({
  id: z.string().min(1),
  category: z.string(),
  name: z.string().min(1),
  nameEn: z.string().min(1),
  dimensions: z.string().min(1),
  pricePerMeter: z.number().optional(),
  pricePerKg: z.number().optional(),
  weightPerMeter: z.number(),
  standardLengths: z.array(z.number()),
  inStock: z.boolean().default(true),
  hidden: z.boolean().optional().default(false),
  material: z.string().optional(),
  finish: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  priceUnit: z.string().optional(),
  supplierPricePerMeter: z.number().optional(),
  supplierPricePerSquareMeterSet: z.number().optional(),
});

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = productCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid product data', details: parsed.error.errors },
        { status: 400 }
      );
    }
    const product: Product = {
      ...parsed.data,
      category: parsed.data.category,
      applications: body.applications,
    };
    await addProduct(product);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}
