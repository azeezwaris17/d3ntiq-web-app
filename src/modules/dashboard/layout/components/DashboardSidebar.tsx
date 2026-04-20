'use client';

/**
 * DashboardSidebar
 *
 * Desktop: sticky 200px sidebar on the left.
 * Mobile:  overlay drawer that slides in from the left.
 *          Controlled by `isOpen` / `onClose` props from DashboardLayout.
 */

import Link from 'next/link';
import Image from 'next/image';
import { Box, Stack, Text, Group, Avatar, ActionIcon } from '@mantine/core';
import { LogOut, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardNavItem } from './DashboardNavItem';
import { getNavItems } from '../nav-config';
import { useApolloClient } from '@apollo/client/react';
import { useLogout } from '@/modules/auth/infrastructure/useAuth';
import type { DashboardRole, DashboardUser } from '../types';

interface DashboardSidebarProps {
  role: DashboardRole;
  user: DashboardUser;
  /** True when running on a mobile viewport */
  isMobile: boolean;
  /** Controls visibility — always true on desktop, toggled on mobile */
  isOpen: boolean;
  /** Called when the user closes the drawer (mobile only) */
  onClose: () => void;
}

export function DashboardSidebar({ role, user, isMobile, isOpen, onClose }: DashboardSidebarProps) {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const { logout } = useLogout();
  const navItems = getNavItems(role);

  async function handleLogout() {
    await logout();
    await apolloClient.clearStore();
    router.push(`/login?role=${role}`);
  }

  // On mobile, hide completely when closed
  if (isMobile && !isOpen) return null;

  return (
    <Box
      component="aside"
      style={{
        width: 200,
        minWidth: 200,
        height: '100vh',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #edf2f7',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        // Desktop: sticky in the normal flow
        // Mobile: fixed overlay drawer on top of content
        ...(isMobile
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 200,
              boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
            }
          : {
              position: 'sticky',
              top: 0,
            }),
      }}
    >
      {/* Logo row — includes close button on mobile */}
      <Box
        px={16}
        py={16}
        style={{
          borderBottom: '1px solid #edf2f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image
            src="/images/dentiq-logo.png"
            alt="D3NTIQ"
            width={120}
            height={28}
            style={{ objectFit: 'contain', width: 'auto' }}
          />
        </Link>

        {/* Close button — mobile only */}
        {isMobile && (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={18} strokeWidth={1.8} />
          </ActionIcon>
        )}
      </Box>

      {/* Navigation items */}
      <Stack gap={4} px={10} py={16} style={{ flex: 1, overflowY: 'auto' }}>
        {navItems.map((item) => (
          <DashboardNavItem
            key={item.key}
            item={item}
            onNavigate={isMobile ? onClose : undefined}
          />
        ))}
      </Stack>

      {/* User footer */}
      <Box px={14} py={14} style={{ borderTop: '1px solid #edf2f7' }}>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap={10} wrap="nowrap" style={{ overflow: 'hidden' }}>
            <Avatar src={user.avatarUrl} alt={user.fullName} size={36} radius="xl" color="teal">
              {user.fullName.charAt(0).toUpperCase()}
            </Avatar>
            <Box style={{ overflow: 'hidden' }}>
              <Text size="xs" fw={600} c="#1e293b" truncate>{user.fullName}</Text>
              <Text size="xs" c="dimmed" truncate>{user.idLabel}</Text>
            </Box>
          </Group>
          <ActionIcon
            variant="subtle"
            color="red"
            size="sm"
            onClick={handleLogout}
            title="Sign out"
          >
            <LogOut size={16} strokeWidth={1.8} />
          </ActionIcon>
        </Group>
      </Box>
    </Box>
  );
}
