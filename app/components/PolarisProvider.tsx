'use client';

import { AppProvider } from '@shopify/polaris';
import { ReactNode } from 'react';

interface PolarisProviderProps {
  children: ReactNode;
}

export function PolarisProvider({ children }: PolarisProviderProps) {
  return (
    <AppProvider
      i18n={{
        Polaris: {
          Avatar: {
            label: 'Avatar',
            labelWithInitials: 'Avatar with initials {initials}',
          },
          ContextualSaveBar: {
            save: 'Save',
            discard: 'Discard',
          },
          TextField: {
            characterCount: '{count} characters',
          },
          TopBar: {
            toggleMenuLabel: 'Toggle menu',
            SearchField: {
              clearButtonLabel: 'Clear',
              search: 'Search',
            },
          },
        },
      }}
    >
      {children}
    </AppProvider>
  );
}