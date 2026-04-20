import type React from 'react';

export type DashboardRole = 'patient' | 'provider';

export interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
}

export interface DashboardUser {
  fullName: string;
  idLabel: string;
  avatarUrl?: string;
}
