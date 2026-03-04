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
  Spinner,
  EmptyState,
  InlineStack,
  Box,
} from '@shopify/polaris';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useProducts } from '@/hooks';
import { ProductTable, ProductModal, ProductTableSkeleton } from '@/components';

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

  // Loading state - show spinner while fetching products
  if (loading && products.length === 0) {
    return (
      <Page title="Product Management" backAction={{ content: 'Dashboard', onAction: () => router.push('/') }}>
        <Layout>
          <Layout.Section>
            <Card>
              <Box paddingBlock="800">
                <BlockStack gap="400" align="center">
                  <Spinner accessibilityLabel="Loading products" size="large" />
                  <Text variant="bodyMd" as="p" tone="subdued" alignment="center">
                    Loading your products...
                  </Text>
                </BlockStack>
              </Box>
            </Card>
            
            {/* Show skeleton table for better perceived performance */}
            <ProductTableSkeleton />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  // Empty state - show when no products are available
  if (!loading && products.length === 0 && !error) {
    return (
      <Page 
        title="Product Management" 
        primaryAction={{
          content: 'Add First Product',
          onAction: () => console.log('Add first product'),
        }}
        backAction={{ content: 'Dashboard', onAction: () => router.push('/') }}
      >
        <Layout>
          <Layout.Section>
            <EmptyState
              heading="No products yet"
              action={{
                content: 'Add Product',
                onAction: () => console.log('Add product'),
              }}
              secondaryAction={{
                content: 'Learn more',
                onAction: () => console.log('Learn more'),
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>Start by adding your first product to begin managing your inventory.</p>
            </EmptyState>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  // Check if any action is loading
  const isAnyActionLoading = Object.values(actionLoading).some(Boolean);

  return (
    <Page
      title="Product Management"
      subtitle={loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} ${selectedProductIds.length > 0 ? `• ${selectedProductIds.length} selected` : ''}`}
      primaryAction={{
        content: 'Add Product',
        onAction: () => console.log('Add new product'),
      }}
      secondaryActions={[
        {
          content: loading ? 'Refreshing...' : 'Refresh',
          onAction: refreshProducts,
          loading: loading,
          disabled: isAnyActionLoading,
        },
        {
          content: 'Import Products',
          onAction: () => console.log('Import products'),
          disabled: isAnyActionLoading,
        },
        {
          content: 'Settings',
          onAction: () => console.log('Product settings'),
        },
      ]}
      backAction={{ content: 'Dashboard', onAction: () => router.push('/') }}
    >
      <Layout>
        {/* Enhanced Error State */}
        {error && (
          <Layout.Section>
            <Banner
              title="Unable to load products"
              tone="critical"
              action={{
                content: 'Try Again',
                onAction: refreshProducts,
                loading: loading,
              }}
              secondaryAction={{
                content: 'Contact Support',
                onAction: () => console.log('Contact support'),
              }}
            >
              <BlockStack gap="200">
                <Text as="p">{error}</Text>
                <Text as="p" tone="subdued">
                  Check your internet connection or try refreshing the page.
                </Text>
              </BlockStack>
            </Banner>
          </Layout.Section>
        )}

        {/* Enhanced Bulk Actions Section */}
        {selectedProductIds.length > 0 && (
          <Layout.Section>
            <Card>
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text variant="headingSm" as="h3">
                    {selectedProductIds.length} item{selectedProductIds.length !== 1 ? 's' : ''} selected
                  </Text>
                  <Text variant="bodySm" as="p" tone="subdued">
                    Choose an action to apply to selected products
                  </Text>
                </BlockStack>
                
                <ButtonGroup>
                  <Button
                    onClick={handleBulkExport}
                    loading={actionLoading.exportProducts}
                    disabled={Object.values(actionLoading).some(Boolean)}
                    icon="<svg viewBox='0 0 20 20'><path d='M10 3l5 5h-3v6h-4V8H5l5-5z'/></svg>"
                  >
                    Export
                  </Button>
                  
                  <Button
                    onClick={handleBulkDelete}
                    loading={actionLoading.deleteProducts}
                    disabled={Object.values(actionLoading).some(Boolean)}
                    tone="critical"
                  >
                    Delete
                  </Button>
                  
                  <Button
                    onClick={clearSelection}
                    disabled={Object.values(actionLoading).some(Boolean)}
                    variant="plain"
                  >
                    Clear
                  </Button>
                </ButtonGroup>
              </InlineStack>
            </Card>
          </Layout.Section>
        )}

        {/* Product Table with Enhanced Loading State */}
        <Layout.Section>
          <Card padding="0">
            {loading && products.length > 0 && (
              <Box paddingInline="400" paddingBlock="200">
                <InlineStack gap="200" align="center">
                  <Spinner size="small" />
                  <Text variant="bodySm" as="span" tone="subdued">
                    Refreshing products...
                  </Text>
                </InlineStack>
              </Box>
            )}
            
            <ProductTable
              products={products}
              loading={loading && products.length === 0}
              selectable={true}
              selectedIds={selectedProductIds}
              onSelectionChange={handleSelectionChange}
              onRowClick={handleRowClick}
              onAction={handleProductAction}
              showActions={true}
              emptyStateMessage="No products found. Start by adding your first product to build your inventory."
            />
          </Card>
        </Layout.Section>

        {/* Enhanced Product Detail Modal */}
        <ProductModal
          product={selectedProduct}
          open={isModalOpen}
          onClose={closeModal}
          primaryAction={{
            content: actionLoading.addToCart ? 'Adding to Cart...' : 'Add to Cart',
            onAction: handleAddToCart,
            loading: actionLoading.addToCart,
            disabled: isAnyActionLoading,
          }}
          secondaryActions={[
            {
              content: actionLoading.editProduct ? 'Opening Editor...' : 'Edit Product',
              onAction: handleEditProduct,
              loading: actionLoading.editProduct,
              disabled: isAnyActionLoading,
            },
            {
              content: 'Duplicate',
              onAction: () => {
                console.log('Duplicate product:', selectedProduct?.id);
                closeModal();
              },
              disabled: isAnyActionLoading,
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
              disabled: isAnyActionLoading,
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