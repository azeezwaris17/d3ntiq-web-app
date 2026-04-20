import React from 'react';
/**
 * State Handler Component
 *
 * A reusable component for handling loading, error, empty, and data states
 * with consistent UX across the application.
 */

import { Container, Stack, Text, Button, Center, Loader, Alert, Box } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconInbox } from '@tabler/icons-react';

export interface StateHandlerProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  minHeight?: string | number;
}

export const StateHandler: React.FC<StateHandlerProps> = ({
  isLoading,
  error,
  isEmpty,
  emptyMessage = 'No data available',
  emptyIcon,
  onRetry,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
  minHeight = 200,
}) => {
  // Loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    return (
      <Center style={{ minHeight }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed" size="sm">
            Loading...
          </Text>
        </Stack>
      </Center>
    );
  }

  // Error state
  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }
    return (
      <Container py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="light"
          radius="md"
        >
          <Stack gap="md">
            <Text size="sm">{error}</Text>
            {onRetry && (
              <Button
                leftSection={<IconRefresh size={16} />}
                onClick={onRetry}
                variant="light"
                size="sm"
              >
                Try Again
              </Button>
            )}
          </Stack>
        </Alert>
      </Container>
    );
  }

  // Empty state
  if (isEmpty) {
    if (emptyComponent) {
      return <>{emptyComponent}</>;
    }
    return (
      <Center style={{ minHeight }}>
        <Stack align="center" gap="md">
          {emptyIcon || <IconInbox size={48} stroke={1.5} style={{ opacity: 0.3 }} />}
          <Text c="dimmed" size="sm" fw={500}>
            {emptyMessage}
          </Text>
        </Stack>
      </Center>
    );
  }

  // Data state
  return <>{children}</>;
};

/**
 * Compact State Handler
 * For inline use in tables, lists, etc.
 */
export interface CompactStateHandlerProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const CompactStateHandler: React.FC<CompactStateHandlerProps> = ({
  isLoading,
  error,
  isEmpty,
  emptyMessage = 'No data available',
  onRetry,
  children,
}) => {
  if (isLoading) {
    return (
      <Box py="xl">
        <Center>
          <Loader size="sm" />
        </Center>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="light"
          radius="md"
        >
          <Stack gap="xs">
            <Text size="xs">{error}</Text>
            {onRetry && (
              <Button
                leftSection={<IconRefresh size={14} />}
                onClick={onRetry}
                variant="light"
                size="xs"
              >
                Retry
              </Button>
            )}
          </Stack>
        </Alert>
      </Box>
    );
  }

  if (isEmpty) {
    return (
      <Box py="xl">
        <Center>
          <Text c="dimmed" size="sm">
            {emptyMessage}
          </Text>
        </Center>
      </Box>
    );
  }

  return <>{children}</>;
};
