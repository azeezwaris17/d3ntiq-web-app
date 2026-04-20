import React from 'react';
import type { Metadata } from 'next';
import { ColorSchemeScript } from '@mantine/core';
import './globals.css';
import { AppThemeProvider } from '@/shared/providers/AppThemeProvider';
import { ApolloProvider } from '@/core/graphql/ApolloProvider';

export const metadata: Metadata = {
  title: 'DENTIQ - Dental Practice Management',
  description: 'Comprehensive dental practice management platform',
  icons: {
    icon: '/images/dentiq-logo.png',
    shortcut: '/images/dentiq-logo.png',
    apple: '/images/dentiq-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Mantine ColorSchemeScript for SSR support */}
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body
        className="font-sans antialiased transition-colors"
        style={{
          backgroundColor: 'var(--bg-page, #ffffff)',
          color: 'var(--text-primary, #000000)',
        }}
        suppressHydrationWarning
      >
        {/* Retry once on chunk load timeout (e.g. slow localhost or stale .next cache) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var key = 'nextjs-chunk-fail-count';
                window.addEventListener('error', function(e) {
                  if (e.message && e.message.indexOf('Loading chunk') !== -1 && e.message.indexOf('failed') !== -1) {
                    var count = parseInt(sessionStorage.getItem(key) || '0', 10);
                    if (count < 1) {
                      sessionStorage.setItem(key, '1');
                      window.location.reload();
                    }
                  }
                });
                window.addEventListener('load', function() { sessionStorage.removeItem(key); });
              })();
            `,
          }}
        />
        <ApolloProvider>
          <AppThemeProvider>{children}</AppThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
