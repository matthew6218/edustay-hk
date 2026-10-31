import { getDatabase } from '../db/client';
import { getImageStorage } from './storage';
import { handle as handleRequest } from './handler';

export async function handle(request: Request) {
  if (process.env.NEXT_PUBLIC_DATA_MODE !== 'server') {
    const health = new URL(request.url).pathname === '/api/health';
    return Response.json(health
      ? { ok: true, demo: true, mode: 'browser-demo' }
      : { error: 'This demo runs in your browser. Open the website to use its local demo.', mode: 'browser-demo' },
    { status: health ? 200 : 409, headers: { 'Cache-Control': 'no-store' } });
  }
  const db = getDatabase();
  if (!db) return Response.json({ error: 'Database is not configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.' }, { status: 503 });
  return handleRequest(request, { db, bucket: getImageStorage(), hosted: !!process.env.VERCEL });
}