/**
 * AuthBackground
 * Full-width teal-tinted dental clinic background image.
 * Used by login and register pages.
 */
'use client';
import React from 'react';

import { Box, Flex } from '@mantine/core';

interface AuthBackgroundProps {
  children: React.ReactNode;
}

export function AuthBackground({ children }: AuthBackgroundProps) {
  return (
    <Box
      style={{
        flex: 1,
        backgroundImage: 'url(/images/auth-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#2d6e7e',
        position: 'relative',
        minHeight: 500,
      }}
    >
      {/* Teal overlay */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(30, 80, 95, 0.55)',
        }}
      />

      {/* Card centred on top of overlay */}
      <Flex
        align="center"
        justify="center"
        style={{ position: 'relative', zIndex: 1, minHeight: '100%', padding: '40px 20px' }}
      >
        {children}
      </Flex>
    </Box>
  );
}
