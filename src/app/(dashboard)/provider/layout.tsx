'use client';
import React from 'react';

import { DashboardLayout } from '@/modules/dashboard/layout/components/DashboardLayout';
import { AuthGuard } from '@/modules/dashboard/layout/components/AuthGuard';

export default function ProviderDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="provider">
      <DashboardLayout role="provider" notificationCount={5}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
