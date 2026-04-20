/**
 * AuthHeader
 * Top bar shown on every auth page — logo centred, white background.
 */
'use client';

import { Box, Group } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

export function AuthHeader() {
  return (
    <Box
      component="header"
      bg="white"
      style={{ borderBottom: '1px solid #e5e7eb' }}
      py={12}
      px={24}
    >
      <Group justify="center">
        <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <Image
            src="/images/dentiq-logo.png"
            alt="D3NTIQ Logo"
            width={40}
            height={40}
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </Group>
    </Box>
  );
}
