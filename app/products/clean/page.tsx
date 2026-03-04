'use client';

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
import { useProductManagement } from '@/hooks';
import { ProductTable, ProductModal } from '@/components';

/**
 * Clean Integrated Products Page using useProductManagement hook
 * 
 * This demonstrates a production-ready implementation with:
 * - Clean separation of concerns using custom hooks
 * - Complete error and loading state handling
 * - Bulk operations with proper UX
 * - Modal integration with action states
 */
export default function CleanIntegratedProductsPage() {
  const router = useRouter();
  
  // All product management logic is encapsulated in this hook
  const {
    // Product data
    products,
    loading,
    error,
    refreshProducts,
    
    // Selection state
    selectedProductIds,
    selectedProduct,
    isModalOpen,
    actionLoading,
    
    // Action handlers
    handleRowClick,
    handleSelectionChange,
    clearSelection,
    closeModal,
    handleProductAction,
    handleAddToCart,
    handleEditProduct,
    handleBulkDelete,
    handleBulkExport,
  } = useProductManagement();

  // Check if any action is loading
  const isAnyActionLoading = Object.values(actionLoading).some(Boolean);

  return (
    <Page
      title="Product Management Hub"
      subtitle={`${products.length} products • ${selectedProductIds.length} selected`}
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
          content: 'Import',
          onAction: () => console.log('Import products'),
        },
      ]}
      backAction={{
        content: 'Dashboard',
        onAction: () => router.push('/'),
      }}
    >
      <Layout>
        {/* Error State */}
        {error && (
          <Layout.Section>
            <Banner
              title="Failed to load products"
              tone="critical"
              action={{
                content: 'Retry',
                onAction: refreshProducts,
              }}
            >
              <Text as="p">{error}</Text>
            </Banner>
          </Layout.Section>
        )}

        {/* Bulk Actions Bar */}
        {selectedProductIds.length > 0 && (
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">
                  {selectedProductIds.length} product{selectedProductIds.length !== 1 ? 's' : ''} selected
                </Text>
                
                <ButtonGroup>
                  <Button
                    onClick={handleBulkExport}
                    loading={actionLoading.exportProducts}
                    disabled={isAnyActionLoading}
                  >
                    Export ({selectedProductIds.length.toString()})
                  </Button>
                  
                  <Button
                    onClick={handleBulkDelete}
                    loading={actionLoading.deleteProducts}
                    disabled={isAnyActionLoading}
                    tone="critical"
                  >
                    Delete ({selectedProductIds.length.toString()})
                  </Button>
                  
                  <Button
                    onClick={clearSelection}
                    disabled={isAnyActionLoading}
                  >
                    Clear Selection
                  </Button>
                </ButtonGroup>
              </BlockStack>
            </Card>
          </Layout.Section>
        )}

        {/* Products Table */}
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
            emptyStateMessage="No products available. Start by adding your first product."
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
            disabled: isAnyActionLoading,
          }}
          secondaryActions={[
            {
              content: 'Edit Product',
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