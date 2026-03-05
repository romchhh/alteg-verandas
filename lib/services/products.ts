import { Product, ProductCategory } from '@/lib/types/product';
import { SAMPLE_PRODUCTS } from '@/lib/constants/products';
import { getProducts } from '@/lib/data/products';

export async function getAllProducts(): Promise<Product[]> {
  try {
    const dataProducts = await getProducts();
    if (dataProducts.length > 0) return dataProducts.filter((p) => !p.hidden);
  } catch {
    // Fallback to catalog if no data file
  }
  return Promise.resolve(SAMPLE_PRODUCTS.filter((p) => !p.hidden));
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((product) => product.category === category);
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((product) => product.id === id) || null;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getAllProducts();
  const lowerQuery = query.toLowerCase();
  
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.nameEn.toLowerCase().includes(lowerQuery) ||
      product.dimensions.toLowerCase().includes(lowerQuery) ||
      (product.applications && product.applications.some((app) => app.toLowerCase().includes(lowerQuery))) ||
      (product.descriptionEn && product.descriptionEn.toLowerCase().includes(lowerQuery)) ||
      (product.description && product.description.toLowerCase().includes(lowerQuery)) ||
      (product.material && product.material.toLowerCase().includes(lowerQuery)) ||
      (product.finish && product.finish.toLowerCase().includes(lowerQuery))
  );
}
