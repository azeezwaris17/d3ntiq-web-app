'use client';
import React from 'react';

import { Card as MantineCard, CardProps } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme';

export interface CardPropsExtended extends Omit<CardProps, 'variant'> {
  /**
   * Card variant
   */
  variant?: 'default' | 'elevated' | 'interactive';
  /**
   * Click handler for interactive cards
   */
  onClick?: () => void;
}

export const Card: React.FC<CardPropsExtended> = ({
  variant = 'default',
  children,
  onClick,
  ...props
}) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  // Determine shadow and border based on variant
  const shadow = variant === 'elevated' ? 'lg' : 'sm';
  const withBorder = variant !== 'elevated';

  return (
    <MantineCard
      {...props}
      onClick={onClick}
      withBorder={withBorder}
      padding="lg"
      radius="lg"
      shadow={shadow}
      styles={(theme) => ({
        root: {
          backgroundColor: colors.neutral[0],
          borderColor: colors.neutral[3],
          transition: 'all 0.2s ease',
          cursor: onClick || variant === 'interactive' ? 'pointer' : 'default',

          '&:hover': {
            backgroundColor:
              variant === 'interactive' || onClick ? colors.neutral[1] : colors.neutral[0],
            boxShadow: variant === 'elevated' ? theme.shadows.xl : theme.shadows.md,
            transform: onClick || variant === 'interactive' ? 'translateY(-2px)' : 'none',
          },
        },
      })}
    >
      {children}
    </MantineCard>
  );
};

/**
 * DentiqCard
 *
 * Design-system facing alias for the primary card primitive.
 * Prefer this export for new UI to make the intent explicit.
 */
export const DentiqCard = Card;

// Card sub-components
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  return (
    <div
      className={`mb-4 border-b pb-4 transition-colors ${className}`}
      style={{
        borderColor: colors.neutral[2],
        marginBottom: theme.spacing.md,
        paddingBottom: theme.spacing.md,
      }}
    >
      {children}
    </div>
  );
};

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  return (
    <div
      className={`mt-4 border-t pt-4 transition-colors ${className}`}
      style={{
        borderColor: colors.neutral[2],
        marginTop: theme.spacing.md,
        paddingTop: theme.spacing.md,
      }}
    >
      {children}
    </div>
  );
};
