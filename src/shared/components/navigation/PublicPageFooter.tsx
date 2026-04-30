'use client';
import React from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { Grid, Stack, Group, Text, Anchor, TextInput } from '@mantine/core';
import { Facebook, Twitter, Instagram, Linkedin, Apple } from 'lucide-react';
import { Section, Container } from '@/shared/components/layout';

const brand = { logoHref: '/home', logoSrc: '/images/dentiq-logo.png', logoAlt: 'DENTIQ Logo' };

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/dentiq', Icon: Facebook },
  { name: 'Twitter', href: 'https://twitter.com/dentiq', Icon: Twitter },
  { name: 'Instagram', href: 'https://instagram.com/dentiq', Icon: Instagram },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/dentiq', Icon: Linkedin },
];

const columns = [
  {
    heading: 'Popular Search',
    links: [
      { href: '/providers', label: 'Find Providers' },
      { href: '/oral-iq', label: '3D Assessment Tool' },
    ],
  },
  {
    heading: 'Quick Links',
    links: [
      { href: '/home', label: 'Home' },
      { href: '/providers', label: 'Locate Provider' },
      { href: '/oral-iq', label: 'Oral IQ' },
    ],
  },
  {
    heading: 'Discovery',
    links: [{ href: '/providers', label: 'Browse providers' }],
  },
];

const support = {
  customerCareLabel: 'Total Free Customer Care',
  customerCarePhone: '+(1) 123 456 789',
  liveSupportLabel: 'Live Support?',
  liveSupportEmail: 'info@dentiq.com',
};

const newsletter = {
  heading: 'Keep Yourself Up to Date',
  buttonText: 'Subscribe',
};

const bottomBar = {
  copyrightText: '© 2025 D3NTIQ – All rights reserved',
  links: [
    { href: '/docs/Privacy_Policy.pdf', label: 'Privacy', newTab: true },
    { href: '/docs/Terms_of_Service.pdf', label: 'Terms', newTab: true },
  ],
};

