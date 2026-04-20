import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { status: 'ok', service: 'd3ntiq-frontend', timestamp: new Date().toISOString() },
    { status: 200 },
  );
}
