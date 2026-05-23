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
 *   [Topbar sticky] + [Page content] + [Bottom nav bar fixed]
 *   The hamburger drawer is replaced by a native-app-style bottom tab bar.
 *   The sidebar is hidden entirely on mobile.
 *
 * Search architecture:
 *   <DashboardSearchProvider> wraps the entire layout so any page inside the
 *   dashboard can call `useDashboardSearch()` to read the current query.
 *   The topbar writes to the context; pages read from it and filter their own
 *   data. Adding search to a new page requires zero changes here.
 */

import React from 'react';
import { Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopbar } from './DashboardTopbar';
import { MobileBottomNav } from './MobileBottomNav';
import { useDashboardUser } from '../hooks/useDashboardUser';
import { DashboardSearchProvider } from '../context/DashboardSearchContext';
import { getNavItems, getBottomNavItems } from '../nav-config';
import type { DashboardRole } from '../types';

interface DashboardLayoutProps {
  role: DashboardRole;
  children: React.ReactNode;
}

export function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const user           = useDashboardUser(role);
  const isMobile       = useMediaQuery('(max-width: 768px)') ?? false;
  const allNavItems    = getNavItems(role);
  const bottomNavItems = getBottomNavItems(role);

  return (
    <DashboardSearchProvider>
      <Box style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>

        {/* Sidebar — desktop only. Hidden on mobile (bottom nav takes over). */}
        {!isMobile && (
          <DashboardSidebar
            role={role}
            user={user}
            isMobile={false}
            isOpen={true}
            onClose={() => {}}
          />
        )}

        {/* Main area: topbar + page content */}
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <DashboardTopbar
            role={role}
            user={user}
            isMobile={isMobile}
            // onMenuOpen is a no-op on mobile — the bottom nav replaces the drawer
            onMenuOpen={() => {}}
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

      {/* Bottom navigation — mobile only */}
      {isMobile && (
        <MobileBottomNav
          bottomNavItems={bottomNavItems}
          allNavItems={allNavItems}
        />
      )}
    </DashboardSearchProvider>
  );
}
