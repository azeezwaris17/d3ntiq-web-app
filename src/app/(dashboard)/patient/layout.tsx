'use client';
import React from 'react';

import { DashboardLayout } from '@/modules/dashboard/layout/components/DashboardLayout';
import { AuthGuard } from '@/modules/dashboard/layout/components/AuthGuard';

export default function PatientDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="patient">
      <DashboardLayout role="patient" notificationCount={3}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
