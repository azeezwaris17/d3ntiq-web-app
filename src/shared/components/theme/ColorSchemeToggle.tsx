'use client';
import React from 'react';

import { useEffect } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useMantineColorScheme, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { Sun, Moon } from 'lucide-react';

export interface ColorSchemeToggleProps {
  /** Size of the toggle button */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Show tooltip */
  showTooltip?: boolean;
  /** Custom className */
  className?: string;
  /** Variant of the button */
  variant?: 'default' | 'subtle' | 'filled' | 'outline';
}

/**
 * Reusable color scheme toggle component using Mantine theme
 * Can be used in header, settings, or anywhere in the app
 */
export const ColorSchemeToggle: React.FC<ColorSchemeToggleProps> = ({
  size = 'md',
  showTooltip = true,
  className = '',
  variant = 'default',
}) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const theme = useMantineTheme();

  // Sync Mantine color scheme with system preferences
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (computedColorScheme === 'dark') {
      html.classList.add('dark');
      body.style.backgroundColor = theme.colors.neutral[9];
      body.style.color = theme.colors.neutral[0];
    } else {
      html.classList.remove('dark');
      body.style.backgroundColor = theme.colors.neutral[0];
      body.style.color = theme.colors.neutral[8];
    }

    // Force a reflow to ensure all CSS variables are recalculated
    void html.offsetHeight;
  }, [computedColorScheme, theme]);

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light');
  };

  const isDark = computedColorScheme === 'dark';

  const button = (
    <ActionIcon
      onClick={toggleColorScheme}
      size={size}
      variant={variant}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={className}
      styles={(theme) => ({
        root: {
          color: isDark ? theme.colors.warning[4] : theme.colors.secondary[5],
          transition: 'all 0.2s ease',

          '&:hover': {
            backgroundColor: theme.colors.neutral[1],
            transform: 'scale(1.05)',
          },
        },
      })}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </ActionIcon>
  );

  if (showTooltip) {
    return (
      <Tooltip
        label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        position="bottom"
        withArrow
      >
        {button}
      </Tooltip>
    );
  }

  return button;
};
