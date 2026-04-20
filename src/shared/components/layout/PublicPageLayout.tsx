'use client';
import React from 'react';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useMantineTheme } from '@mantine/core';
import { PUBLIC_ROUTES } from '@/shared/constants/routes';
import { themeColors } from '@/shared/theme';

const PublicHeader = dynamic(
  () => import('../navigation/PublicPageHeader').then((mod) => ({ default: mod.PublicHeader })),
  { ssr: false }
);

const PublicFooter = dynamic(
  () => import('../navigation/PublicPageFooter').then((mod) => ({ default: mod.PublicFooter })),
  { ssr: false }
);

const FAQSection = dynamic(
  () => import('../sections/FAQSection').then((mod) => ({ default: mod.FAQSection })),
  { ssr: false }
);

export interface PublicPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({ children, className = '' }) => {
  const pathname = usePathname();
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  // Check if current page is a service detail page (e.g., /services/patient-portal)
  const isServiceDetailPage =
    pathname?.startsWith('/services/') && pathname !== PUBLIC_ROUTES.SERVICES;

  // Check if current page is an oral-iq page
  const isOralIQPage = pathname?.startsWith('/oral-iq');

  // Show FAQ section on most pages, but not on service detail pages or oral-iq pages
  const showFAQSection = !isServiceDetailPage && !isOralIQPage;

  return (
    <div
      className={`flex min-h-screen flex-col transition-colors ${className}`}
      style={{
        backgroundColor: colors.neutral[1],
        fontFamily: theme.fontFamily,
        width: '100%',
        overflowX: 'hidden', // Prevent horizontal scroll
      }}
      suppressHydrationWarning
    >
      <PublicHeader />
      <main
        className="flex-1"
        role="main"
        aria-label="Public page content"
        style={{
          width: '100%',
          margin: 0,
          padding: 0,
          display: 'block',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </main>
      {showFAQSection && <FAQSection />}
      <PublicFooter />
    </div>
  );
};
