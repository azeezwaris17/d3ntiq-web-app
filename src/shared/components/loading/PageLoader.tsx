'use client';
import React from 'react';

import { Box, Stack, Text, Loader } from '@mantine/core';
import Image from 'next/image';

interface PageLoaderProps {
  message?: string;
  subMessage?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Preparing your workspace...',
  subMessage = 'A moment while we sync your profile',
}) => {
  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '80px 60px',
          maxWidth: '600px',
          width: '90%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Stack gap={40} align="center">
          {/* Logo and Brand */}
          <Stack gap={16} align="center">
          <Image
                src="/images/dentiq-logo.png"
                alt="D3NTIQ Logo"
                width={140}
                height={140}
                style={{ 
                  objectFit: 'contain', 
                  width: 'auto'
                 }}
              />
          </Stack>

          {/* Loader */}
          <Loader size="lg" color="#5B9AAD" type="dots" />

          {/* Loading Messages */}
          <Stack gap={8} align="center">
            <Text
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#2D3748',
                textAlign: 'center',
              }}
            >
              {message}
            </Text>
            <Text
              size="sm"
              style={{
                color: '#A0AEC0',
                textAlign: 'center',
              }}
            >
              {subMessage}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};
