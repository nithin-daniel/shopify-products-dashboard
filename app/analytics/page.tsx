'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  DataTable,
  Spinner,
  Button,
  Icon
} from '@shopify/polaris';
import {
  ViewIcon,
  ChartVerticalIcon
} from '@shopify/polaris-icons';
import { useRouter } from 'next/navigation';
import { useAnalytics } from '@/lib/analytics';
import { AnalyticsEvent, UserActionEvent, PageViewEvent } from '@/lib/analytics/types';

interface DashboardMetrics {
  totalProductClicks: number;
  totalModalOpens: number;
  totalSessions: number;
  mostViewedProduct: {
    id: string;
    name: string;
    views: number;
  } | null;
}

interface ProductViewData {
  [key: string]: {
    id: string;
    name: string;
    views: number;
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { getEvents } = useAnalytics();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const allEvents = await getEvents();
      setEvents(allEvents);
    } catch (error) {
      console.error('Failed to load analytics events:', error);
    }
    setLoading(false);
  };

  // Test function to generate sample events
  const generateTestEvents = async () => {
    const { trackUserAction } = await import('@/lib/analytics/helpers');
    
    // Generate test events
    await trackUserAction('product_click', 'product', { 
      productId: '1', 
      productTitle: 'Test Product 1',
      productName: 'Test Product 1',
      id: '1',
      name: 'Test Product 1'
    });
    
    await trackUserAction('modal_open', 'modal', { modalType: 'product-detail' });
    
    await trackUserAction('product_view', 'product', { 
      productId: '2', 
      productTitle: 'Test Product 2',
      productName: 'Test Product 2',
      id: '2',
      name: 'Test Product 2'
    });
    
    // Reload events
    setTimeout(loadEvents, 100);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Clean aggregation logic
  const metrics = useMemo((): DashboardMetrics => {
    const userActionEvents = events.filter(
      (event): event is UserActionEvent => event.type === 'user_action'
    );

    // Count product clicks
    const productClickEvents = userActionEvents.filter(
      event => 
        event.data.action === 'product_click' || 
        event.data.action === 'view_details'
    );
    const totalProductClicks = productClickEvents.length;

    // Count modal opens
    const modalOpenEvents = userActionEvents.filter(
      event => event.data.action === 'modal_open'
    );
    const totalModalOpens = modalOpenEvents.length;

    // Count unique sessions
    const uniqueSessions = new Set(
      events.map(event => event.sessionId)
    );
    const totalSessions = uniqueSessions.size;

    // Find most viewed product
    const productViews: ProductViewData = {};
    
    userActionEvents.forEach(event => {
      if (event.data.action === 'product_view' || event.data.action === 'view_details') {
        const productId = event.data.metadata?.productId || event.data.metadata?.id;
        const productName = event.data.metadata?.productTitle || 
                           event.data.metadata?.productName || 
                           event.data.metadata?.name || 
                           `Product ${productId}`;
        
        if (productId) {
          const key = productId.toString();
          if (!productViews[key]) {
            productViews[key] = {
              id: key,
              name: productName,
              views: 0
            };
          }
          productViews[key].views++;
        }
      }
    });

    const mostViewedProduct = Object.values(productViews).reduce(
      (max, current) => !max || current.views > max.views ? current : max,
      null as ProductViewData[string] | null
    );

    return {
      totalProductClicks,
      totalModalOpens,
      totalSessions,
      mostViewedProduct
    };
  }, [events]);

  // Recent activity data for table
  const recentActivity = useMemo(() => {
    const recent = events
      .filter(event => event.type === 'user_action')
      .slice(-10)
      .reverse()
      .map(event => {
        const userEvent = event as UserActionEvent;
        return [
          new Date(event.timestamp).toLocaleTimeString(),
          userEvent.data.action,
          userEvent.data.target,
          userEvent.data.metadata?.productId || userEvent.data.metadata?.modalType || '-'
        ];
      });

    return recent;
  }, [events]);

  if (loading) {
    return (
      <Page title="Internal Dashboard">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400" align="center">
                <Spinner accessibilityLabel="Loading analytics" size="large" />
                <Text variant="bodyMd" as="p" alignment="center">
                  Loading analytics data...
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page
      title="Internal Dashboard"
      subtitle={`Data from ${events.length} events`}
      secondaryActions={[
        {
          content: 'Generate Test Data',
          onAction: generateTestEvents,
        },
        {
          content: 'Clear Data',
          onAction: async () => {
            const { analytics } = await import('@/lib/analytics');
            await analytics.clearEvents();
            setEvents([]);
          },
        },
        {
          content: 'Refresh',
          onAction: loadEvents,
        },
      ]}
    >
      <Layout>
        {/* Key Metrics */}
        <Layout.Section>
          <BlockStack gap="400">
            <Text as="h2" variant="headingLg">
              Key Metrics
            </Text>
            
            <InlineStack gap="400" wrap={false}>
              <div style={{ flex: 1 }}>
                <Card>
                  <BlockStack gap="200">
                    <InlineStack align="space-between" blockAlign="start">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodyMd" tone="subdued">
                          Product Clicks
                        </Text>
                        <Text as="p" variant="heading2xl">
                          {metrics.totalProductClicks.toLocaleString()}
                        </Text>
                      </BlockStack>
                      <Icon source={ViewIcon} tone="base" />
                    </InlineStack>
                  </BlockStack>
                </Card>
              </div>

              <div style={{ flex: 1 }}>
                <Card>
                  <BlockStack gap="200">
                    <InlineStack align="space-between" blockAlign="start">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodyMd" tone="subdued">
                          Modal Opens
                        </Text>
                        <Text as="p" variant="heading2xl">
                          {metrics.totalModalOpens.toLocaleString()}
                        </Text>
                      </BlockStack>
                      <Icon source={ViewIcon} tone="base" />
                    </InlineStack>
                  </BlockStack>
                </Card>
              </div>

              <div style={{ flex: 1 }}>
                <Card>
                  <BlockStack gap="200">
                    <InlineStack align="space-between" blockAlign="start">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodyMd" tone="subdued">
                          Total Sessions
                        </Text>
                        <Text as="p" variant="heading2xl">
                          {metrics.totalSessions.toLocaleString()}
                        </Text>
                      </BlockStack>
                      <Icon source={ChartVerticalIcon} tone="base" />
                    </InlineStack>
                  </BlockStack>
                </Card>
              </div>

              <div style={{ flex: 1 }}>
                <Card>
                  <BlockStack gap="200">
                    <InlineStack align="space-between" blockAlign="start">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodyMd" tone="subdued">
                          Most Viewed Product
                        </Text>
                        {metrics.mostViewedProduct ? (
                          <>
                            <Text as="p" variant="headingMd" truncate>
                              {metrics.mostViewedProduct.name}
                            </Text>
                            <Badge tone="success">
                              {`${metrics.mostViewedProduct.views} views`}
                            </Badge>
                          </>
                        ) : (
                          <Text as="p" variant="bodyMd" tone="subdued">
                            No data
                          </Text>
                        )}
                      </BlockStack>
                      <Icon source={ChartVerticalIcon} tone="base" />
                    </InlineStack>
                  </BlockStack>
                </Card>
              </div>
            </InlineStack>
          </BlockStack>
        </Layout.Section>

        {/* Recent Activity */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text as="h3" variant="headingMd">
                  Recent Activity
                </Text>
                <Badge tone="info">Last 10 events</Badge>
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
                    No analytics data yet. To generate data:
                  </Text>
                  <Text as="p" tone="subdued">
                    1. Visit the Products page and click on products
                  </Text>
                  <Text as="p" tone="subdued">
                    2. Use the search functionality
                  </Text>
                  <Text as="p" tone="subdued">
                    3. Apply filters and interact with the interface
                  </Text>
                  <Button onClick={() => router.push('/')}>Visit Products Page</Button>
                  <Button onClick={generateTestEvents}>Or Generate Test Data</Button>
                </BlockStack>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}