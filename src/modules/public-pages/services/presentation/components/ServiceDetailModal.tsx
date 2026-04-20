'use client';
import React from 'react';

import { useMemo } from 'react';
import { Modal, Card, Stack, Title, Text, Button, List, ThemeIcon, Group } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type { Service } from '../../domain/entities/Service';
import { servicesData } from '../../infrastructure/data/servicesData';
import { typography } from '@/shared/theme/typography';

export interface ServiceDetailModalProps {
  slug: string | null;
  opened: boolean;
  onClose: () => void;
}

const getStaticService = (slug: string | null): Service | null => {
  if (!slug) return null;
  const all: Service[] = [
    ...servicesData.patientServices.services,
    ...servicesData.providerServices.services,
  ];
  return all.find((s) => s.slug === slug) ?? null;
};

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ slug, opened, onClose }) => {
  const service = useMemo(() => getStaticService(slug), [slug]);

  return (
    <Modal opened={opened} onClose={onClose} centered size="lg" radius="xl" withCloseButton={false} overlayProps={{ opacity: 0.55, blur: 2 }}>
      <Card withBorder radius="xl" padding="xl" shadow="sm">
        {service ? (
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Title order={2} c="neutral.9" style={{ fontSize: typography.scale.heading.h2, fontWeight: typography.weights.extrabold }}>
                {service.title}
              </Title>
              <Text c="secondary.5" style={{ fontSize: typography.scale.body.sm, fontWeight: typography.weights.bold }}>D3NTIQ</Text>
            </Group>
            <Text c="neutral.6" style={{ fontSize: typography.scale.body.xl, fontWeight: typography.weights.semibold }}>{service.description}</Text>
            <Text c="neutral.6" style={{ fontSize: typography.scale.body.lg, lineHeight: typography.lineHeights.loose }}>{service.detailedDescription || service.description}</Text>
            {service.features && service.features.length > 0 && (
              <Stack gap="sm">
                <Title order={3} c="neutral.9" style={{ fontSize: typography.scale.heading.h4, fontWeight: typography.weights.bold }}>Key Features</Title>
                <List spacing="xs" icon={<ThemeIcon color="secondary" size={20} radius="xl" variant="light"><IconCheck size={12} /></ThemeIcon>}>
                  {service.features.map((f, i) => (
                    <List.Item key={i}><Text c="neutral.6" style={{ fontSize: typography.scale.body.md }}>{f}</Text></List.Item>
                  ))}
                </List>
              </Stack>
            )}
            <div className="pt-4 flex justify-center">
              <Button size="md" radius="md" color="primary" px={48} onClick={onClose}>Okay</Button>
            </div>
          </Stack>
        ) : (
          <Stack gap="md" align="center">
            <Title order={3} c="neutral.9">Service details coming soon</Title>
            <Text ta="center" c="neutral.6">We are preparing comprehensive information for this service.</Text>
            <Button size="sm" radius="md" onClick={onClose}>Close</Button>
          </Stack>
        )}
      </Card>
    </Modal>
  );
};
