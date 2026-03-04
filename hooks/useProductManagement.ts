'use client';

import { useState, useCallback } from 'react';
import { Product } from '@/types/product';
import { useProducts } from './useProducts';

/**
 * State interface for product management
 */
interface ProductManagementState {
  // Selection state
  selectedProductIds: string[];
  selectedProduct: Product | null;
  isModalOpen: boolean;
  
  // Action loading states
  actionLoading: {
    addToCart: boolean;
    editProduct: boolean;
    deleteProducts: boolean;
    exportProducts: boolean;
  };
}

/**
 * Actions interface for product management
 */
interface ProductManagementActions {
  // Selection actions
  handleRowClick: (product: Product) => void;
  handleSelectionChange: (selectedIds: string[]) => void;
  clearSelection: () => void;
  closeModal: () => void;
  
  // Individual product actions
  handleProductAction: (action: string, product: Product) => Promise<void>;
  
  // Modal actions
  handleAddToCart: () => Promise<void>;
  handleEditProduct: () => Promise<void>;
  
  // Bulk actions
  handleBulkDelete: () => Promise<void>;
  handleBulkExport: () => Promise<void>;
}

/**
 * Return type for the hook
 */
interface UseProductManagementReturn extends ProductManagementState, ProductManagementActions {
  // Product data from useProducts hook
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

/**
 * Custom hook for integrated product management
 * 
 * Provides a complete interface for managing products with:
 * - Product data fetching and state management
 * - Selection state for bulk operations
 * - Modal state for product details
 * - Action loading states
 * - Comprehensive action handlers
 */
export const useProductManagement = (): UseProductManagementReturn => {
  // Product data and loading states
  const { products, loading, error, refreshProducts } = useProducts();
  
  // Local state for product management
  const [state, setState] = useState<ProductManagementState>({
    selectedProductIds: [],
    selectedProduct: null,
    isModalOpen: false,
    actionLoading: {
      addToCart: false,
      editProduct: false,
      deleteProducts: false,
      exportProducts: false,
    },
  });

  // Update specific parts of the state
  const updateState = useCallback((updates: Partial<ProductManagementState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Update action loading state
  const updateActionLoading = useCallback((action: keyof ProductManagementState['actionLoading'], loading: boolean) => {
    setState(prev => ({
      ...prev,
      actionLoading: {
        ...prev.actionLoading,
        [action]: loading,
      },
    }));
  }, []);

  // Handle row click - open product detail modal
  const handleRowClick = useCallback((product: Product) => {
    updateState({
      selectedProduct: product,
      isModalOpen: true,
    });
  }, [updateState]);

  // Handle selection changes for bulk operations
  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    updateState({ selectedProductIds: selectedIds });
  }, [updateState]);

  // Clear selection
  const clearSelection = useCallback(() => {
    updateState({ selectedProductIds: [] });
  }, [updateState]);

  // Close modal
  const closeModal = useCallback(() => {
    updateState({
      isModalOpen: false,
      selectedProduct: null,
    });
  }, [updateState]);

  // Handle individual product actions
  const handleProductAction = useCallback(async (action: string, product: Product) => {
    try {
      switch (action) {
        case 'view':
          handleRowClick(product);
          break;
        
        case 'edit':
          // TODO: Implement product edit functionality
          // router.push(`/products/edit/${product.id}`);
          break;
        
        case 'delete':
          if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
            // TODO: Implement product deletion
            // await productService.deleteProduct(product.id);
            await refreshProducts();
          }
          break;
        
        default:
          if (process.env.NODE_ENV === 'development') {
            console.warn('Unknown action:', action);
          }
      }
    } catch (error) {
      console.error('Product action failed:', error);
    }
  }, [handleRowClick, refreshProducts]);

  // Handle modal actions
  const handleAddToCart = useCallback(async () => {
    if (!state.selectedProduct) return;
    
    updateActionLoading('addToCart', true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // TODO: Implement add to cart functionality
      // await cartService.addItem(state.selectedProduct);
      
      // Close modal after successful action
      closeModal();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      updateActionLoading('addToCart', false);
    }
  }, [state.selectedProduct, updateActionLoading, closeModal]);

  const handleEditProduct = useCallback(async () => {
    if (!state.selectedProduct) return;
    
    updateActionLoading('editProduct', true);
    
    try {
      // Navigate to edit page or open edit form
      // TODO: Navigate to edit page
      // router.push(`/products/edit/${state.selectedProduct.id}`);
      closeModal();
    } catch (error) {
      console.error('Failed to edit product:', error);
    } finally {
      updateActionLoading('editProduct', false);
    }
  }, [state.selectedProduct, updateActionLoading, closeModal]);

  // Handle bulk actions
  const handleBulkDelete = useCallback(async () => {
    if (state.selectedProductIds.length === 0) return;
    
    const confirmMessage = `Are you sure you want to delete ${state.selectedProductIds.length} product${state.selectedProductIds.length > 1 ? 's' : ''}?`;
    if (!confirm(confirmMessage)) return;
    
    updateActionLoading('deleteProducts', true);
    
    try {
      // Simulate bulk delete API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Bulk delete products:', state.selectedProductIds);
      
      // Clear selection and refresh
      clearSelection();
      await refreshProducts();
    } catch (error) {
      console.error('Failed to delete products:', error);
    } finally {
      updateActionLoading('deleteProducts', false);
    }
  }, [state.selectedProductIds, updateActionLoading, clearSelection, refreshProducts]);

  const handleBulkExport = useCallback(async () => {
    if (state.selectedProductIds.length === 0) return;
    
    updateActionLoading('exportProducts', true);
    
    try {
      // Simulate export API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Export products:', state.selectedProductIds);
      
      // In a real app, you might download a file or show success message
    } catch (error) {
      console.error('Failed to export products:', error);
    } finally {
      updateActionLoading('exportProducts', false);
    }
  }, [state.selectedProductIds, updateActionLoading]);

  return {
    // Product data
    products,
    loading,
    error,
    refreshProducts,
    
    // State
    ...state,
    
    // Actions
    handleRowClick,
    handleSelectionChange,
    clearSelection,
    closeModal,
    handleProductAction,
    handleAddToCart,
    handleEditProduct,
    handleBulkDelete,
    handleBulkExport,
  };
};