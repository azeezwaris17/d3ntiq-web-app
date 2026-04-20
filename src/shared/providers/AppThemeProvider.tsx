'use client';
import React from 'react';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { dentiqTheme } from '@/shared/theme/mantine-theme';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  return (
    <MantineProvider theme={dentiqTheme} forceColorScheme="light">
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  );
};
