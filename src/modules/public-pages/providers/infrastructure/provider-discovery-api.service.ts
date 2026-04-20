import { buildApiUrl } from '@/core/config/api.config';
import { API_ENDPOINTS } from '@/shared/constants/routes';
import type {
  NearbyProvidersRequest,
  NearbyProvidersResponse,
} from '@/modules/public-pages/providers/domain/providers.types';

class ProviderDiscoveryApiService {
  private readonly baseUrl = buildApiUrl(API_ENDPOINTS.PROVIDERS.NEARBY);

  async getNearbyProviders(params: NearbyProvidersRequest): Promise<NearbyProvidersResponse> {
    const url = new URL(this.baseUrl);
    url.searchParams.set('location', params.location);
    if (typeof params.limit === 'number') {
      url.searchParams.set('limit', String(params.limit));
    }
    if (params.pageToken) {
      url.searchParams.set('pageToken', params.pageToken);
    }
    if (typeof params.includeDetails === 'boolean') {
      url.searchParams.set('includeDetails', String(params.includeDetails));
    }
    if (typeof params.latitude === 'number' && typeof params.longitude === 'number') {
      url.searchParams.set('latitude', String(params.latitude));
      url.searchParams.set('longitude', String(params.longitude));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const body = (await response.json()) as NearbyProvidersResponse | {
      message: string;
      statusCode?: number;
      error?: string;
      retryAfter?: number;
    };

    if (!response.ok) {
      const rawMessage =
        typeof body === 'object' && 'message' in body && typeof body.message === 'string'
          ? body.message
          : 'Failed to load nearby providers';

      // Build a user-friendly message based on the HTTP status
      let friendlyMessage: string;
      if (response.status === 429) {
        const retrySeconds = typeof body === 'object' && 'retryAfter' in body && body.retryAfter
          ? Number(body.retryAfter)
          : 900;
        const retryMinutes = Math.ceil(retrySeconds / 60);
        friendlyMessage = `You've reached the search limit. Please wait ${retryMinutes} minute${retryMinutes !== 1 ? 's' : ''} before searching again.`;
      } else if (response.status === 503 || response.status === 502) {
        friendlyMessage = 'The provider search service is temporarily unavailable. Please try again in a moment.';
      } else {
        friendlyMessage = rawMessage;
      }

      const error = new Error(friendlyMessage);
      (error as any).status = response.status;
      throw error;
    }

    return body as NearbyProvidersResponse;
  }
}

export const providerDiscoveryApiService = new ProviderDiscoveryApiService();

