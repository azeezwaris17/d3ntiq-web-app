// #region File Overview
/**
 * middleware.ts
 *
 * Next.js middleware runs on every request BEFORE the page renders.
 * It acts as a gatekeeper — checking cookies and redirecting users
 * to the right place based on whether they are logged in and what role they have.
 *
 * Rules enforced:
 *   1. Static assets and API routes are always allowed through.
 *   2. /patient/* routes require a logged-in PATIENT — redirect to /login if not.
 *   3. /provider/* routes require a logged-in PROVIDER — redirect to /login if not.
 *   4. A PROVIDER trying to access /patient/* is sent to their own dashboard.
 *   5. A PATIENT trying to access /provider/* is sent to their own dashboard.
 *   6. A logged-in user visiting /login or /register is sent to their dashboard.
 */
// #endregion

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// ── Route groups ──────────────────────────────────────────────────────────────

// Always public — never blocked regardless of auth state
const PUBLIC_PREFIXES = [
  '/_next',       // Next.js internal assets (JS, CSS chunks)
  '/api',         // API routes
  '/images',      // Static images
  '/icons',       // Static icons
  '/docs',        // Static documents (PDFs etc.)
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns true if the path is a public asset that should never be blocked. */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/** Builds a redirect response to the given path, clearing any existing query string. */
function redirectTo(req: NextRequest, pathname: string, search = ''): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  url.search   = search;
  return NextResponse.redirect(url);
}

// ── Middleware ────────────────────────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rule 1 — always allow public assets through
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Read auth state from cookies set during login
  const isLoggedIn = req.cookies.get('dentiq_auth')?.value === 'true';
  const userRole   = req.cookies.get('dentiq_role')?.value; // 'patient' | 'provider'

  // Rule 2 — unauthenticated user trying to access a patient page
  // Covers both /patient (exact) and /patient/* (sub-routes)
  if ((pathname === '/patient' || pathname.startsWith('/patient/')) && !isLoggedIn) {
    return redirectTo(req, '/login', '?role=patient');
  }

  // Rule 3 — unauthenticated user trying to access a provider page
  // Covers both /provider (exact) and /provider/* (sub-routes)
  if ((pathname === '/provider' || pathname.startsWith('/provider/')) && !isLoggedIn) {
    return redirectTo(req, '/login', '?role=provider');
  }

  // Rule 4 — a provider accidentally landed on a patient page
  if ((pathname === '/patient' || pathname.startsWith('/patient/')) && isLoggedIn && userRole === 'provider') {
    return redirectTo(req, '/provider');
  }

  // Rule 5 — a patient accidentally landed on a provider page
  if ((pathname === '/provider' || pathname.startsWith('/provider/')) && isLoggedIn && userRole === 'patient') {
    return redirectTo(req, '/patient');
  }

  // Rule 6 — a logged-in user visiting login or register is sent to their dashboard home.
  // NOTE: This only applies when navigating to /login directly while already authenticated.
  // During the login completion flow, LoginPage.tsx handles its own redirect via sessionStorage
  // before the cookie is set, so this rule does not interfere with that flow.
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  if (isLoggedIn && isAuthPage) {
    const dashboard = userRole === 'provider' ? '/provider' : '/patient';
    return redirectTo(req, dashboard);
  }

  // All checks passed — allow the request through
  return NextResponse.next();
}

// ── Matcher ───────────────────────────────────────────────────────────────────
// Explicitly list the route patterns middleware should run on.
// This is more reliable on Vercel's Edge Runtime than a negative lookahead regex.
export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico, robots.txt, sitemap.xml
     * - Any file with an extension (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\..*).*)',
  ],
};
