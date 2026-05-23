'use client';

/**
 * DashboardTopbar
 *
 * Desktop: [Greeting] ——————————— [Search] [Bell] [User menu]
 * Mobile:  [Burger] [Greeting] ——— [Bell] [Avatar]
 *
 * Search is hidden on mobile to save space.
 * User name/label is hidden on mobile — only avatar shown.
 *
 * Search architecture:
 *   The search input here is intentionally "dumb" — it reads and writes the
 *   shared query via `useDashboardSearch()` but knows nothing about what is
 *   being searched. Each page is responsible for reading the query from the
 *   same context and filtering its own data.
 *
 *   To add search to a new page, you only need to touch that page — not this
 *   file. See DashboardSearchContext.tsx for full documentation.
 */

import { useState } from 'react';
import { Box, Group, Text, TextInput, Avatar, Menu, Modal, Button, Stack } from '@mantine/core';
import { Search, ChevronDown, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import { useLogout } from '@/modules/auth/infrastructure/useAuth';
import { NotificationDropdown } from '@/modules/notifications/components/NotificationDropdown';
import { useDashboardSearch } from '../context/DashboardSearchContext';
import type { DashboardRole, DashboardUser } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface DashboardTopbarProps {
  role: DashboardRole;
  user: DashboardUser;
  /** True when running on a mobile viewport */
  isMobile: boolean;
  /** Called when the burger is tapped — opens the sidebar drawer */
  onMenuOpen: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardTopbar({ role, user, isMobile }: DashboardTopbarProps) {
  const router       = useRouter();
  const apolloClient = useApolloClient();
  const { logout }   = useLogout();
  const firstName    = user.fullName.split(' ')[0] ?? user.fullName;

  // Controls the logout confirmation modal
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut,      setLoggingOut]      = useState(false);

  /**
   * Read the shared search query and its setter from context.
   *
   * `query`    — the current string (controlled input value)
   * `setQuery` — updates the context; every subscribed page re-filters
   *
   * This component does NOT decide what "search" means — it just provides
   * the input. The active page reads `query` from the same context and
   * filters its own data independently.
   */
  const { query, setQuery } = useDashboardSearch();

  /**
   * Performs the actual logout after the user confirms in the modal.
   * Clears the Apollo cache so no stale data leaks to the next session.
   */
  async function handleLogoutConfirm() {
    setLoggingOut(true);
    try {
      await logout();
      await apolloClient.clearStore();
      router.push(`/login?role=${role}`);
    } finally {
      setLoggingOut(false);
      setLogoutModalOpen(false);
    }
  }

  return (
    <>
    <Box
      component="header"
      px={{ base: 16, md: 24 }}
      style={{
        height:          60,
        backgroundColor: '#ffffff',
        borderBottom:    '1px solid #edf2f7',
        display:         'flex',
        alignItems:      'center',
        position:        'sticky',
        top:             0,
        zIndex:          100,
        flexShrink:      0,
      }}
    >
      <Group justify="space-between" align="center" style={{ width: '100%' }} wrap="nowrap">

        {/* ── Left: greeting only (burger removed — bottom nav handles mobile navigation) ── */}
        <Group gap={12} align="center" wrap="nowrap" style={{ minWidth: 0 }}>
          <Text
            fw={700}
            fz={{ base: 15, md: 18 }}
            c="#1e293b"
            style={{ letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {getGreeting()}, {firstName}!
          </Text>
        </Group>

        {/* ── Right: search (desktop only) + bell + user menu ── */}
        <Group gap={isMobile ? 10 : 16} align="center" wrap="nowrap" style={{ flexShrink: 0 }}>

          {/* ── Search input — desktop only ──────────────────────────────────
           *
           * Writing to `setQuery` updates the shared DashboardSearchContext.
           * The currently active page reads `query` from the same context and
           * re-filters its list on every keystroke — no prop drilling needed.
           *
           * The placeholder is intentionally generic because this input is
           * shared across all pages. Each page decides what fields to search.
           * ─────────────────────────────────────────────────────────────── */}
          {!isMobile && (
            <TextInput
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              leftSection={<Search size={15} color="#94a3b8" strokeWidth={1.8} />}
              size="sm"
              radius="md"
              style={{ width: 220 }}
              styles={{
                input: {
                  backgroundColor: '#f8fafc',
                  border:          '1px solid #e2e8f0',
                  fontSize:        13,
                },
              }}
            />
          )}

          {/* Notification bell — live dropdown with unread count */}
          <NotificationDropdown />

          {/* User dropdown */}
          <Menu shadow="md" width={180} position="bottom-end">
            <Menu.Target>
              <Group gap={8} style={{ cursor: 'pointer' }} align="center" wrap="nowrap">
                <Avatar src={user.avatarUrl} alt={user.fullName} size={34} radius="xl" color="teal">
                  {user.fullName.charAt(0).toUpperCase()}
                </Avatar>
                {!isMobile && (
                  <>
                    <Box>
                      <Text size="xs" fw={600} c="#1e293b" lh={1.3}>{user.fullName}</Text>
                      <Text size="xs" c="dimmed"           lh={1.3}>{user.idLabel}</Text>
                    </Box>
                    <ChevronDown size={14} color="#94a3b8" strokeWidth={2} />
                  </>
                )}
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<User size={14} strokeWidth={1.8} />}
                component={Link}
                href={`/${role}/profile`}
              >
                My Profile
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<LogOut size={14} strokeWidth={1.8} />}
                color="red"
                onClick={() => setLogoutModalOpen(true)}
              >
                Sign out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Box>

    {/* ── Logout confirmation modal ── */}
    <Modal
      opened={logoutModalOpen}
      onClose={() => setLogoutModalOpen(false)}
      title="Sign out"
      centered
      size="sm"
    >
      <Stack gap="md">
        <Text size="sm">Are you sure you want to sign out?</Text>
        <Group justify="flex-end" gap="sm">
          <Button
            variant="outline"
            onClick={() => setLogoutModalOpen(false)}
            disabled={loggingOut}
          >
            Cancel
          </Button>
          <Button
            color="red"
            leftSection={<LogOut size={14} />}
            loading={loggingOut}
            onClick={() => void handleLogoutConfirm()}
          >
            Sign out
          </Button>
        </Group>
      </Stack>
    </Modal>
  </>
  );
}
