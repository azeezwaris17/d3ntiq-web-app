/**
 * AuthCard
 * White rounded card that sits on top of the background image.
 * Used by login and register pages.
 */
'use client';
import React from 'react';

import { Box } from '@mantine/core';

interface AuthCardProps {
  children: React.ReactNode;
  /** Extra width for wider cards (e.g. provider forgot-password split layout) */
  wide?: boolean;
}

export function AuthCard({ children, wide = false }: AuthCardProps) {
  return (
    <Box
      bg="white"
      p={{ base: 28, md: 40 }}
      style={{
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        width: '100%',
        maxWidth: wide ? 760 : 480,
      }}
    >
      {children}
    </Box>
  );
}
