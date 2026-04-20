/**
 * GetInTouchSection Component
 *
 * This file contains the contact form section component for the contact page.
 * It displays only the contact form (right column) as requested, removing the left column entirely.
 *
 * How it works:
 * 1. Receives contact page content as props
 * 2. Manages form state using Mantine's useInputState hooks
 * 3. Handles form submission via SubmitContactFormUseCase
 * 4. Displays success/error notifications using Mantine notifications
 * 5. Includes address field as requested
 * 6. Uses responsive design with professional styling consistent with other sections
 *
 * The component includes:
 * - Contact form with validation (full name, email, phone, address, message)
 * - Form submission handling with user feedback
 * - Responsive design for mobile and desktop
 * - Professional styling consistent with the design system
 */
'use client';
import React from 'react';

import { Container, Stack, TextInput, Textarea, Button, Title, Box } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/core';
import * as MantineNotifications from '@mantine/notifications';
import type { ContactPageContent, ContactFormData } from '../../domain/entities/ContactFormData';
import { useMediaQuery } from '@mantine/hooks';
import { themeColors, typography } from '@/shared/theme';

export interface GetInTouchSectionProps {
  content: ContactPageContent;
}

const SectionBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  return (
    <Button
      variant="outline"
      size="sm"
      styles={(theme) => ({
        root: {
          borderColor: colors.neutral[3],
          color: colors.primary[5],
          fontSize: typography.scale.body.sm,
          fontWeight: typography.weights.semibold,
          letterSpacing: typography.letterSpacing.wider,
          textTransform: 'uppercase',
          fontFamily: theme.fontFamily,

          '&:hover': {
            backgroundColor: colors.primary[1],
          },
        },
      })}
    >
      {children}
    </Button>
  );
};

const responsivePlaceholder = (isMobile: boolean | undefined, mobile: string, desktop: string) =>
  isMobile ? mobile : desktop;

