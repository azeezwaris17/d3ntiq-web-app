// User roles
export type UserRole = 'patient' | 'provider' | 'staff' | 'admin';

// User permissions
export type Permission =
  | 'view_patient_records'
  | 'edit_patient_records'
  | 'view_appointments'
  | 'manage_appointments'
  | 'view_reports'
  | 'manage_users'
  | 'manage_settings';

// Base user type
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}

// Common entity types
export interface Patient {
  id: string;
  userId: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: Address;
  emergencyContact?: EmergencyContact;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Sort types
export type SortOrder = 'asc' | 'desc';

export interface SortParams {
  field: string;
  order: SortOrder;
}
