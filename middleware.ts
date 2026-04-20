import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Routes that require authentication — any path starting with these
const PATIENT_ROUTES = ['/patient'];
const PROVIDER_ROUTES = ['/provider'];

// Routes that are always public
const PUBLIC_PREFIXES = [
  '/_next',
  '/api',
  '/images',
  '/icons',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow static assets and API routes
  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // Check if the user is logged in via the auth cookie set on login
  const isLoggedIn = req.cookies.get('dentiq_auth')?.value === 'true';
  const userRole   = req.cookies.get('dentiq_role')?.value; // 'patient' | 'provider'

  const isPatientRoute  = PATIENT_ROUTES.some((p) => pathname.startsWith(p));
  const isProviderRoute = PROVIDER_ROUTES.some((p) => pathname.startsWith(p));

  // Redirect unauthenticated users trying to access protected routes
  if (isPatientRoute && !isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = '?role=patient';
    return NextResponse.redirect(url);
  }

  if (isProviderRoute && !isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = '?role=provider';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users to the correct dashboard if they hit the wrong role's routes
  if (isPatientRoute && isLoggedIn && userRole === 'provider') {
    const url = req.nextUrl.clone();
    url.pathname = '/provider/profile';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (isProviderRoute && isLoggedIn && userRole === 'patient') {
    const url = req.nextUrl.clone();
    url.pathname = '/patient/oral-iq';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Redirect already-authenticated users away from login/register pages
  if (isLoggedIn && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    const url = req.nextUrl.clone();
    url.pathname = userRole === 'provider' ? '/provider/profile' : '/patient/oral-iq';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*).*)'],
};
