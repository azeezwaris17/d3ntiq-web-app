// Date/Time formatting utilities
export const formatDate = (date: Date | string): string => {
  const d: Date = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d: Date = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date: Date | string): string => {
  const d: Date = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateShort = (date: Date | string): string => {
  const d: Date = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// String manipulation helpers
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  if (!str) return str;
  return str
    .split(' ')
    .map((word: string) => capitalize(word))
    .join(' ');
};

export const truncate = (str: string, length: number, suffix = '...'): string => {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + suffix;
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex: RegExp = /^[\d\s\-\(\)\+]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const isValidZipCode = (zipCode: string): boolean => {
  const zipRegex: RegExp = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

// HIPAA-compliant data masking utilities
export const maskEmail = (email: string): string => {
  if (!email || !isValidEmail(email)) return email;
  const parts: string[] = email.split('@');
  if (parts.length !== 2) return email;
  const [localPart, domain] = parts;
  if (!localPart || !domain) return email;
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  const maskedLocal: string = `${localPart.slice(0, 2)}***`;
  return `${maskedLocal}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  if (!phone) return phone;
  const digits: string = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  const lastFour: string = digits.slice(-4);
  return `***-***-${lastFour}`;
};

export const maskSSN = (ssn: string): string => {
  if (!ssn) return ssn;
  const digits: string = ssn.replace(/\D/g, '');
  if (digits.length !== 9) return ssn;
  return `***-**-${digits.slice(-4)}`;
};

export const maskName = (name: string): string => {
  if (!name) return name;
  const parts: string[] = name
    .trim()
    .split(' ')
    .filter((x: string) => Boolean(x));
  if (parts.length === 0) return name;
  if (parts.length === 1) {
    const part: string = parts[0] ?? '';
    if (!part || part.length <= 2) return '***';
    return `${part[0]}***`;
  }
  const first: string = parts[0] ?? '';
  const last: string = parts[parts.length - 1] ?? '';
  const firstMasked = first && first.length > 0 ? `${first[0]}***` : '***';
  const lastMasked = last && last.length > 0 ? `${last[0]}***` : '***';
  return `${firstMasked} ${lastMasked}`;
};

// Format conversion utilities
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Debounce utility
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};
