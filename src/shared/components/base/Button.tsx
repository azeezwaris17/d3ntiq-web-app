'use client';
import React from 'react';

import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';

export interface ButtonProps extends Omit<MantineButtonProps, 'variant' | 'color'> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  fullWidth = false,
  disabled,
  ...props
}) => {
  // Map our custom variants to Mantine variants and colors
  const getMantineProps = (variant: string) => {
    switch (variant) {
      case 'primary':
        return { variant: 'filled' as const, color: 'primary' };
      case 'secondary':
        return { variant: 'filled' as const, color: 'secondary' };
      case 'success':
        return { variant: 'filled' as const, color: 'success' };
      case 'error':
        return { variant: 'filled' as const, color: 'error' };
      case 'warning':
        return { variant: 'filled' as const, color: 'warning' };
      case 'outline':
        return { variant: 'outline' as const, color: 'primary' };
      case 'ghost':
        return { variant: 'subtle' as const, color: 'neutral' };
      default:
        return { variant: 'filled' as const, color: 'primary' };
    }
  };

  const mantineProps = getMantineProps(variant);

  return (
    <MantineButton
      {...mantineProps}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      loading={isLoading}
      loaderProps={{
        size: 'sm',
        type: 'dots',
      }}
      styles={(theme) => ({
        root: {
          fontFamily: theme.fontFamily,
          fontWeight: 500,
          transition: 'all 0.2s ease',
          minHeight: size === 'xs' ? '32px' : size === 'sm' ? '36px' : '44px',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        inner: {
          fontFamily: theme.fontFamily,
        },
      })}
      {...props}
    >
      {children}
    </MantineButton>
  );
};

/**
 * DentiqButton
 *
 * Design-system facing alias for the primary button primitive.
 * Prefer this export when building new UI so it's clear that this
 * is the canonical button in the system.
 */
export const DentiqButton = Button;
