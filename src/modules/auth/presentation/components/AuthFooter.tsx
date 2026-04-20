/**
 * AuthFooter
 * Bottom bar shown on every auth page.
 */
'use client';

import { Box, Group, Text, Anchor } from '@mantine/core';

export function AuthFooter() {
  return (
    <Box
      component="footer"
      bg="white"
      py={16}
      px={24}
      style={{ borderTop: '1px solid #e5e7eb' }}
    >
      <Group justify="space-between" align="center" wrap="wrap" gap="xs">
        {/* Left — copyright */}
        <Box>
          <Text size="xs" c="dimmed">© 2025 DENTIQ. All rights reserved.</Text>
          <Text size="xs" c="dimmed">HIPAA Compliant • Secure Patient Portal</Text>
        </Box>

        {/* Right — links */}
        <Group gap="md">
          <Anchor href="/privacy" size="xs" c="dimmed">Privacy Policy</Anchor>
          <Anchor href="/terms" size="xs" c="dimmed">Terms of Service</Anchor>
          <Anchor href="/security" size="xs" c="dimmed">Security</Anchor>
        </Group>
      </Group>
    </Box>
  );
}
