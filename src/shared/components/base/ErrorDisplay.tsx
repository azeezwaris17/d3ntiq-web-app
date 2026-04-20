'use client';
import React from 'react';

import { Alert, Button, Stack, Title, Text } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { themeColors } from '@/shared/theme';

export interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'alert' | 'page';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Error',
  message,
  onRetry,
  className = '',
  variant = 'alert',
}) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  if (variant === 'alert') {
    return (
      <Alert
        icon={<AlertTriangle size={16} />}
        title={title}
        color="error"
        className={className}
        styles={(theme) => ({
          root: {
            backgroundColor: colors.error[0],
            borderColor: colors.error[2],
          },
          title: {
            color: colors.error[7],
            fontFamily: theme.fontFamily,
          },
          body: {
            color: colors.error[6],
            fontFamily: theme.fontFamily,
          },
        })}
      >
        <Stack gap="sm">
          <Text size="sm">{message}</Text>
          {onRetry && (
            <Button
              variant="outline"
              color="error"
              size="sm"
              leftSection={<RefreshCw size={14} />}
              onClick={onRetry}
              styles={(theme) => ({
                root: {
                  fontFamily: theme.fontFamily,
                },
              })}
            >
              Retry
            </Button>
          )}
        </Stack>
      </Alert>
    );
  }

  return (
    <Stack
      align="center"
      justify="center"
      gap="md"
      className={`p-8 text-center ${className}`}
      styles={(theme) => ({
        root: {
          fontFamily: theme.fontFamily,
        },
      })}
    >
      <AlertTriangle size={48} color={colors.error[4]} />
      <Title
        order={2}
        styles={(theme) => ({
          root: {
            color: colors.error[6],
            fontFamily: theme.fontFamily,
          },
        })}
      >
        {title}
      </Title>
      <Text
        size="md"
        styles={(theme) => ({
          root: {
            color: colors.neutral[6],
            fontFamily: theme.fontFamily,
          },
        })}
      >
        {message}
      </Text>
      {onRetry && (
        <Button
          variant="filled"
          color="error"
          leftSection={<RefreshCw size={16} />}
          onClick={onRetry}
          styles={(theme) => ({
            root: {
              fontFamily: theme.fontFamily,
            },
          })}
        >
          Retry
        </Button>
      )}
    </Stack>
  );
};
