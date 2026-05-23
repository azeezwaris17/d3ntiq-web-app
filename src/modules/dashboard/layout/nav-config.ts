/**
 * nav-config.ts
 *
 * Single source of truth for sidebar navigation per role.
 * To add a menu item: add an entry here and create the route page.
 */

import { User, Stethoscope, Calendar, LayoutDashboard } from 'lucide-react';
import type { NavItem, DashboardRole } from './types';

/** Patient sidebar — Dashboard + Oral IQ + Appointments + Profile */
const patientNav: NavItem[] = [
  { key: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard, href: '/patient' },
  { key: 'oral-iq',      label: 'Oral IQ',      icon: Stethoscope,     href: '/patient/oral-iq' },
  { key: 'appointments', label: 'Appointments', icon: Calendar,        href: '/patient/appointments' },
  { key: 'profile',      label: 'Profile',      icon: User,            href: '/patient/profile' },
];

/** Provider sidebar — Dashboard + Appointments + Profile */
const providerNav: NavItem[] = [
  { key: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard, href: '/provider' },
  { key: 'appointments', label: 'Appointments', icon: Calendar,        href: '/provider/appointments' },
  { key: 'profile',      label: 'Profile',      icon: User,            href: '/provider/profile' },
];

/**
 * Patient mobile bottom bar — primary tabs shown directly in the bar.
 * "More" is always appended as the last slot by MobileBottomNav.
 * The More sheet shows ALL nav items (patientNav) including these.
 */
const patientBottomNav: NavItem[] = [
  { key: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard, href: '/patient' },
  { key: 'oral-iq',      label: 'Oral IQ',      icon: Stethoscope,     href: '/patient/oral-iq' },
  { key: 'appointments', label: 'Appointments', icon: Calendar,        href: '/patient/appointments' },
];

/**
 * Provider mobile bottom bar — primary tabs shown directly in the bar.
 * "More" is always appended as the last slot by MobileBottomNav.
 * The More sheet shows ALL nav items (providerNav) including these.
 */
const providerBottomNav: NavItem[] = [
  { key: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard, href: '/provider' },
  { key: 'appointments', label: 'Appointments', icon: Calendar,        href: '/provider/appointments' },
];

export function getNavItems(role: DashboardRole): NavItem[] {
  return role === 'provider' ? providerNav : patientNav;
}

/** Returns the items shown as tabs in the mobile bottom bar (excludes "More"). */
export function getBottomNavItems(role: DashboardRole): NavItem[] {
  return role === 'provider' ? providerBottomNav : patientBottomNav;
}
