import React from 'react';
import { Group, Text } from '@mantine/core';

export interface DetailItemProps {
  label: string;
  value: string;
}

export const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <Group gap="xs" align="flex-start">
    <Text fw={600} size="sm">
      {label}
    </Text>
    <Text size="sm" c="dimmed">
      {value}
    </Text>
  </Group>
);

