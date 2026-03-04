import { Product, ProductStatus } from '@/types/product';

export interface FilterOptions {
  searchQuery?: string;
  status?: ProductStatus[];
  purchaseAvailability?: string[];
  productType?: string[];
  vendor?: string[];
}

export function filterProducts(products: Product[], filters: FilterOptions): Product[] {
  let filtered = [...products];

  // Search filter
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(product => 
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(product => 
      filters.status!.includes(product.status)
    );
  }

  // Purchase availability filter
  if (filters.purchaseAvailability && filters.purchaseAvailability.length > 0) {
    filtered = filtered.filter(product => 
      filters.purchaseAvailability!.includes(product.availability)
    );
  }

  // Product type filter
  if (filters.productType && filters.productType.length > 0) {
    filtered = filtered.filter(product => 
      filters.productType!.includes(product.productType)
    );
  }

  // Vendor filter
  if (filters.vendor && filters.vendor.length > 0) {
    filtered = filtered.filter(product => 
      filters.vendor!.includes(product.vendor)
    );
  }

  return filtered;
}