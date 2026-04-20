import React from 'react';
import { Alert, Button, Group, Text } from '@mantine/core';

export interface GraphQLErrorAlertProps {
  error: Error;
  onRetry?: () => void;
}

export const GraphQLErrorAlert: React.FC<GraphQLErrorAlertProps> = ({ error, onRetry }) => {
  return (
    <Alert color="red" title="Something went wrong">
      <Text size="sm" mb="sm">
        {error.message}
      </Text>
      {onRetry && (
        <Group justify="flex-end">
          <Button size="xs" variant="light" onClick={onRetry}>
            Try again
          </Button>
        </Group>
      )}
    </Alert>
  );
};

