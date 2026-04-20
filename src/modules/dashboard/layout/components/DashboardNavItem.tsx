'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Group, Text } from '@mantine/core';
import type { NavItem } from '../types';

interface DashboardNavItemProps {
  item: NavItem;
  /** Called after navigation — used on mobile to close the sidebar drawer */
  onNavigate?: () => void;
}

const ACTIVE_BG = '#2d7d9a';
const ACTIVE_COLOR = '#ffffff';
const IDLE_COLOR = '#4a5568';

export function DashboardNavItem({ item, onNavigate }: DashboardNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const Icon = item.icon;

  return (
    <Link href={item.href} style={{ textDecoration: 'none' }} onClick={onNavigate}>
      <Group
        gap={10}
        px={14}
        py={10}
        style={{
          borderRadius: 8,
          backgroundColor: isActive ? ACTIVE_BG : 'transparent',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
        }}
      >
        <Icon size={18} strokeWidth={1.8} color={isActive ? ACTIVE_COLOR : IDLE_COLOR} />
        <Text
          size="sm"
          fw={isActive ? 600 : 400}
          c={isActive ? ACTIVE_COLOR : IDLE_COLOR}
          style={{ letterSpacing: '-0.01em' }}
        >
          {item.label}
        </Text>
      </Group>
    </Link>
  );
}
