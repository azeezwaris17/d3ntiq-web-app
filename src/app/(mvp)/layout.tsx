import React from 'react';
import { PublicPageLayout } from '@/shared/components/layout';

export default function MvpLayout({ children }: { children: React.ReactNode }) {
  return <PublicPageLayout>{children}</PublicPageLayout>;
}
