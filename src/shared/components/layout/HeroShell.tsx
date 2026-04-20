import React from 'react';
import { Box } from '@mantine/core';

export interface HeroShellProps {
  /**
   * Background image URL for the hero.
   */
  backgroundImage?: string;
  /**
   * Optional extra classes for the inner content container.
   */
  innerClassName?: string;
  children: React.ReactNode;
}

/**
 * HeroShell
 *
 * Shared wrapper for hero sections:
 * - Handles edge-to-edge background image
 * - Applies a token-backed dark overlay using Tailwind + design-token colors
 * - Provides a relative, constrained content layer on top
 */
export const HeroShell: React.FC<HeroShellProps> = ({
  backgroundImage,
  innerClassName = '',
  children,
}) => {
  return (
    <Box className="relative w-full overflow-hidden">
      {backgroundImage && (
        <Box
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
      )}

      {/* Overlay using Tailwind colors backed by design tokens (primary.dark-200) */}
      <Box className="absolute inset-0 bg-gradient-to-b from-primary-dark-200/60 via-primary-dark-200/70 to-primary-dark-200/90" />

      <Box className={`relative z-10 ${innerClassName}`}>{children}</Box>
    </Box>
  );
};
