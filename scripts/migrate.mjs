import { getClient } from '../db/client.ts';
import { migrate } from './migrations.mjs';

const client = getClient();
if (!client) throw new Error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before running migrations on Vercel.');
try {
  await migrate(client);
  console.log('Database migrations are up to date.');
} finally { client.close(); }
