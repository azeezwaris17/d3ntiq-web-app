/**
 * Validation Utilities
 *
 * Simple validation functions to replace value objects for basic types.
 * These provide validation without unnecessary abstraction.
 */

/**
 * Validates email format
 */
export function validateEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    throw new Error('Email is required and must be a string');
  }

  const trimmed = email.trim().toLowerCase();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    throw new Error('Invalid email format');
  }

  return trimmed;
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): string {
  if (!password || typeof password !== 'string') {
    throw new Error('Password is required and must be a string');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter');
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    throw new Error('Password must contain at least one number');
  }

  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new Error('Password must contain at least one special character');
  }

  return password;
}

/**
 * Validates phone number format
 */
export function validatePhoneNumber(phoneNumber: string): string {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    throw new Error('Phone number is required and must be a string');
  }

  // Remove common formatting characters
  const cleaned = phoneNumber.replace(/[\s\-\(\)\.]/g, '');

  // Check if it's a valid phone number (10 digits, optionally with country code)
  const phoneRegex = /^(\+?\d{1,3})?\d{10}$/;

  if (!phoneRegex.test(cleaned)) {
    throw new Error('Invalid phone number format');
  }

  return cleaned;
}
