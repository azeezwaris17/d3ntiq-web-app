'use client';

/**
 * DashboardTopbar
 *
 * Desktop: [Greeting] ——————————— [Search] [Bell] [User menu]
 * Mobile:  [Burger] [Greeting] ——— [Bell] [Avatar]
 *
 * Search is hidden on mobile to save space.
 * User name/label is hidden on mobile — only avatar shown.
 */

import { useState } from 'react';
import { Box, Group, Text, TextInput, Avatar, ActionIcon, Badge, Menu, Burger } from '@mantine/core';
import { Search, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import { useLogout } from '@/modules/auth/infrastructure/useAuth';
import type { DashboardRole, DashboardUser } from '../types';

interface DashboardTopbarProps {
  role: DashboardRole;
  user: DashboardUser;
  notificationCount?: number;
  /** True when running on a mobile viewport */
  isMobile: boolean;
  /** Called when the burger is tapped — opens the sidebar drawer */
  onMenuOpen: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardTopbar({
  role,
  user,
  notificationCount = 0,
  isMobile,
  onMenuOpen,
}: DashboardTopbarProps) {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const { logout } = useLogout();
  const [search, setSearch] = useState('');
  const firstName = user.fullName.split(' ')[0] ?? user.fullName;

  async function handleLogout() {
    await logout();
    await apolloClient.clearStore();
    router.push(`/login?role=${role}`);
  }

  return (
    <Box
      component="header"
      px={{ base: 16, md: 24 }}
      style={{
        height: 60,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #edf2f7',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      <Group justify="space-between" align="center" style={{ width: '100%' }} wrap="nowrap">

        {/* Left: burger (mobile) + greeting */}
        <Group gap={12} align="center" wrap="nowrap" style={{ minWidth: 0 }}>
          {/* Burger — mobile only */}
          {isMobile && (
            <Burger
              opened={false}
              onClick={onMenuOpen}
              size="sm"
              color="#64748b"
              aria-label="Open navigation"
            />
          )}

          {/* Greeting */}
          <Text
            fw={700}
            fz={{ base: 15, md: 18 }}
            c="#1e293b"
            style={{ letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {getGreeting()}, {firstName}!
          </Text>
        </Group>

        {/* Right: search (desktop only) + bell + user */}
        <Group gap={isMobile ? 10 : 16} align="center" wrap="nowrap" style={{ flexShrink: 0 }}>

          {/* Search — hidden on mobile */}
          {!isMobile && (
            <TextInput
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              leftSection={<Search size={15} color="#94a3b8" strokeWidth={1.8} />}
              size="sm"
              radius="md"
              style={{ width: 220 }}
              styles={{
                input: {
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  fontSize: 13,
                },
              }}
            />
          )}

          {/* Notification bell */}
          <Box style={{ position: 'relative' }}>
            <ActionIcon variant="subtle" color="gray" size="lg" radius="xl">
              <Bell size={18} strokeWidth={1.8} color="#64748b" />
            </ActionIcon>
            {notificationCount > 0 && (
              <Badge
                size="xs"
                color="red"
                variant="filled"
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px',
                  fontSize: 10,
                  pointerEvents: 'none',
                }}
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </Box>

          {/* User dropdown */}
          <Menu shadow="md" width={180} position="bottom-end">
            <Menu.Target>
              <Group gap={8} style={{ cursor: 'pointer' }} align="center" wrap="nowrap">
                <Avatar
                  src={user.avatarUrl}
                  alt={user.fullName}
                  size={34}
                  radius="xl"
                  color="teal"
                >
                  {user.fullName.charAt(0).toUpperCase()}
                </Avatar>

                {/* Name + label — hidden on mobile */}
                {!isMobile && (
                  <>
                    <Box>
                      <Text size="xs" fw={600} c="#1e293b" lh={1.3}>{user.fullName}</Text>
                      <Text size="xs" c="dimmed" lh={1.3}>{user.idLabel}</Text>
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
                onClick={handleLogout}
              >
                Sign out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Box>
  );
}
