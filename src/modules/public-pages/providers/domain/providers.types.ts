export interface SearchCenter {
  latitude: number;
  longitude: number;
  formattedAddress?: string;
}

/**
 * A provider sourced from Google Places API.
 */
export interface NearbyProvider {
  id: string;
  name: string;
  specialty: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number | null;
  reviewCount: number | null;
  isOpenNow: boolean | null;
  phone?: string | null;
  source: 'google';
}

/**
 * A provider who has registered and been verified on the D3NTIQ platform.
 * Shown with a D3NTIQ verification badge in search results.
 */
export interface RegisteredProvider {
  /** Internal D3NTIQ provider ID */
  id: string;
  /** Provider or practice name */
  name: string;
  /** Dental specialty */
  specialty: string;
  /** Practice name (may differ from provider name) */
  practiceName: string | null;
  /** Practice address */
  address: string | null;
  /** Contact phone */
  phone: string | null;
  /** Always true — only verified providers are returned */
  isVerified: true;
  /** Source identifier */
  source: 'd3ntiq';
}

export interface NearbyProvidersRequest {
  location: string;
  limit?: number;
  pageToken?: string;
  includeDetails?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface NearbyProvidersResponse {
  searchCenter: SearchCenter | null;
  /** Providers from Google Places API */
  providers: NearbyProvider[];
  /** D3NTIQ-registered and verified providers matching the search */
  registeredProviders: RegisteredProvider[];
  nextPageToken?: string | null;
  pageSize: number;
}

