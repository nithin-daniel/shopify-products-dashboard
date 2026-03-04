'use client';

import { useState } from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Icon
} from '@shopify/polaris';
import {
  ViewIcon,
  ChartVerticalIcon
} from '@shopify/polaris-icons';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const router = useRouter();

  return (
    <Page
      title="Internal Dashboard"
      primaryAction={{
        content: 'Back to Products',
        onAction: () => router.push('/'),
      }}
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
                          0
                        </Text>
                        <Badge tone="info">
                          This session
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
                          0
                        </Text>
                        <Badge tone="success">
                          This session
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
              <Text as="h3" variant="headingMd">
                Analytics Features
              </Text>
              
              <Text as="p" variant="bodyMd" tone="subdued">
                This is a simplified analytics dashboard. The analytics system has been removed to keep the codebase clean and focused on the core product management functionality.
              </Text>
              
              <InlineStack gap="200">
                <Button onClick={() => router.push('/')}>
                  View Products
                </Button>
                <Button onClick={() => router.push('/products/table')}>
                  View Table
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
