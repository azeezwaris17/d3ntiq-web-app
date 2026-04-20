'use client';
import React from 'react';

import { type CSSProperties } from 'react';
import { Title, Text, TitleProps, TextProps } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme/mantine-theme';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'lead';
  color?: 'neutral' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'neutral',
  weight = 400,
  align = 'left',
  className = '',
  children,
  ...props
}) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  // Map our color variants to theme colors
  const getColor = (colorVariant: string) => {
    switch (colorVariant) {
      case 'primary':
        return colors.primary[5];
      case 'secondary':
        return colors.secondary[5];
      case 'success':
        return colors.success[4];
      case 'error':
        return colors.error[4];
      case 'warning':
        return colors.warning[4];
      case 'info':
        return colors.info[4];
      case 'neutral':
      default:
        return colors.neutral[7];
    }
  };

  const commonStyles: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontWeight: weight,
    textAlign: align,
    color: getColor(color),
  };

  // Render headings using Mantine Title component
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant)) {
    const order = parseInt(variant.replace('h', '')) as TitleProps['order'];

    return (
      <Title order={order} className={className} style={commonStyles} {...(props as TitleProps)}>
        {children}
      </Title>
    );
  }

  // Render text using Mantine Text component
  const getTextSize = (variant: string) => {
    switch (variant) {
      case 'lead':
        return 'lg';
      case 'caption':
        return 'sm';
      case 'body':
      default:
        return 'md';
    }
  };

  return (
    <Text
      size={getTextSize(variant)}
      className={className}
      style={commonStyles}
      {...(props as TextProps)}
    >
      {children}
    </Text>
  );
};
