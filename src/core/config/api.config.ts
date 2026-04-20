/**
 * API Configuration
 *
 * This file provides centralized configuration for API base URL.
 * All API operations now use GraphQL, except file uploads which use REST endpoints.
 */

import { z } from 'zod';

// Environment schema validation
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url('NEXT_PUBLIC_API_URL must be a valid URL')
    .default('http://localhost:3000'),
  NEXT_PUBLIC_GRAPHQL_ENDPOINT: z.string().default('/graphql'),
});

const env = envSchema.parse(process.env);

// API configuration interface
export interface ApiConfig {
  baseUrl: string;
  graphqlEndpoint: string;
}

// API configuration implementation
export const apiConfig: ApiConfig = {
  baseUrl: env.NEXT_PUBLIC_API_URL,
  graphqlEndpoint: env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
};

// Utility function for building full URLs (used for file uploads only)
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = apiConfig.baseUrl.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
