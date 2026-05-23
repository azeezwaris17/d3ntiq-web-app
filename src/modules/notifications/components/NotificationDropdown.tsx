'use client';

/**
 * NotificationDropdown
 *
 * The bell icon in the dashboard topbar. Clicking it opens a dropdown
 * that lists all notifications for the current user.
 *
 * Features:
 *   - Unread count badge on the bell
 *   - Each notification shows an icon, title, message, and relative time
 *   - Clicking a notification marks it as read
 *   - "Mark all as read" button clears the badge in one click
 *   - Empty state when there are no notifications
 */

import { useRef, useState, useEffect } from 'react';
import { Box, Text, Stack, Group, ActionIcon, Badge, ScrollArea, Divider, Button } from '@mantine/core';
import { Bell, CheckCheck, Calendar, CheckCircle, XCircle, X } from 'lucide-react';
import { useNotifications, type AppNotification, type NotificationType } from '../hooks/useNotifications';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns a human-readable relative time string, e.g. "2 minutes ago". */
function relativeTime(isoString: string): string {
  const diffMs  = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1)  return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

/** Maps a notification type to a colour and icon. */
function notificationMeta(type: NotificationType): { color: string; icon: React.ReactNode } {
  switch (type) {
    case 'APPOINTMENT_BOOKED':
      return { color: '#3B82F6', icon: <Calendar size={16} color="#3B82F6" /> };
    case 'APPOINTMENT_ACCEPTED':
      return { color: '#10b981', icon: <CheckCircle size={16} color="#10b981" /> };
    case 'APPOINTMENT_DECLINED':
      return { color: '#ef4444', icon: <XCircle size={16} color="#ef4444" /> };
    case 'APPOINTMENT_CANCELLED':
      return { color: '#f59e0b', icon: <X size={16} color="#f59e0b" /> };
    default:
      return { color: '#64748b', icon: <Bell size={16} color="#64748b" /> };
  }
}

// ── Notification Item ─────────────────────────────────────────────────────────

function NotificationItem({
  notification,
  onRead,
}: {
  notification: AppNotification;
  onRead: (id: string) => void;
}) {
  const { color, icon } = notificationMeta(notification.type);

  return (
    <Box
      onClick={() => { if (!notification.isRead) onRead(notification.id); }}
      style={{
        padding:         '12px 16px',
        backgroundColor: notification.isRead ? '#fff' : '#f0f9ff',
        borderLeft:      `3px solid ${notification.isRead ? 'transparent' : color}`,
        cursor:          notification.isRead ? 'default' : 'pointer',
        transition:      'background-color 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = notification.isRead ? '#fff' : '#f0f9ff'; }}
    >
      <Group gap={10} align="flex-start" wrap="nowrap">
        {/* Type icon */}
        <Box style={{ flexShrink: 0, marginTop: 2 }}>{icon}</Box>

        {/* Content */}
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" align="center" wrap="nowrap">
            <Text size="xs" fw={notification.isRead ? 500 : 700} c="#1e293b" lineClamp={1}>
              {notification.title}
            </Text>
            <Text size="xs" c="dimmed" style={{ flexShrink: 0, marginLeft: 8 }}>
              {relativeTime(notification.createdAt)}
            </Text>
          </Group>
          <Text size="xs" c="dimmed" lineClamp={2}>
            {notification.message}
          </Text>
        </Stack>

        {/* Unread dot */}
        {!notification.isRead && (
          <Box
            style={{
              width:           8,
              height:          8,
              borderRadius:    '50%',
              backgroundColor: color,
              flexShrink:      0,
              marginTop:       6,
            }}
          />
        )}
      </Group>
    </Box>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function NotificationDropdown() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef     = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <Box style={{ position: 'relative' }} ref={dropdownRef}>

      {/* Bell button */}
      <ActionIcon
        variant="subtle"
        color="gray"
        size="lg"
        radius="xl"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell size={18} strokeWidth={1.8} color="#64748b" />
      </ActionIcon>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <Badge
          size="xs"
          color="red"
          variant="filled"
          style={{
            position:       'absolute',
            top:            2,
            right:          2,
            minWidth:       16,
            height:         16,
            padding:        '0 4px',
            fontSize:       10,
            pointerEvents:  'none',
          }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}

      {/* Dropdown panel */}
      {open && (
        <Box
          style={{
            position:        'absolute',
            top:             'calc(100% + 8px)',
            right:           0,
            zIndex:          300,
            width:           360,
            backgroundColor: '#fff',
            border:          '1px solid #e2e8f0',
            borderRadius:    10,
            boxShadow:       '0 8px 24px rgba(0,0,0,0.12)',
            overflow:        'hidden',
          }}
        >
          {/* Header */}
          <Group justify="space-between" align="center" px={16} py={12} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <Group gap={8} align="center">
              <Text fw={700} size="sm" c="#1e293b">Notifications</Text>
              {unreadCount > 0 && (
                <Badge size="xs" color="red" variant="filled" circle>
                  {unreadCount}
                </Badge>
              )}
            </Group>
            {unreadCount > 0 && (
              <Button
                variant="subtle"
                color="teal"
                size="xs"
                leftSection={<CheckCheck size={12} />}
                onClick={() => void markAllRead()}
              >
                Mark all read
              </Button>
            )}
          </Group>

          {/* Notification list */}
          {notifications.length === 0 ? (
            <Box py={40} ta="center">
              <Bell size={32} color="#cbd5e1" style={{ margin: '0 auto 12px', display: 'block' }} />
              <Text size="sm" c="dimmed" fw={500}>No notifications yet</Text>
              <Text size="xs" c="dimmed" mt={4}>
                You'll be notified about appointment updates here.
              </Text>
            </Box>
          ) : (
            <ScrollArea h={Math.min(notifications.length * 72, 360)}>
              <Stack gap={0}>
                {notifications.map((n, i) => (
                  <Box key={n.id}>
                    <NotificationItem
                      notification={n}
                      onRead={(id) => void markRead(id)}
                    />
                    {i < notifications.length - 1 && <Divider />}
                  </Box>
                ))}
              </Stack>
            </ScrollArea>
          )}
        </Box>
      )}
    </Box>
  );
}
