/**
 * NewsDetailModal Component
 *
 * Renders a news detail card inside a modal.
 */
'use client';
import React from 'react';

import { Box, Modal, Card, Stack, Title, Text, Button, Group, Badge } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme';

export interface NewsDetailModalProps {
  slug: string | null;
  opened: boolean;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ opened, onClose }) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="md"
      radius="lg"
      withCloseButton={false}
      overlayProps={{ opacity: 0.5, blur: 2 }}
      padding={0}
    >
      <Card
        withBorder
        radius="lg"
        padding="lg"
        shadow="sm"
        styles={() => ({
          root: {
            backgroundColor: colors.neutral[0],
            borderColor: colors.neutral[2],
          },
        })}
      >
        <Stack gap="sm" align="center">
          <Group justify="space-between" align="flex-start" w="100%">
            <Title
              order={3}
              fw={700}
              style={{
                color: colors.neutral[9],
                fontFamily: theme.fontFamily,
                fontSize: '18px',
              }}
            >
              News Details
            </Title>
            <Text
              size="xs"
              fw={600}
              style={{
                color: colors.secondary[5],
                fontFamily: theme.fontFamily,
              }}
            >
              D3NTIQ
            </Text>
          </Group>

          <Badge variant="light" color="primary" size="sm">
            News
          </Badge>

          <Text
            size="sm"
            ta="center"
            style={{
              color: colors.neutral[6],
              fontFamily: theme.fontFamily,
              lineHeight: 1.5,
              maxWidth: '300px',
            }}
          >
            News details are coming soon. We are preparing more information and updates for our users.
          </Text>

          <Box mt="xs">
            <Button
              size="xs"
              radius="md"
              color="primary"
              px={40}
              onClick={onClose}
              styles={(theme) => ({
                root: {
                  fontFamily: theme.fontFamily,
                  fontSize: '13px',
                  height: '36px',
                  fontWeight: 500,
                },
              })}
            >
              Close
            </Button>
          </Box>
        </Stack>
      </Card>
    </Modal>
  );
};