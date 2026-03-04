import { 
  Product, 
  ApiProduct, 
  ProductStatus, 
  ProductAvailability,
  MOCK_VENDORS,
  PRODUCT_TYPES 
} from '@/types/product';

/**
 * Deterministic seeded random number generator
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate mock status based on product ID
 */
function generateMockStatus(productId: number): ProductStatus {
  const statuses: ProductStatus[] = ['active', 'draft', 'archived'];
  const index = Math.floor(seededRandom(productId * 1.1) * statuses.length);
  return statuses[index];
}

/**
 * Generate mock vendor based on product ID and category
 */
function generateMockVendor(productId: number, category: string): string {
  const vendors = MOCK_VENDORS[category as keyof typeof MOCK_VENDORS] || ['Generic Store'];
  const index = Math.floor(seededRandom(productId * 2.3) * vendors.length);
  return vendors[index];
}

/**
 * Generate mock product type
 */
function generateMockProductType(productId: number, category: string, title: string): string {
  const types = PRODUCT_TYPES[category as keyof typeof PRODUCT_TYPES] || ['General Item'];
  
  // Try to match based on title keywords first
  const titleLower = title.toLowerCase();
  for (const type of types) {
    if (titleLower.includes(type.toLowerCase())) {
      return type;
    }
  }
  
  // Fallback to seeded random
  const index = Math.floor(seededRandom(productId * 3.7) * types.length);
  return types[index];
}

/**
 * Generate mock availability based on product ID and rating
 */
function generateMockAvailability(productId: number, rating: number): ProductAvailability {
  // Higher rated products more likely to be in stock
  const ratingBonus = rating > 4.0 ? 0.3 : rating > 3.0 ? 0.1 : 0;
  const randomValue = seededRandom(productId * 4.1) + ratingBonus;
  
  if (randomValue > 0.8) return 'in_stock';
  if (randomValue > 0.4) return 'low_stock';
  return 'out_of_stock';
}

/**
 * Main enrichment function that adds UI-only fields to API products
 */
export function enrichProductWithMockData(apiProduct: ApiProduct): Product {
  return {
    ...apiProduct,
    status: generateMockStatus(apiProduct.id),
    vendor: generateMockVendor(apiProduct.id, apiProduct.category),
    productType: generateMockProductType(apiProduct.id, apiProduct.category, apiProduct.title),
    availability: generateMockAvailability(apiProduct.id, apiProduct.rating.rate),
  };
}

/**
 * Batch enrichment for multiple products
 */
export function enrichProductsWithMockData(apiProducts: ApiProduct[]): Product[] {
  return apiProducts.map(enrichProductWithMockData);
}