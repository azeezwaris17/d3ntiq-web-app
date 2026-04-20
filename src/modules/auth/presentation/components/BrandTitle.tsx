/**
 * BrandTitle
 * Renders "D3NT IQ Portal" with the IQ superscript in teal.
 * Clicking it navigates to /home.
 */
'use client';

import { Group, Text } from '@mantine/core';
import Link from 'next/link';

interface BrandTitleProps {
  prefix?: string;
  suffix?: string;
}

export function BrandTitle({ prefix, suffix = 'Portal' }: BrandTitleProps) {
  return (
    <Link href="/home" style={{ textDecoration: 'none' }}>
      <Group gap={0} justify="center" wrap="nowrap">
        {prefix && (
          <Text fw={700} fz={26} c="#1e293b" style={{ letterSpacing: '-0.5px' }}>
            {prefix}&nbsp;
          </Text>
        )}
        <Text fw={700} fz={26} c="#1e293b" style={{ letterSpacing: '-0.5px' }}>
          D3NT
        </Text>
        <Text fw={700} fz={14} c="#38bdf8" style={{ verticalAlign: 'super', lineHeight: 1, marginTop: -8 }}>
          IQ
        </Text>
        <Text fw={700} fz={26} c="#1e293b" style={{ letterSpacing: '-0.5px' }}>
          &nbsp;{suffix}
        </Text>
      </Group>
    </Link>
  );
}