export const GetInTouchSection: React.FC<GetInTouchSectionProps> = ({ content }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  const [fullName, setFullName] = useInputState('');
  const [email, setEmail] = useInputState('');
  const [phone, setPhone] = useInputState('');
  const [address, setAddress] = useInputState('');
  const [message, setMessage] = useInputState('');

  const [submitting, setSubmitting] = React.useState(false);

  const submitContactFormUseCase = {
    execute: async (formData: ContactFormData) => {
      if (!formData.fullName || !formData.email || !formData.message) throw new Error('Required fields are missing');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) throw new Error('Invalid email address');
      // MVP: log submission — wire to backend endpoint when ready
      console.info('Contact form submitted', { email: formData.email });
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContactFormUseCase.execute({ fullName, email, phone, address, message });
      MantineNotifications.notifications.show({ title: content.form.notifications.successTitle, message: content.form.notifications.successMessage, color: 'green' });
      setFullName(''); setEmail(''); setPhone(''); setAddress(''); setMessage('');
    } catch (err) {
      MantineNotifications.notifications.show({ title: content.form.notifications.errorTitle, message: err instanceof Error ? err.message : content.form.notifications.errorMessage, color: 'red' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="py-16 transition-colors"
      style={{
        backgroundColor: colors.neutral[1],
        paddingTop: '4rem',
        paddingBottom: '4rem',
      }}
    >
      <Container size="xl">
        {/* Section Header */}
        <Stack gap="md" align="center" mb="xl">
          <SectionBadge>{content.section.badge}</SectionBadge>
          <Title
            order={2}
            ta="center"
            style={{
              fontSize: typography.scale.heading.h2,
              fontWeight: typography.weights.bold,
              lineHeight: typography.lineHeights.snug,
              letterSpacing: typography.letterSpacing.tight,
              color: colors.neutral[8],
              fontFamily: theme.fontFamily,
            }}
          >
            {content.section.title}
          </Title>
        </Stack>

        {/* Contact Form - Centered and Full Width */}
        <Box
          mx="auto"
          maw={800} // Maximum width for better readability
          style={{
            backgroundColor: colors.neutral[0],
            borderRadius: theme.radius.xl,
            border: `1px solid ${colors.neutral[2]}`,
            boxShadow: theme.shadows.lg,
            overflow: 'hidden',
          }}
        >
          <Box px={{ base: 28, md: 44 }} py={{ base: 34, md: 44 }}>
            <Title
              order={3}
              mb="xl"
              ta="center"
              style={{
                fontSize: 'clamp(1.75rem, 2.6vw, 2.5rem)', // 28px to 40px
                fontWeight: typography.weights.bold,
                lineHeight: typography.lineHeights.snug,
                color: colors.neutral[8],
                fontFamily: theme.fontFamily,
              }}
            >
              {content.form.title}
            </Title>

            <form onSubmit={handleSubmit}>
              <Stack gap="lg">
                <TextInput
                  name="fullName"
                  placeholder={responsivePlaceholder(
                    isMobile,
                    content.form.fields.mobileFullNamePlaceholder,
                    content.form.fields.fullNamePlaceholder
                  )}
                  value={fullName}
                  onChange={setFullName}
                  required
                  size="lg"
                  variant="default"
                  styles={(theme) => ({
                    input: {
                      height: '56px',
                      fontSize: typography.scale.body.lg,
                      backgroundColor: colors.neutral[0],
                      borderColor: colors.neutral[3],
                      color: colors.neutral[8],
                      fontFamily: theme.fontFamily,

                      '&::placeholder': {
                        color: colors.neutral[5],
                      },

                      '&:focus': {
                        borderColor: colors.primary[5],
                        boxShadow: `0 0 0 1px ${colors.primary[5]}`,
                      },
                    },
                  })}
                />

                <TextInput
                  name="email"
                  type="email"
                  placeholder={responsivePlaceholder(
                    isMobile,
                    content.form.fields.mobileEmailPlaceholder,
                    content.form.fields.emailPlaceholder
                  )}
                  value={email}
                  onChange={setEmail}
                  required
                  size="lg"
                  variant="default"
                  styles={(theme) => ({
                    input: {
                      height: '56px',
                      fontSize: typography.scale.body.lg,
                      backgroundColor: colors.neutral[0],
                      borderColor: colors.neutral[3],
                      color: colors.neutral[8],
                      fontFamily: theme.fontFamily,

                      '&::placeholder': {
                        color: colors.neutral[5],
                      },

                      '&:focus': {
                        borderColor: colors.primary[5],
                        boxShadow: `0 0 0 1px ${colors.primary[5]}`,
                      },
                    },
                  })}
                />

                <TextInput
                  name="phoneNumber"
                  type="tel"
                  placeholder={responsivePlaceholder(
                    isMobile,
                    content.form.fields.mobilePhonePlaceholder,
                    content.form.fields.phonePlaceholder
                  )}
                  value={phone}
                  onChange={setPhone}
                  size="lg"
                  variant="default"
                  styles={(theme) => ({
                    input: {
                      height: '56px',
                      fontSize: typography.scale.body.lg,
                      backgroundColor: colors.neutral[0],
                      borderColor: colors.neutral[3],
                      color: colors.neutral[8],
                      fontFamily: theme.fontFamily,

                      '&::placeholder': {
                        color: colors.neutral[5],
                      },

                      '&:focus': {
                        borderColor: colors.primary[5],
                        boxShadow: `0 0 0 1px ${colors.primary[5]}`,
                      },
                    },
                  })}
                />

                <TextInput
                  name="address"
                  placeholder={responsivePlaceholder(
                    isMobile,
                    content.form.fields.mobileAddressPlaceholder,
                    content.form.fields.addressPlaceholder
                  )}
                  value={address}
                  onChange={setAddress}
                  size="lg"
                  variant="default"
                  styles={(theme) => ({
                    input: {
                      height: '56px',
                      fontSize: typography.scale.body.lg,
                      backgroundColor: colors.neutral[0],
                      borderColor: colors.neutral[3],
                      color: colors.neutral[8],
                      fontFamily: theme.fontFamily,

                      '&::placeholder': {
                        color: colors.neutral[5],
                      },

                      '&:focus': {
                        borderColor: colors.primary[5],
                        boxShadow: `0 0 0 1px ${colors.primary[5]}`,
                      },
                    },
                  })}
                />

                <Textarea
                  name="message"
                  placeholder={responsivePlaceholder(
                    isMobile,
                    content.form.fields.mobileMessagePlaceholder,
                    content.form.fields.messagePlaceholder
                  )}
                  value={message}
                  onChange={setMessage}
                  required
                  autosize
                  minRows={isMobile ? 4 : 6}
                  size="lg"
                  variant="default"
                  styles={(theme) => ({
                    input: {
                      fontSize: typography.scale.body.lg,
                      backgroundColor: colors.neutral[0],
                      borderColor: colors.neutral[3],
                      color: colors.neutral[8],
                      fontFamily: theme.fontFamily,

                      '&::placeholder': {
                        color: colors.neutral[5],
                      },

                      '&:focus': {
                        borderColor: colors.primary[5],
                        boxShadow: `0 0 0 1px ${colors.primary[5]}`,
                      },
                    },
                  })}
                />

                <Box pt="md">
                  <Button
                    type="submit"
                    variant="filled"
                    size="lg"
                    radius="md"
                    loading={submitting}
                    fullWidth
                    className="h-14"
                    styles={(theme) => ({
                      root: {
                        backgroundColor: colors.primary[5],
                        color: colors.neutral[0],
                        fontSize: typography.scale.body.lg,
                        fontWeight: typography.weights.semibold,
                        fontFamily: theme.fontFamily,

                        '&:hover': {
                          backgroundColor: colors.primary[6],
                          transform: 'translateY(-1px)',
                        },
                      },
                    })}
                  >
                    {content.form.submitButtonText}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>
        </Box>
      </Container>
    </section>
  );
};
