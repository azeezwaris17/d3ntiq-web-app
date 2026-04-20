'use client';
import React from 'react';

import { TextInput, TextInputProps } from '@mantine/core';
import { UseFormRegisterReturn } from 'react-hook-form';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme';

export interface InputProps extends Omit<TextInputProps, 'variant'> {
  /**
   * Input variant (error is automatically applied if error prop is provided)
   */
  variant?: 'default' | 'error' | 'success';
  /**
   * React Hook Form register return (for form integration)
   */
  register?: UseFormRegisterReturn;
}

export const Input: React.FC<InputProps> = ({
  variant: _variant = 'default',
  register,
  error,
  ...props
}) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  // Determine variant based on error prop or explicit variant
  const variant = error ? 'error' : _variant;

  return (
    <TextInput
      {...props}
      {...register}
      error={error}
      styles={(theme) => ({
        root: {
          fontFamily: theme.fontFamily,
        },
        input: {
          minHeight: '44px', // Touch-friendly minimum height (WCAG 2.1 AA)
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSizes.md,
          transition: 'all 0.2s ease',

          // Use theme colors for consistent styling
          backgroundColor: colors.neutral[0],
          borderColor:
            variant === 'error'
              ? colors.error[4]
              : variant === 'success'
                ? colors.success[4]
                : colors.neutral[3],

          '&:focus': {
            borderColor:
              variant === 'error'
                ? colors.error[4]
                : variant === 'success'
                  ? colors.success[4]
                  : colors.primary[5],
            boxShadow:
              variant === 'error'
                ? `0 0 0 2px ${colors.error[1]}`
                : variant === 'success'
                  ? `0 0 0 2px ${colors.success[1]}`
                  : `0 0 0 2px ${colors.primary[1]}`,
          },

          '&:focus-visible': {
            outline: `2px solid ${colors.primary[5]}`,
            outlineOffset: '2px',
          },

          '&::placeholder': {
            color: colors.neutral[5],
          },
        },
        label: {
          fontFamily: theme.fontFamily,
          fontWeight: 500,
          color: colors.neutral[7],
          marginBottom: theme.spacing.xs,
        },
        error: {
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSizes.sm,
          color: colors.error[4],
          marginTop: theme.spacing.xs,
        },
      })}
      radius="md"
    />
  );
};
