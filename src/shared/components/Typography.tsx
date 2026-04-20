import React from 'react';
import { Text, type TextProps } from '@mantine/core';

export const SectionTitle: React.FC<TextProps> = (props) => (
  <Text fw={700} fz="xl" {...props} />
);

