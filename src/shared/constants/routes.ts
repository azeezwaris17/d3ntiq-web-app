// ── Public routes ─────────────────────────────────────────────────────────────
export const PUBLIC_ROUTES = {
  HOME: '/home',
  ORAL_IQ: '/oral-iq',
  PROVIDERS: '/providers',
  HOW_IT_WORKS: '/how-it-works',
  ABOUT: '/about',
  SERVICES: '/services',
} as const;

// ── Auth routes ───────────────────────────────────────────────────────────────
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_OTP: '/verify-otp',
  RESET_PASSWORD: '/reset-password',
} as const;

// ── Dashboard routes ──────────────────────────────────────────────────────────
export const DASHBOARD_ROUTES = {
  PATIENT_ROOT: '/patient',
  PATIENT_ORAL_IQ: '/patient/oral-iq',
  PATIENT_APPOINTMENTS: '/patient/appointments',
  PATIENT_PROFILE: '/patient/profile',
  PROVIDER_ROOT: '/provider',
  PROVIDER_APPOINTMENTS: '/provider/appointments',
  PROVIDER_PROFILE: '/provider/profile',
  PROVIDER_ORAL_IQ: '/provider/oral-iq',
} as const;

// ── API endpoints ─────────────────────────────────────────────────────────────
export const API_ENDPOINTS = {
  PROVIDERS: {
    NEARBY: '/api/public/providers/nearby',
  },
} as const;
