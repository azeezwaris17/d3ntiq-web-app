import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Use server-side BACKEND_API_URL (not exposed to browser) to avoid self-referencing loop.
// Falls back to NEXT_PUBLIC_API_URL stripped of /api, then to localhost:3001.
const BACKEND_URL = (
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001'
).replace(/\/api$/, '');

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const backendUrl = new URL(`${BACKEND_URL.replace(/\/$/, '')}/api/public/providers/nearby`);

    // Forward all query params
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });

    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[providers/nearby proxy] error:', error);
    return NextResponse.json(
      { message: 'Failed to reach provider discovery service', code: 'SERVICE_UNAVAILABLE' },
      { status: 503 }
    );
  }
}
