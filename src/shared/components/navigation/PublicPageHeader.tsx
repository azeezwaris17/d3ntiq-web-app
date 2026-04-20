'use client';

/**
 * PublicHeader
 *
 * Fixed top navigation bar for all public pages.
 *
 * Layout (left → right):
 *   [Logo]  [Nav links]  ──────────────  [Login] [Register]
 *
 * Uses the shared layout primitives:
 *   - Container  — max-width + horizontal padding
 *   - ComponentGroup — flex row with spacing
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Box, Button, Burger } from '@mantine/core';
import { useWindowScroll, useClickOutside } from '@mantine/hooks';
import { Container, ComponentGroup } from '@/shared/components/layout';

// ─── Constants ────────────────────────────────────────────────────────────────

const BRAND_COLOR = '#46869D';
const HEADER_HEIGHT = 64; // px — height of the nav row
const ACCENT_HEIGHT = 3;  // px — top gradient bar
const TOTAL_HEIGHT = HEADER_HEIGHT + ACCENT_HEIGHT;

const LOGO = { href: '/home', src: '/images/dentiq-logo.png', alt: 'DENTIQ Logo' };

const NAV_LINKS = [
  { href: '/home',          label: 'Home' },
  { href: '/oral-iq',       label: 'Oral IQ' },
  { href: '/providers',     label: 'Locate Provider' },
  { href: '/how-it-works',  label: 'How It Works' },
  { href: '/about',         label: 'About' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const PublicHeader = () => {
  const pathname = usePathname();
  const [scroll] = useWindowScroll();
  const scrolled = scroll.y > 20;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useClickOutside(() => setMenuOpen(false));

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href + '/'));

  return (
    <>
      {/* ── Fixed header ── */}
      <Box
        component="header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : '#ffffff',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #eef2f6' : '1px solid transparent',
          transition: 'background-color 0.25s ease, border-color 0.25s ease',
        }}
      >
        {/* Brand accent line */}
        <Box
          style={{
            height: ACCENT_HEIGHT,
            background: `linear-gradient(90deg, ${BRAND_COLOR}, #54D1ED)`,
          }}
        />

        {/* Nav row — uses Container for consistent max-width + padding */}
        <Box style={{ height: HEADER_HEIGHT }}>
          <Container size="xl" className="h-full">

            {/* Single row: logo + nav + auth — ComponentGroup handles flex row */}
            <ComponentGroup
              direction="row"
              spacing="md"
              align="center"
              className="h-full justify-between relative"
            >

              {/* ── Logo ── */}
              <Link
                href={LOGO.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  flexShrink: 0,
                  lineHeight: 0,
                }}
              >
                <Image
                  src={LOGO.src}
                  alt={LOGO.alt}
                  width={140}
                  height={32}
                  style={{ objectFit: 'contain', width: 'auto', height: 32 }}
                  priority
                />
              </Link>

              {/* ── Desktop nav links — centered ── */}
              <ComponentGroup
                direction="row"
                spacing="md"
                align="center"
                className="hidden md:flex absolute left-1/2 -translate-x-1/2"
              >
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Box key={link.href} style={{ position: 'relative' }}>
                      <Link
                        href={link.href}
                        style={{
                          textDecoration: 'none',
                          fontSize: 14,
                          fontWeight: active ? 600 : 400,
                          color: active ? BRAND_COLOR : '#4a5568',
                          padding: '4px 0',
                          whiteSpace: 'nowrap',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {link.label}
                      </Link>
                      {/* Active underline */}
                      {active && (
                        <Box
                          style={{
                            position: 'absolute',
                            bottom: -2,
                            left: 0,
                            right: 0,
                            height: 2,
                            borderRadius: 2,
                            backgroundColor: BRAND_COLOR,
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </ComponentGroup>

              {/* ── Desktop auth buttons — right side ── */}
              <ComponentGroup
                direction="row"
                spacing="sm"
                align="center"
                className="hidden md:flex flex-shrink-0"
              >
                <Button
                  component={Link}
                  href="/login?role=patient"
                  variant="outline"
                  size="sm"
                  style={{
                    borderColor: BRAND_COLOR,
                    color: BRAND_COLOR,
                    fontSize: 13,
                    fontWeight: 500,
                    height: 36,
                    paddingLeft: 18,
                    paddingRight: 18,
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/register?role=patient"
                  size="sm"
                  style={{
                    backgroundColor: BRAND_COLOR,
                    fontSize: 13,
                    fontWeight: 500,
                    height: 36,
                    paddingLeft: 18,
                    paddingRight: 18,
                  }}
                >
                  Register
                </Button>
              </ComponentGroup>

              {/* ── Mobile burger ── */}
              <Box
                className="flex md:hidden flex-shrink-0"
                style={{ position: 'relative' }}
                ref={menuRef}
              >
                <Burger
                  opened={menuOpen}
                  onClick={() => setMenuOpen((o) => !o)}
                  size="sm"
                  color={BRAND_COLOR}
                  aria-label="Toggle navigation menu"
                />

                {/* Mobile dropdown */}
                {menuOpen && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      backgroundColor: '#ffffff',
                      borderRadius: 10,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                      border: '1px solid #edf2f7',
                      minWidth: 220,
                      padding: '8px 0',
                      zIndex: 200,
                    }}
                  >
                    {NAV_LINKS.map((link) => {
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          style={{
                            display: 'block',
                            padding: '10px 18px',
                            textDecoration: 'none',
                            fontSize: 14,
                            fontWeight: active ? 600 : 400,
                            color: active ? BRAND_COLOR : '#374151',
                            backgroundColor: active ? `${BRAND_COLOR}0d` : 'transparent',
                          }}
                        >
                          {link.label}
                        </Link>
                      );
                    })}

                    <Box style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }} />

                    <Box style={{ padding: '4px 12px 8px' }}>
                      <ComponentGroup direction="col" spacing="sm" className="w-full">
                        <Button
                          component={Link}
                          href="/login?role=patient"
                          onClick={() => setMenuOpen(false)}
                          fullWidth
                          variant="outline"
                          size="sm"
                          style={{
                            borderColor: BRAND_COLOR,
                            color: BRAND_COLOR,
                            fontSize: 13,
                            height: 36,
                          }}
                        >
                          Login
                        </Button>
                        <Button
                          component={Link}
                          href="/register?role=patient"
                          onClick={() => setMenuOpen(false)}
                          fullWidth
                          size="sm"
                          style={{
                            backgroundColor: BRAND_COLOR,
                            fontSize: 13,
                            height: 36,
                          }}
                        >
                          Register
                        </Button>
                      </ComponentGroup>
                    </Box>
                  </Box>
                )}
              </Box>

            </ComponentGroup>
          </Container>
        </Box>
      </Box>

      {/* Spacer — prevents page content from hiding under the fixed header */}
      <Box style={{ height: TOTAL_HEIGHT, flexShrink: 0 }} />
    </>
  );
};
