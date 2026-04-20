/**
 * Query Keys Constants
 *
 * Trimmed to only the keys that are currently in use.
 * If you add new React Query-powered features, extend this object
 * with new, well-named namespaces instead of ad-hoc strings.
 */
export const queryKeys = {
  services: {
    detail: (slug: string) => ['services', 'detail', slug] as const,
  },
} as const;
