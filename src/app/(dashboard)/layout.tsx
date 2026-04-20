import React from 'react';
/**
 * Dashboard route group layout.
 * This is a plain pass-through — each role sub-layout
 * (patient/layout.tsx, provider/layout.tsx) handles its own DashboardLayout.
 */
export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
