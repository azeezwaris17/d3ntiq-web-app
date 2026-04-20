/**
 * nav-config.ts
 *
 * Single source of truth for sidebar navigation per role.
 * To add a menu item: add an entry here and create the route page.
 */

import { User, Stethoscope, Calendar } from 'lucide-react';
import type { NavItem, DashboardRole } from './types';

/** Patient sidebar — Oral IQ + Appointments + Profile */
const patientNav: NavItem[] = [
  { key: 'oral-iq', label: 'Oral IQ', icon: Stethoscope, href: '/patient/oral-iq' },
  { key: 'appointments', label: 'Appointments', icon: Calendar, href: '/patient/appointments' },
  { key: 'profile', label: 'Profile', icon: User, href: '/patient/profile' },
];

/** Provider sidebar — Profile + Appointments */
const providerNav: NavItem[] = [
  { key: 'appointments', label: 'Appointments', icon: Calendar, href: '/provider/appointments' },
  { key: 'profile', label: 'Profile', icon: User, href: '/provider/profile' },
];

export function getNavItems(role: DashboardRole): NavItem[] {
  return role === 'provider' ? providerNav : patientNav;
}
