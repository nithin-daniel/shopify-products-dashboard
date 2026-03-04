'use client';

import { Page, Card, Button, Layout, TextContainer, Text, BlockStack } from '@shopify/polaris';

export default function HomePage() {
  return (
    <Page
      title="Shopify Dashboard"
      subtitle="Welcome to your Polaris-powered Next.js dashboard"
      primaryAction={{
        content: 'Create order',
        onAction: () => console.log('Primary action'),
      }}
      secondaryActions={[
        {
          content: 'Export',
          onAction: () => console.log('Export action'),
        },
      ]}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2">
                🎉 Polaris is successfully configured!
              </Text>
              <TextContainer>
                <p>
                  Your Next.js App Router project is now properly set up with Shopify Polaris.
                  This configuration includes:
                </p>
                <ul>
                  <li>✅ Proper AppProvider setup with i18n</li>
                  <li>✅ Global CSS imports for Polaris styles</li>
                  <li>✅ TypeScript compatibility</li>
                  <li>✅ SSR-safe client-side provider</li>
                </ul>
              </TextContainer>
              <Button variant="primary">
                Get started building
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
        
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3">
                Quick Actions
              </Text>
              <BlockStack gap="200">
                <Button>View orders</Button>
                <Button>Manage products</Button>
                <Button>Customer analytics</Button>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
