'use client';

import { Title, Text, Stack, Accordion, Box } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme';
import { Section, Container, ComponentGroup } from '@/shared/components/layout';

// ── Data ──────────────────────────────────────────────────────────────────────

const faqBadge = 'FAQs';
const faqTitle = 'Frequently Asked Questions';
const faqs = [
  {
    question: 'How does D3NTIQ help patients?',
    answer: 'D3NTIQ helps patients stay informed with clear treatment plans, secure communication, and convenient access to dental records and post-visit instructions.',
  },
  {
    question: 'Can I find providers who accept my insurance?',
    answer: 'Yes. The provider locator helps you find nearby providers and filter based on your preferences, including insurance support where available.',
  },
  {
    question: 'Is my health information secure?',
    answer: 'We use secure, privacy-focused practices to protect user information. Access is controlled and data is handled with care across the platform.',
  },
  {
    question: 'Do providers get tools for workflows and reporting?',
    answer: 'Yes. Providers can use tools for scheduling, documentation, billing workflows, and analytics to improve efficiency and patient experience.',
  },
  {
    question: 'How can I request a demo?',
    answer: 'You can request a demo from the contact page or by using the Schedule Demo form on the homepage.',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function FAQSection() {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  return (
    <Section background="light">
      <Container size="xl" className="py-16">
        <ComponentGroup direction="col" spacing="lg" align="center" className="w-full">

          {/* Heading */}
          <Stack gap="sm" align="center" className="w-full max-w-2xl mx-auto">
            <Text
              tt="uppercase"
              fw={600}
              style={{
                padding: '0 12px',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                backgroundColor: '#f9fcfd',
                fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
                letterSpacing: '0.3px',
                color: '#548CA4',
              }}
            >
              {faqBadge}
            </Text>
            <Title
              order={2}
              ta="center"
              fw={700}
              lh={1.15}
              c={colors.primary[6]}
              style={{ fontSize: 'clamp(1rem, 2.5vw, 2rem)', letterSpacing: '-0.01em', fontFamily: theme.fontFamily }}
            >
              {faqTitle}
            </Title>
          </Stack>

          {/* Accordion */}
          <Accordion
            className="w-full"
            variant="separated"
            radius="md"
            defaultValue={faqs[faqs.length - 1]?.question}
            styles={(theme) => ({
              root: { gap: theme.spacing.md },
              item: {
                border: `1px solid ${colors.neutral[3]}`,
                borderRadius: theme.radius.md,
                backgroundColor: colors.neutral[0],
                transition: 'all 0.2s ease',
                boxShadow: theme.shadows.sm,
              },
              control: { fontFamily: theme.fontFamily, '&:hover': { backgroundColor: colors.neutral[1] } },
              chevron: { color: colors.primary[5], transition: 'transform 0.2s ease' },
              panel: { padding: 0 },
              content: { padding: 0 },
            })}
          >
            {faqs.map((faq, index) => (
              <Accordion.Item key={index} value={faq.question}>
                <Accordion.Control px={{ base: 'md', md: 'lg' }} py={{ base: 'sm', md: 'md' }}>
                  <Text fz={{ base: 14, md: 16 }} fw={600} lh={1.4} c={colors.neutral[8]} ff={theme.fontFamily}>
                    {faq.question}
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Box px={{ base: 'md', md: 'lg' }} pb={{ base: 'sm', md: 'md' }}>
                    <Text fz={{ base: 13, md: 14 }} fw={400} lh={1.6} c={colors.neutral[6]} ff={theme.fontFamily}>
                      {faq.answer}
                    </Text>
                  </Box>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>

        </ComponentGroup>
      </Container>
    </Section>
  );
}
