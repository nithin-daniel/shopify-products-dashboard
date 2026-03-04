'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Icon,
  DataTable
} from '@shopify/polaris';
import {
  ViewIcon,
  ChartVerticalIcon
} from '@shopify/polaris-icons';
import { useRouter } from 'next/navigation';
import { useAnalytics } from '@/lib/analytics';

export default function AnalyticsPage() {
  const router = useRouter();
  const { track, events, clearEvents, refreshEvents } = useAnalytics();

  useEffect(() => {
    // Track page view only once when component mounts
    track.pageView('/analytics', 'Analytics Dashboard');
  }, []); // Empty dependency array to run only once

  // Calculate metrics from events
  const metrics = useMemo(() => {
    const productClicks = events.filter(e => e.data.action === 'product_click').length;
    const modalOpens = events.filter(e => e.data.action === 'modal_open').length;
    const pageViews = events.filter(e => e.data.action === 'page_view').length;
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size;

    // Get most clicked product
    const productClickEvents = events.filter(e => e.data.action === 'product_click');
    const productCounts: { [key: string]: { id: string; count: number; name?: string } } = {};
    
    productClickEvents.forEach(event => {
      const productId = event.data.metadata?.productId;
      const productTitle = event.data.metadata?.productTitle;
      if (productId) {
        if (!productCounts[productId]) {
          productCounts[productId] = { id: productId, count: 0, name: productTitle };
        }
        productCounts[productId].count++;
      }
    });

    const mostClickedProduct = Object.values(productCounts)
      .sort((a, b) => b.count - a.count)[0];

    return {
      productClicks,
      modalOpens,
      pageViews,
      uniqueSessions,
      mostClickedProduct
    };
  }, [events]);

  // Recent activity for table
  const recentActivity = useMemo(() => {
    return events
      .slice(-10)
      .reverse()
      .map(event => [
        new Date(event.timestamp).toLocaleTimeString(),
        event.data.action,
        event.data.target,
        event.data.metadata?.productId || event.data.metadata?.modalType || event.data.metadata?.path || '-'
      ]);
  }, [events]);

  const handleClearData = useCallback(async () => {
    await clearEvents();
  }, [clearEvents]);

  const generateTestData = useCallback(() => {
    // Generate some test events
    for (let i = 1; i <= 5; i++) {
      track.productClick(`product-${i}`, i);
      track.userAction('product_view', 'product', { 
        productId: `product-${i}`, 
        productTitle: `Test Product ${i}` 
      });
    }
    track.modalOpen('product-detail');
    track.modalOpen('product-detail');
    track.modalOpen('product-detail');
  }, [track]);

  return (
    <Page
      title="Internal Dashboard"
      primaryAction={{
        content: 'Back to Products',
        onAction: () => router.push('/'),
      }}
      secondaryActions={[
        {
          content: 'Refresh Data',
          onAction: refreshEvents,
        },
        {
          content: 'Clear Data',
          onAction: handleClearData,
          destructive: true,
        }
      ]}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <Text as="h2" variant="headingLg">Analytics Overview</Text>
            
            <InlineStack gap="400" align="space-between">
              <div style={{ flex: 1 }}>
                <Card>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodyMd" tone="subdued">
                          Product Clicks
                        </Text>
                        <Text as="p" variant="headingXl">
                          {metrics.productClicks}
                        </Text>
                        <Badge tone="info">
                          {`${metrics.uniqueSessions} session${metrics.uniqueSessions !== 1 ? 's' : ''}`}
                        </Badge>
                      </BlockStack>
                      <Icon source={ViewIcon} tone="base" />
                    </InlineStack>
                  </BlockStack>
                </Card>
              </div>

              <div style={{ flex: 1 }}>
                <Card>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodyMd" tone="subdued">
                          Modal Opens
                        </Text>
                        <Text as="p" variant="headingXl">
                          {metrics.modalOpens}
                        </Text>
                        <Badge tone="success">
                          Recent activity
                        </Badge>
                      </BlockStack>
                      <Icon source={ChartVerticalIcon} tone="base" />
                    </InlineStack>
                  </BlockStack>
                </Card>
              </div>
            </InlineStack>
          </BlockStack>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text as="h3" variant="headingMd">
                  Recent Activity
                </Text>
                <Badge tone="info">{`${events.length} total events`}</Badge>
              </InlineStack>
              
              {recentActivity.length > 0 ? (
                <DataTable
                  columnContentTypes={['text', 'text', 'text', 'text']}
                  headings={['Time', 'Action', 'Target', 'Details']}
                  rows={recentActivity}
                />
              ) : (
                <BlockStack gap="200" align="center">
                  <Text as="p" tone="subdued">
                    No analytics data yet. Start interacting with the app to generate events.
                  </Text>
                  <Button onClick={generateTestData} variant="primary">
                    Generate Test Data
                  </Button>
                </BlockStack>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Analytics Summary
              </Text>
              
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">
                  <strong>Total Events:</strong> {events.length.toString()}
                </Text>
                <Text as="p" variant="bodyMd">
                  <strong>Page Views:</strong> {metrics.pageViews.toString()}
                </Text>
                <Text as="p" variant="bodyMd">
                  <strong>Product Interactions:</strong> {metrics.productClicks.toString()}
                </Text>
                <Text as="p" variant="bodyMd">
                  <strong>Modal Events:</strong> {metrics.modalOpens.toString()}
                </Text>
                {metrics.mostClickedProduct && (
                  <Text as="p" variant="bodyMd">
                    <strong>Most Clicked Product:</strong> {metrics.mostClickedProduct.name || metrics.mostClickedProduct.id} ({metrics.mostClickedProduct.count.toString()} clicks)
                  </Text>
                )}
              </BlockStack>
              
              <InlineStack gap="200">
                <Button onClick={() => router.push('/')}>
                  View Products
                </Button>
                <Button onClick={() => router.push('/products/table')}>
                  View Table
                </Button>
                <Button onClick={refreshEvents}>
                  Refresh Data
                </Button>
                <Button onClick={handleClearData} tone="critical">
                  Clear All Data
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
