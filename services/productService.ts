import { 
  Product, 
  ApiProduct,
  ProductsApiResponse, 
  ServiceResponse, 
  ProductServiceConfig 
} from '@/types/product';
import { enrichProductsWithMockData, enrichProductWithMockData } from '@/utils/mockProductEnrichment';

/**
 * Production-ready Product Service
 * Handles API communication with proper error handling and TypeScript support
 */
export class ProductService {
  private config: ProductServiceConfig;

  constructor(config?: Partial<ProductServiceConfig>) {
    this.config = {
      baseUrl: 'https://fakestoreapi.com',
      timeout: 10000,
      retryAttempts: 3,
      ...config
    };
  }

  /**
   * Fetches all products from the API
   * @returns Promise<ServiceResponse<Product[]>>
   */
  async getProducts(): Promise<ServiceResponse<Product[]>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/products`, {
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const apiProducts: ApiProduct[] = await response.json();
      const enrichedProducts = enrichProductsWithMockData(apiProducts);

      return {
        data: enrichedProducts,
        success: true
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        success: false
      };
    }
  }

  /**
   * Fetches a single product by ID
   * @param id - Product ID
   * @returns Promise<ServiceResponse<Product>>
   */
  async getProductById(id: number): Promise<ServiceResponse<Product>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/products/${id}`, {
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const apiProduct: ApiProduct = await response.json();
      const enrichedProduct = enrichProductWithMockData(apiProduct);

      return {
        data: enrichedProduct,
        success: true
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        success: false
      };
    }
  }

  /**
   * Fetches products by category
   * @param category - Product category
   * @returns Promise<ServiceResponse<Product[]>>
   */
  async getProductsByCategory(category: string): Promise<ServiceResponse<Product[]>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/products/category/${category}`, {
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const apiProducts: ApiProduct[] = await response.json();
      const enrichedProducts = enrichProductsWithMockData(apiProducts);

      return {
        data: enrichedProducts,
        success: true
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch products by category',
        success: false
      };
    }
  }

  /**
   * Fetches all available categories
   * @returns Promise<ServiceResponse<string[]>>
   */
  async getCategories(): Promise<ServiceResponse<string[]>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/products/categories`, {
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const categories: string[] = await response.json();

      return {
        data: categories,
        success: true
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        success: false
      };
    }
  }

  /**
   * Updates service configuration
   * @param newConfig - Partial configuration to merge
   */
  updateConfig(newConfig: Partial<ProductServiceConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Default instance for easy imports
export const productService = new ProductService();