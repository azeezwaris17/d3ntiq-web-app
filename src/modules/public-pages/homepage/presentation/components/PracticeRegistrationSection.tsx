'use client';
import React from 'react';

import { useMemo, useState } from 'react';
import { ActionIcon, Box, Button, Container, Select, Text, TextInput, Notification } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ArrowRight, BriefcaseMedical, Building2, Mail, MapPin, Phone, User, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { HomepageContent } from '@/modules/public-pages/homepage/domain/entities/HomepageContent';

export interface PracticeRegistrationSectionProps {
  practiceRegistration: HomepageContent['practiceRegistration'];
}

export const PracticeRegistrationSection: React.FC<PracticeRegistrationSectionProps> = ({
  practiceRegistration,
}) => {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const specialties = useMemo(
    () => practiceRegistration.specialties.map((s) => ({ value: s, label: s })),
    [practiceRegistration.specialties]
  );

  const form = useForm({
    initialValues: { fullName: '', workEmail: '', phone: '', specialty: specialties[0]?.value ?? '', practiceName: '', address: '' },
    validate: {
      fullName: (v) => (v.trim().length >= 2 ? null : 'Please enter your full name'),
      workEmail: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Please enter a valid email address'),
      phone: (v) => (v.trim().length >= 7 ? null : 'Please enter a valid phone number'),
      specialty: (v) => (v ? null : 'Please select a specialty'),
      practiceName: (v) => (v.trim().length >= 2 ? null : 'Please enter your practice name'),
      address: (v) => (v.trim().length >= 5 ? null : 'Please enter your practice address'),
    },
  });

  /**
   * Validate, show "Processing..." for a brief moment so the user gets
   * visual feedback, then navigate to the provider register page with
   * all fields pre-filled as query params.
   */
  const handleContinue = form.onSubmit(async (values) => {
    setSubmitError('');
    setProcessing(true);
    try {
      // Small artificial delay so the user sees the loading state
      await new Promise((resolve) => setTimeout(resolve, 600));
      const params = new URLSearchParams({
        role: 'provider',
        fullName: values.fullName,
        email: values.workEmail,
        phone: values.phone,
        specialty: values.specialty,
        practiceName: values.practiceName,
        address: values.address,
      });
      router.push(`/register?${params.toString()}`);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setProcessing(false);
    }
  });

  return (
    <Box component="section" id="practice-registration" bg="#f8fafc" py={{ base: 40, md: 56 }}>
      <Container size="xl" px={{ base: 'md', md: 'xl' }}>
        <Box
          pos="relative"
          mx="auto"
          px={{ base: 20, md: 28 }}
          py={{ base: 24, md: 32 }}
          bg="#ffffff"
          style={{
            maxWidth: 1000,
            borderRadius: 28,
            border: '1px solid #edf2f7',
            boxShadow: '0 20px 40px -30px rgba(15,23,42,0.4)',
          }}
        >
          <ActionIcon
            size={40} radius="xl" variant="filled" pos="absolute" top={-12} right={-8}
            styles={{ root: { background: 'linear-gradient(180deg, #3a91ab 0%, #2f7f98 100%)', boxShadow: '0 8px 16px -10px rgba(31,117,143,0.6)' } }}
            aria-label="Register practice"
          >
            <BriefcaseMedical size={16} color="#ffffff" strokeWidth={2} />
          </ActionIcon>

          <Box mx="auto" style={{ maxWidth: 800 }}>
            <Text fz={{ base: 18, md: 32 }} fw={700} lh={1.2} style={{ letterSpacing: '-0.01em', color: '#111827' }}>
              {practiceRegistration.title}
            </Text>
            <Text mt={8} fz={{ base: 14, md: 18 }} fw={400} lh={1.6} c="#64748b">
              {practiceRegistration.description}
            </Text>

            {/* Error notification */}
            {submitError && (
              <Notification icon={<XCircle size={18} />} color="red" title="Something went wrong" mt={16} onClose={() => setSubmitError('')}>
                {submitError}
              </Notification>
            )}

            <form style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={handleContinue}>
              <Box>
                <Text mb={4} fz={{ base: 12, md: 14 }} fw={600} c="#1f2937">Full Name</Text>
                <TextInput size="sm" radius="md" placeholder="Enter your full name"
                  leftSection={<User size={15} color="#94a3b8" strokeWidth={1.8} />}
                  disabled={processing} {...form.getInputProps('fullName')} />
              </Box>

              <Box>
                <Text mb={4} fz={{ base: 12, md: 14 }} fw={600} c="#1f2937">{practiceRegistration.workEmailLabel}</Text>
                <TextInput size="sm" radius="md" placeholder={practiceRegistration.workEmailPlaceholder}
                  leftSection={<Mail size={15} color="#94a3b8" strokeWidth={1.8} />}
                  disabled={processing} {...form.getInputProps('workEmail')} />
              </Box>

              <Box>
                <Text mb={4} fz={{ base: 12, md: 14 }} fw={600} c="#1f2937">{practiceRegistration.phoneLabel}</Text>
                <TextInput size="sm" radius="md" placeholder={practiceRegistration.phonePlaceholder}
                  leftSection={<Phone size={15} color="#94a3b8" strokeWidth={1.8} />}
                  disabled={processing} {...form.getInputProps('phone')} />
              </Box>

              <Box>
                <Text mb={4} fz={{ base: 12, md: 14 }} fw={600} c="#1f2937">Practice Name</Text>
                <TextInput size="sm" radius="md" placeholder="Enter your practice name"
                  leftSection={<Building2 size={15} color="#94a3b8" strokeWidth={1.8} />}
                  disabled={processing} {...form.getInputProps('practiceName')} />
              </Box>

              <Box>
                <Text mb={4} fz={{ base: 12, md: 14 }} fw={600} c="#1f2937">Practice Address</Text>
                <TextInput size="sm" radius="md" placeholder="Enter your practice address"
                  leftSection={<MapPin size={15} color="#94a3b8" strokeWidth={1.8} />}
                  disabled={processing} {...form.getInputProps('address')} />
              </Box>

              <Box>
                <Text mb={4} fz={{ base: 12, md: 14 }} fw={600} c="#1f2937">{practiceRegistration.specialtyLabel}</Text>
                <Select size="sm" radius="md" data={specialties} placeholder={practiceRegistration.specialtyPlaceholder}
                  disabled={processing} {...form.getInputProps('specialty')} />
              </Box>
              <Button
                type="submit"
                fullWidth
                radius="md"
                rightSection={!processing ? <ArrowRight size={16} strokeWidth={2} /> : undefined}
                mt={8}
                fz={{ base: 12, md: 14 }}
                fw={600}
                loading={processing}
                loaderProps={{ type: 'oval' }}
                styles={{ root: { background: 'linear-gradient(180deg, #4b97b1 0%, #3d8aa4 100%)', boxShadow: '0 8px 16px -12px rgba(50, 123, 147, 0.8)' } }}
              >
                {processing ? 'Processing...' : 'Continue'}
              </Button>
            </form>

            <Text mx="auto" mt={24} fz={{ base: 9, md: 10 }} fw={500} lh={1.5} ta="center"
              style={{ maxWidth: 480, color: '#94a3b8' }}>
              {practiceRegistration.legalText}
            </Text>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
