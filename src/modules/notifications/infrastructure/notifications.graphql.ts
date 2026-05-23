/**
 * GraphQL queries and mutations for the in-app notification system.
 */

import { gql } from '@apollo/client';

/** Fetch all notifications + unread count for the current user. */
export const GET_MY_NOTIFICATIONS = gql`
  query MyNotifications {
    myNotifications {
      unreadCount
      notifications {
        id
        type
        title
        message
        appointmentId
        isRead
        createdAt
      }
    }
  }
`;

/** Mark a single notification as read. */
export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($notificationId: String!) {
    markNotificationRead(notificationId: $notificationId)
  }
`;

/** Mark all notifications as read in one call. */
export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;
