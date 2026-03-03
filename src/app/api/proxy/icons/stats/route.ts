import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  const BASE = (process.env.NEXT_PUBLIC_NEST_API_URL || process.env.NEST_API_URL || 'https://cloudflare-workers-openapi-production.up.railway.app').replace(/\/+$/, '');
  const url = `${BASE}/icons/stats`;

  try {
    const res = await fetch(url, { method: 'GET' });
    const body = await res.text();

    const response = new NextResponse(body, { status: res.status });
    const contentType = res.headers.get('content-type');
    if (contentType) response.headers.set('Content-Type', contentType);
    // Add CORS headers
    Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'proxy_error', details: String(err) }, { status: 502, headers: CORS_HEADERS });
  }
}
