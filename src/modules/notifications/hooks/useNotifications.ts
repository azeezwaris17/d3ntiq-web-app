'use client';

/**
 * useNotifications
 *
 * Polls the backend every 30 seconds to keep the notification bell fresh.
 * Exposes helpers to mark individual or all notifications as read.
 *
 * Usage:
 *   const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
 */

import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_MY_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
} from '../infrastructure/notifications.graphql';

// ── Types ─────────────────────────────────────────────────────────────────────

export type NotificationType =
  | 'APPOINTMENT_BOOKED'
  | 'APPOINTMENT_ACCEPTED'
  | 'APPOINTMENT_DECLINED'
  | 'APPOINTMENT_CANCELLED';

export interface AppNotification {
  id:            string;
  type:          NotificationType;
  title:         string;
  message:       string;
  appointmentId: string | null;
  isRead:        boolean;
  createdAt:     string;
}

interface NotificationSummary {
  unreadCount:   number;
  notifications: AppNotification[];
}

// ── Hook ──────────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 30_000; // 30 seconds

export function useNotifications() {
  const { data, loading, refetch } = useQuery<{ myNotifications: NotificationSummary }>(
    GET_MY_NOTIFICATIONS,
    {
      fetchPolicy:  'cache-and-network',
      pollInterval: POLL_INTERVAL_MS,
    },
  );

  const [markReadMutation]    = useMutation(MARK_NOTIFICATION_READ);
  const [markAllReadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_READ);

  const notifications = data?.myNotifications.notifications ?? [];
  const unreadCount   = data?.myNotifications.unreadCount   ?? 0;

  /** Mark a single notification as read and refresh the list. */
  async function markRead(notificationId: string): Promise<void> {
    await markReadMutation({ variables: { notificationId } });
    void refetch();
  }

  /** Mark all notifications as read and refresh the list. */
  async function markAllRead(): Promise<void> {
    await markAllReadMutation();
    void refetch();
  }

  return { notifications, unreadCount, loading, markRead, markAllRead, refetch };
}
