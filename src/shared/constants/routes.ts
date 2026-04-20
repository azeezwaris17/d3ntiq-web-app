// Public routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  HOW_IT_WORKS: '/how-it-works',
  ABOUT: '/about',
  SERVICES: '/services',
  CONTACT: '/contact',
  PROVIDERS: '/providers',
} as const;

// Authentication routes
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

// Dashboard routes
export const DASHBOARD_ROUTES = {
  PATIENT: '/dashboard/patient',
  PROVIDER: '/dashboard/provider',
  STAFF: '/dashboard/staff',
  ADMIN: '/dashboard/admin',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  PROVIDERS: {
    NEARBY: '/api/public/providers/nearby',
  },
  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
  },
  PATIENTS: {
    BASE: '/api/patients',
    BY_ID: (id: string) => `/api/patients/${id}`,
  },
} as const;
