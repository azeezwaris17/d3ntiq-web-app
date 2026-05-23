'use client';

/**
 * MobileBottomNav
 *
 * Fixed bottom navigation bar shown on mobile viewports (< 768px).
 * Replaces the hamburger drawer with a native-app-style tab bar.
 *
 * Structure:
 *   [Tab] [Tab] [Tab?] [More]
 *
 *   - `bottomNavItems` — the primary tabs shown directly in the bar.
 *     "More" is always appended as the final slot.
 *
 *   - `allNavItems` — every nav item for this role, shown inside the
 *     More bottom sheet. Includes the items already in the bar so the
 *     user can reach everything from one place.
 *
 * Behaviour:
 *   - Active tab is highlighted in teal with a top border accent.
 *   - Tapping any tab navigates immediately and closes the More sheet.
 *   - Tapping More toggles the bottom sheet.
 *   - Tapping the backdrop closes the sheet.
 */

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Text, Stack } from '@mantine/core';
import { MoreHorizontal, X } from 'lucide-react';
import type { NavItem } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVE_COLOR = '#2d7d9a';
const IDLE_COLOR   = '#94a3b8';
const BAR_HEIGHT   = 64; // px

// ─── Props ────────────────────────────────────────────────────────────────────

interface MobileBottomNavProps {
  /** Items shown as tabs in the bar (no "More" — that is added automatically) */
  bottomNavItems: NavItem[];
  /** All nav items for this role — shown in the More sheet */
  allNavItems: NavItem[];
}

// ─── Tab button ───────────────────────────────────────────────────────────────

function TabButton({
  icon, label, isActive, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      style={{
        flex:           1,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            3,
        padding:        '8px 4px',
        background:     'none',
        border:         'none',
        borderTop:      `2px solid ${isActive ? ACTIVE_COLOR : 'transparent'}`,
        cursor:         'pointer',
        transition:     'border-color 0.15s',
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <Text
        size="xs"
        fw={isActive ? 700 : 400}
        style={{ color: isActive ? ACTIVE_COLOR : IDLE_COLOR, lineHeight: 1 }}
      >
        {label}
      </Text>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MobileBottomNav({ bottomNavItems, allNavItems }: MobileBottomNavProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  /**
   * Active state — exact match for root dashboard paths, startsWith for the rest.
   * Mirrors the logic in DashboardNavItem so only one item is ever highlighted.
   */
  function isActive(href: string): boolean {
    const isRoot = href === '/patient' || href === '/provider';
    return isRoot
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  function navigate(href: string) {
    setMoreOpen(false);
    router.push(href);
  }

  // The "More" button is active when the sheet is open OR when the current
  // page belongs to an item that isn't shown directly in the bar.
  const moreIsActive =
    moreOpen ||
    (!bottomNavItems.some((i) => isActive(i.href)) &&
      allNavItems.some((i) => isActive(i.href)));

  return (
    <>
      {/* ── Fixed bottom bar ── */}
      <Box
        component="nav"
        aria-label="Mobile navigation"
        style={{
          position:        'fixed',
          bottom:          0,
          left:            0,
          right:           0,
          height:          BAR_HEIGHT,
          backgroundColor: '#ffffff',
          borderTop:       '1px solid #e2e8f0',
          display:         'flex',
          alignItems:      'stretch',
          zIndex:          150,
          paddingBottom:   'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Primary tabs */}
        {bottomNavItems.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item.href);
          return (
            <TabButton
              key={item.key}
              icon={
                <Icon
                  size={20}
                  color={active ? ACTIVE_COLOR : IDLE_COLOR}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              }
              label={item.label}
              isActive={active}
              onClick={() => navigate(item.href)}
            />
          );
        })}

        {/* More tab — always present */}
        <TabButton
          icon={
            moreOpen
              ? <X size={20} color={ACTIVE_COLOR} strokeWidth={2} />
              : <MoreHorizontal size={20} color={moreIsActive ? ACTIVE_COLOR : IDLE_COLOR} strokeWidth={1.8} />
          }
          label="More"
          isActive={moreIsActive}
          onClick={() => setMoreOpen((o) => !o)}
        />
      </Box>

      {/* ── More bottom sheet ── */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <Box
            onClick={() => setMoreOpen(false)}
            style={{
              position:        'fixed',
              inset:           0,
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              zIndex:          148,
            }}
          />

          {/* Sheet */}
          <Box
            style={{
              position:        'fixed',
              bottom:          BAR_HEIGHT,
              left:            0,
              right:           0,
              backgroundColor: '#ffffff',
              borderTop:       '1px solid #e2e8f0',
              borderRadius:    '16px 16px 0 0',
              paddingTop:      16,
              paddingBottom:   8,
              zIndex:          149,
              boxShadow:       '0 -4px 24px rgba(0,0,0,0.10)',
            }}
          >
            {/* Drag handle */}
            <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <Box style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#e2e8f0' }} />
            </Box>

            {/* All nav items — including the ones already in the bar */}
            <Stack gap={0}>
              {allNavItems.map((item) => {
                const Icon   = item.icon;
                const active = isActive(item.href);
                return (
                  <Box
                    key={item.key}
                    component="button"
                    onClick={() => navigate(item.href)}
                    style={{
                      display:     'flex',
                      alignItems:  'center',
                      gap:         14,
                      padding:     '14px 24px',
                      background:  active ? '#f0f9ff' : 'none',
                      border:      'none',
                      borderLeft:  `3px solid ${active ? ACTIVE_COLOR : 'transparent'}`,
                      cursor:      'pointer',
                      width:       '100%',
                      textAlign:   'left',
                    }}
                  >
                    <Icon
                      size={20}
                      color={active ? ACTIVE_COLOR : '#64748b'}
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                    <Text size="sm" fw={active ? 600 : 400} c={active ? ACTIVE_COLOR : '#1e293b'}>
                      {item.label}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </>
      )}

      {/* Spacer — pushes page content above the fixed bar */}
      <Box style={{ height: BAR_HEIGHT }} />
    </>
  );
}