export interface PublicFooterProps {
  className?: string;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ className = '' }) => {
  return (
    <Section className={`bg-[#0E2027] text-white ${className}`}>

      {/* Top bar: Follow Us */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container size="xl" className="py-3">
          <Group justify="flex-end" align="center" gap={12}>
            <Text size="sm" fw={500} c="rgba(255,255,255,0.8)">Follow Us</Text>
            {socialLinks.map(({ name, href, Icon }) => (
              <Anchor
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                style={{ color: 'rgba(255,255,255,0.7)', display: 'flex' }}
              >
                <Icon size={16} />
              </Anchor>
            ))}
          </Group>
        </Container>
      </div>

      {/* Main body */}
      <Container size="xl" className="py-12">
        <Stack gap={32}>

          {/* Row 1: Logo (left) + Support info (right) */}
          <Grid gutter={{ base: 32, md: 40 }}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Link href={brand.logoHref} style={{ textDecoration: 'none', display: 'inline-flex' }}>
                <Image src={brand.logoSrc} alt={brand.logoAlt} width={120} height={40} style={{ objectFit: 'contain', height: 'auto' }} />
              </Link>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <div style={{ display: 'flex', gap: 48 }}>
                <div>
                  <Text size="xs" c="rgba(255,255,255,0.5)" mb={4}>{support.customerCareLabel}</Text>
                  <Anchor href={`tel:${support.customerCarePhone.replace(/\s/g, '')}`} size="sm" fw={600} c="white" style={{ textDecoration: 'none' }}>
                    {support.customerCarePhone}
                  </Anchor>
                </div>
                <div>
                  <Text size="xs" c="rgba(255,255,255,0.5)" mb={4}>{support.liveSupportLabel}</Text>
                  <Anchor href={`mailto:${support.liveSupportEmail}`} size="sm" fw={600} c="white" style={{ textDecoration: 'none' }}>
                    {support.liveSupportEmail}
                  </Anchor>
                </div>
              </div>
            </Grid.Col>
          </Grid>

          {/* Row 2: Link columns (left) + Newsletter & Apps (right) */}
          <Grid gutter={{ base: 32, md: 40 }}>

            {/* Col 1: Popular Search */}
            <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
              <Stack gap="sm">
                <Text size="sm" fw={600} c="white">{columns[0].heading}</Text>
                <Stack gap={8}>
                  {columns[0].links.map((link) => (
                    <Anchor key={link.href} component={Link} href={link.href} size="xs" c="rgba(255,255,255,0.6)" style={{ textDecoration: 'none' }}>
                      {link.label}
                    </Anchor>
                  ))}
                </Stack>
              </Stack>
            </Grid.Col>

            {/* Col 2: Quick Links */}
            <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
              <Stack gap="sm">
                <Text size="sm" fw={600} c="white">{columns[1].heading}</Text>
                <Stack gap={8}>
                  {columns[1].links.map((link) => (
                    <Anchor key={link.href} component={Link} href={link.href} size="xs" c="rgba(255,255,255,0.6)" style={{ textDecoration: 'none' }}>
                      {link.label}
                    </Anchor>
                  ))}
                </Stack>
              </Stack>
            </Grid.Col>

            {/* Col 3: Discovery */}
            <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
              <Stack gap="sm">
                <Text size="sm" fw={600} c="white">{columns[2].heading}</Text>
                <Stack gap={8}>
                  {columns[2].links.map((link) => (
                    <Anchor key={link.href} component={Link} href={link.href} size="xs" c="rgba(255,255,255,0.6)" style={{ textDecoration: 'none' }}>
                      {link.label}
                    </Anchor>
                  ))}
                </Stack>
              </Stack>
            </Grid.Col>

            {/* Col 4 (wide): Newsletter + Apps */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg">

                {/* Newsletter */}
                <Stack gap="xs">
                  <Text size="sm" fw={600} c="white">{newsletter.heading}</Text>
                  <TextInput
                    type="email"
                    placeholder="Your email"
                    rightSection={
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#0E2027', cursor: 'pointer', whiteSpace: 'nowrap', paddingRight: 8 }}>
                        {newsletter.buttonText}
                      </span>
                    }
                    rightSectionWidth={100}
                    styles={{
                      input: {
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: 10,
                        padding: '12px 18px',
                        fontSize: 13,
                        color: '#555',
                        height: 48,
                      },
                    }}
                  />
                </Stack>

                {/* Apps */}
                <Stack gap="xs">
                  <Text size="sm" fw={600} c="white">Apps</Text>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Anchor
                      href="#"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', textDecoration: 'none', minWidth: 0 }}
                    >
                      <Apple size={20} color="white" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>Download on the</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'white', whiteSpace: 'nowrap' }}>Apple Store</div>
                      </div>
                    </Anchor>
                    <Anchor
                      href="#"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', textDecoration: 'none', minWidth: 0 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
                        <path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l15 8.5c.5.28.5 1.22 0 1.5l-15 8.5c-.5.33-1.5.33-1.5-.5z"/>
                      </svg>
                      <div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>Get in on</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'white', whiteSpace: 'nowrap' }}>Google Play</div>
                      </div>
                    </Anchor>
                  </div>
                </Stack>

              </Stack>
            </Grid.Col>

          </Grid>

        </Stack>
      </Container>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Container size="xl" className="py-4">
          <Group justify="space-between" align="center" wrap="wrap" gap={8}>
            <Text size="xs" c="rgba(255,255,255,0.5)">{bottomBar.copyrightText}</Text>
            <Group gap={6}>
              {bottomBar.links.map((link, index) => (
                <React.Fragment key={link.href}>
                  <Anchor
                    href={link.href}
                    target={link.newTab ? '_blank' : undefined}
                    rel={link.newTab ? 'noopener noreferrer' : undefined}
                    size="xs"
                    style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
                  >
                    {link.label}
                  </Anchor>
                  {index < bottomBar.links.length - 1 && (
                    <Text size="xs" c="rgba(255,255,255,0.3)">·</Text>
                  )}
                </React.Fragment>
              ))}
            </Group>
          </Group>
        </Container>
      </div>

    </Section>
  );
};
