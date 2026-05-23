// #region File Overview
/**
 * next.config.ts
 *
 * Main configuration file for the Next.js framework.
 * Controls how the entire frontend application is built, optimized, and served.
 *
 * Key settings:
 *   - reactStrictMode        → highlights potential bugs in development by double-rendering components
 *   - output: 'standalone'   → bundles only runtime files into .next/standalone for lean Docker images
 *   - images.remotePatterns  → whitelists external domains allowed to serve images via next/image
 *   - images.formats         → serves images as AVIF/WebP for smaller file sizes in production
 *   - compiler.removeConsole → strips all console.log calls in production (keeps error and warn)
 *   - poweredByHeader        → removes the "X-Powered-By: Next.js" HTTP header for security
 *   - compress               → enables gzip compression on all responses
 *   - headers                → security headers applied at the Next.js layer (works on any host,
 *                              not just Vercel — covers Droplet, App Platform, etc.)
 *   - serverExternalPackages → tells Next.js not to bundle Three.js on the server (it's browser-only)
 *   - optimizePackageImports → tree-shakes large packages (Mantine, Tabler icons, Lucide) so only
 *                              the components you actually use are included in the bundle
 */
// #endregion
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // output: 'standalone' bundles only the files needed to run the app into
  // .next/standalone — used by the production Dockerfile to keep the image small.
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  poweredByHeader: false,
  compress: true,

  // Security headers applied at the Next.js layer so they work on every
  // hosting platform (DigitalOcean Droplet, App Platform, self-hosted, etc.).
  // Previously these lived in vercel.json and were silently ignored outside Vercel.
  async headers() {
    return [
      {
        // Apply to every route
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Allow inline viewing of PDFs and other documents served from /docs
        source: '/docs/(.*)',
        headers: [
          { key: 'Content-Disposition', value: 'inline' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },

  serverExternalPackages: ['three', '@react-three/fiber', '@react-three/drei'],
  experimental: {
    optimizePackageImports: [
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/form',
      '@tabler/icons-react',
      'lucide-react',
    ],
  },
};

export default nextConfig;