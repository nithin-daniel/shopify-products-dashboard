'use client';

import { useState, useCallback } from 'react';
import {
  Page,
  Layout,
  Banner,
  Button,
  ButtonGroup,
  Text,
  Card,
  BlockStack,
} from '@shopify/polaris';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useProducts } from '@/hooks';
import { ProductTable, ProductModal } from '@/components';

/**
 * Integrated Products Management Page
 * 
 * Features:
 * - ProductTable with integrated ProductModal
 * - Complete loading and error state handling
 * - Bulk selection and actions
 * - Individual product actions
 * - Clean state management
 */
export default function IntegratedProductsPage() {
  const router = useRouter();
  
  // Product data and loading states
  const { products, loading, error, refreshProducts } = useProducts();
  
  // Selection state for bulk operations
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Modal state for product details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Action loading states
  const [actionLoading, setActionLoading] = useState({
    addToCart: false,
    editProduct: false,
    deleteProducts: false,
    exportProducts: false,
  });

  // Handle row click - open product detail modal
  const handleRowClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  // Handle selection changes for bulk operations
  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    setSelectedProductIds(selectedIds);
  }, []);

  // Handle individual product actions
  const handleProductAction = useCallback(async (action: string, product: Product) => {
    switch (action) {
      case 'view':
        handleRowClick(product);
        break;
      
      case 'edit':
        console.log('Edit product:', product.id);
        // Navigate to edit page or open edit modal
        // router.push(`/products/edit/${product.id}`);
        break;
      
      case 'delete':
        if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
          console.log('Delete product:', product.id);
          // Implement delete logic
        }
        break;
      
      default:
        console.warn('Unknown action:', action);
    }
  }, [handleRowClick]);

  // Handle modal actions
  const handleAddToCart = useCallback(async () => {
    if (!selectedProduct) return;
    
    setActionLoading(prev => ({ ...prev, addToCart: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Added to cart:', selectedProduct.title);
      
      // Close modal after successful action
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, addToCart: false }));
    }
  }, [selectedProduct]);

  const handleEditProduct = useCallback(async () => {
    if (!selectedProduct) return;
    
    setActionLoading(prev => ({ ...prev, editProduct: true }));
    
    try {
      // Navigate to edit page or open edit form
      console.log('Edit product:', selectedProduct.id);
      // router.push(`/products/edit/${selectedProduct.id}`);
      
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to edit product:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, editProduct: false }));
    }
  }, [selectedProduct]);

  // Handle bulk actions
  const handleBulkDelete = useCallback(async () => {
    if (selectedProductIds.length === 0) return;
    
    const confirmMessage = `Are you sure you want to delete ${selectedProductIds.length} product${selectedProductIds.length > 1 ? 's' : ''}?`;
    if (!confirm(confirmMessage)) return;
    
    setActionLoading(prev => ({ ...prev, deleteProducts: true }));
    
    try {
      // Simulate bulk delete API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Bulk delete products:', selectedProductIds);
      
      // Clear selection after successful delete
      setSelectedProductIds([]);
      
      // Refresh products list
      refreshProducts();
    } catch (error) {
      console.error('Failed to delete products:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, deleteProducts: false }));
    }
  }, [selectedProductIds, refreshProducts]);

  const handleBulkExport = useCallback(async () => {
    if (selectedProductIds.length === 0) return;
    
    setActionLoading(prev => ({ ...prev, exportProducts: true }));
    
    try {
      // Simulate export API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Export products:', selectedProductIds);
      
      // In a real app, you might download a file or show success message
    } catch (error) {
      console.error('Failed to export products:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, exportProducts: false }));
    }
  }, [selectedProductIds]);

  // Close modal handler
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // Clear selection handler
  const clearSelection = useCallback(() => {
    setSelectedProductIds([]);
  }, []);

  // Bulk actions section
  const bulkActionsSection = selectedProductIds.length > 0 && (
    <Layout.Section>
      <Card>
        <BlockStack gap="300">
          <Text variant="headingSm" as="h3">
            {selectedProductIds.length} product{selectedProductIds.length > 1 ? 's' : ''} selected
          </Text>
          
          <ButtonGroup>
            <Button
              onClick={handleBulkExport}
              loading={actionLoading.exportProducts}
              disabled={Object.values(actionLoading).some(Boolean)}
            >
              Export Selected
            </Button>
            
            <Button
              onClick={handleBulkDelete}
              loading={actionLoading.deleteProducts}
              disabled={Object.values(actionLoading).some(Boolean)}
              tone="critical"
            >
              Delete Selected
            </Button>
            
            <Button
              onClick={clearSelection}
              disabled={Object.values(actionLoading).some(Boolean)}
            >
              Clear Selection
            </Button>
          </ButtonGroup>
        </BlockStack>
      </Card>
    </Layout.Section>
  );

  return (
    <Page
      title="Product Management"
      subtitle={`${products.length} products available`}
      primaryAction={{
        content: 'Add Product',
        onAction: () => console.log('Add new product'),
      }}
      secondaryActions={[
        {
          content: 'Refresh',
          onAction: refreshProducts,
          loading: loading,
        },
        {
          content: 'Import Products',
          onAction: () => console.log('Import products'),
        },
        {
          content: 'Export All',
          onAction: () => console.log('Export all products'),
        },
      ]}
      backAction={{
        content: 'Dashboard',
        onAction: () => router.push('/'),
      }}
    >
      <Layout>
        {/* Error Banner */}
        {error && (
          <Layout.Section>
            <Banner
              title="Error loading products"
              tone="critical"
              action={{
                content: 'Retry',
                onAction: refreshProducts,
              }}
              onDismiss={() => window.location.reload()}
            >
              <p>{error}</p>
            </Banner>
          </Layout.Section>
        )}

        {/* Bulk Actions Section */}
        {bulkActionsSection}

        {/* Product Table */}
        <Layout.Section>
          <ProductTable
            products={products}
            loading={loading}
            selectable={true}
            selectedIds={selectedProductIds}
            onSelectionChange={handleSelectionChange}
            onRowClick={handleRowClick}
            onAction={handleProductAction}
            showActions={true}
            emptyStateMessage="No products found. Add some products to get started."
          />
        </Layout.Section>

        {/* Product Detail Modal */}
        <ProductModal
          product={selectedProduct}
          open={isModalOpen}
          onClose={closeModal}
          primaryAction={{
            content: 'Add to Cart',
            onAction: handleAddToCart,
            loading: actionLoading.addToCart,
            disabled: Object.values(actionLoading).some(Boolean),
          }}
          secondaryActions={[
            {
              content: 'Edit Product',
              onAction: handleEditProduct,
              loading: actionLoading.editProduct,
              disabled: Object.values(actionLoading).some(Boolean),
            },
            {
              content: 'Share',
              onAction: () => {
                if (selectedProduct && navigator.share) {
                  navigator.share({
                    title: selectedProduct.title,
                    text: selectedProduct.description,
                    url: window.location.href,
                  }).catch(console.error);
                }
              },
            },
            {
              content: 'Close',
              onAction: closeModal,
            },
          ]}
          showCategory={true}
          showRating={true}
          size="large"
        />
      </Layout>
    </Page>
  );
}