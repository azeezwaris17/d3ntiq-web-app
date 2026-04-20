'use client';

/**
 * D3ntiqVerifiedBadge
 *
 * Displayed on provider cards that have registered and been verified
 * on the D3NTIQ platform. Communicates trust and platform membership.
 */

import { Group, Text, Tooltip } from '@mantine/core';
import { ShieldCheck } from 'lucide-react';

interface D3ntiqVerifiedBadgeProps {
  /** Controls badge size — 'sm' for compact cards, 'md' for full cards */
  size?: 'sm' | 'md';
}

export function D3ntiqVerifiedBadge({ size = 'sm' }: D3ntiqVerifiedBadgeProps) {
  const iconSize = size === 'md' ? 14 : 12;
  const fontSize = size === 'md' ? '11px' : '10px';

  return (
    <Tooltip
      label="This provider is registered and verified on the D3NTIQ platform"
      position="top"
      withArrow
      multiline
      w={220}
    >
      <Group
        gap={4}
        px={6}
        py={2}
        style={{
          backgroundColor: '#e0f2fe',
          border: '1px solid #7dd3fc',
          borderRadius: 20,
          display: 'inline-flex',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        <ShieldCheck size={iconSize} color="#0284c7" strokeWidth={2.5} />
        <Text
          fw={700}
          style={{
            fontSize,
            color: '#0284c7',
            letterSpacing: '0.02em',
          }}
        >
          D3NTIQ Verified
        </Text>
      </Group>
    </Tooltip>
  );
}
