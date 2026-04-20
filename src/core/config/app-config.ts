import { z } from 'zod';

// Environment schema validation
const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('DENTIQ'),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000/api'),
  NEXT_PUBLIC_API_VERSION: z.string().default('v1'),
  NEXT_PUBLIC_ENABLE_3D_VIEWER: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  NEXT_PUBLIC_ENABLE_DEBUG_MODE: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),
  NEXT_PUBLIC_BUILD_DATE: z.string().optional(),
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

// Application configuration interface
export interface AppConfig {
  name: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  buildDate?: string;
  api: {
    url: string;
    version: string;
  };
  features: {
    enable3DViewer: boolean;
    enableAnalytics: boolean;
    enableDebugMode: boolean;
    enableOfflineMode: boolean;
    enableDarkMode: boolean;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    dateFormat: string;
    timeFormat: string;
  };
  limits: {
    maxFileSize: number; // MB
    maxUploadFiles: number;
    sessionTimeout: number; // minutes
    cacheTimeout: number; // minutes
  };
  external: {
    supportEmail: string;
    privacyUrl: string;
    termsUrl: string;
  };
}

// Environment-specific feature flags
const environmentFeatures: Record<AppConfig['environment'], Partial<AppConfig['features']>> = {
  development: {
    enableDebugMode: true,
    enableOfflineMode: false,
  },
  staging: {
    enableDebugMode: true,
    enableOfflineMode: true,
  },
  production: {
    enableDebugMode: false,
    enableOfflineMode: true,
  },
};

// Application configuration implementation
export const appConfig: AppConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  environment: env.NEXT_PUBLIC_APP_ENV,
  version: env.NEXT_PUBLIC_APP_VERSION,
  buildDate: env.NEXT_PUBLIC_BUILD_DATE,

  api: {
    url: env.NEXT_PUBLIC_API_URL,
    version: env.NEXT_PUBLIC_API_VERSION,
  },

  features: {
    enable3DViewer: env.NEXT_PUBLIC_ENABLE_3D_VIEWER,
    enableAnalytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    enableDebugMode: false,
    enableOfflineMode: true,
    enableDarkMode: true,
    ...environmentFeatures[env.NEXT_PUBLIC_APP_ENV],
  },

  ui: {
    theme: 'auto',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  },

  limits: {
    maxFileSize: 10, // 10 MB
    maxUploadFiles: 5,
    sessionTimeout: 60, // 60 minutes
    cacheTimeout: 30, // 30 minutes
  },

  external: {
    supportEmail: 'support@dentiq.com',
    privacyUrl: '/privacy-policy',
    termsUrl: '/terms-of-service',
  },
};

// Utility functions
export const isDevelopment = (): boolean => appConfig.environment === 'development';
export const isStaging = (): boolean => appConfig.environment === 'staging';
export const isProduction = (): boolean => appConfig.environment === 'production';

export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean => {
  return appConfig.features[feature];
};

export const getEnvironmentDisplayName = (): string => {
  switch (appConfig.environment) {
    case 'development':
      return 'Development';
    case 'staging':
      return 'Staging';
    case 'production':
      return 'Production';
    default:
      return 'Unknown';
  }
};

export const getAppTitle = (): string => {
  const envSuffix = isProduction() ? '' : ` (${getEnvironmentDisplayName()})`;
  return `${appConfig.name}${envSuffix}`;
};

// Validation helpers
export const validateConfig = (): boolean => {
  try {
    // Validate required fields
    if (!appConfig.name) return false;
    if (!appConfig.api.url) return false;

    // Validate URLs
    try {
      new URL(appConfig.api.url);
    } catch {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

// Debug logging (only in development)
export const logConfig = (): void => {
  if (isFeatureEnabled('enableDebugMode')) {
    console.group('🚀 Application Configuration');
    console.log('Environment:', appConfig.environment);
    console.log('Version:', appConfig.version);
    console.log('API URL:', appConfig.api.url);
    console.log('Features:', appConfig.features);
    console.groupEnd();
  }
};
