'use client';

/**
 * DashboardLayout
 *
 * Shell for all dashboard pages (patient + provider).
 *
 * Desktop (≥ 768px):
 *   [Sidebar 200px fixed] | [Topbar sticky] + [Page content]
 *
 * Mobile (< 768px):
 *   [Topbar sticky with burger] + [Page content]
 *   Sidebar slides in as an overlay drawer when burger is tapped.
 */

import React, { useState } from 'react';
import { Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopbar } from './DashboardTopbar';
import { useDashboardUser } from '../hooks/useDashboardUser';
import type { DashboardRole } from '../types';

interface DashboardLayoutProps {
  role: DashboardRole;
  children: React.ReactNode;
  notificationCount?: number;
}

export function DashboardLayout({ role, children, notificationCount = 0 }: DashboardLayoutProps) {
  const user = useDashboardUser(role);
  const isMobile = useMediaQuery('(max-width: 768px)') ?? false;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>

      {/* Sidebar — sticky on desktop, overlay drawer on mobile */}
      <DashboardSidebar
        role={role}
        user={user}
        isMobile={isMobile}
        isOpen={isMobile ? sidebarOpen : true}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile backdrop — dims the page when drawer is open */}
      {isMobile && sidebarOpen && (
        <Box
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 199,
          }}
        />
      )}

      {/* Main area: topbar + page content */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <DashboardTopbar
          role={role}
          user={user}
          notificationCount={notificationCount}
          isMobile={isMobile}
          onMenuOpen={() => setSidebarOpen(true)}
        />
        <Box
          component="main"
          p={{ base: 16, sm: 20, md: 28 }}
          style={{ flex: 1, overflowY: 'auto' }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
