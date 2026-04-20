'use client';
import React from 'react';

import { Loader, LoaderProps } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme';

export interface LoadingSpinnerProps extends Omit<LoaderProps, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  color,
  ...props
}) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  return <Loader size={size} color={color || colors.primary[5]} className={className} {...props} />;
};
