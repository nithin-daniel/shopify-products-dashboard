'use client';

import { Card, BlockStack, Box, SkeletonBodyText, SkeletonDisplayText } from '@shopify/polaris';

/**
 * ProductTableSkeleton - Loading skeleton for ProductTable
 * 
 * Provides a visual placeholder while products are loading
 * to improve perceived performance
 */
export const ProductTableSkeleton = () => {
  return (
    <Card padding="0">
      <Box padding="400">
        <BlockStack gap="300">
          {/* Table Header Skeleton */}
          <Box paddingBlockEnd="200">
            <SkeletonDisplayText size="small" />
          </Box>
          
          {/* Table Rows Skeleton */}
          {Array.from({ length: 5 }, (_, index) => (
            <Box key={index} paddingBlock="300">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {/* Image skeleton */}
                <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
                
                {/* Product info skeleton */}
                <div style={{ flex: 1 }}>
                  <BlockStack gap="100">
                    <SkeletonBodyText lines={1} />
                    <SkeletonBodyText lines={1} />
                  </BlockStack>
                </div>
                
                {/* Price skeleton */}
                <div style={{ width: '80px' }}>
                  <SkeletonBodyText lines={1} />
                </div>
                
                {/* Actions skeleton */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '60px', height: '32px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
                  <div style={{ width: '60px', height: '32px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
                </div>
              </div>
            </Box>
          ))}
        </BlockStack>
      </Box>
    </Card>
  );
};