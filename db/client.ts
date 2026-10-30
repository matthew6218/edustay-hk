import { mkdirSync } from 'node:fs';
import { createClient, type Client, type InValue, type ResultSet } from '@libsql/client';

let client: Client | undefined;

export function getClient(): Client | undefined {
  if (client) return client;
  const url = process.env.TURSO_DATABASE_URL;
  // A serverless instance's filesystem is not durable storage.
  if (process.env.VERCEL && (!url || !/^(libsql|https):\/\//i.test(url) || !process.env.TURSO_AUTH_TOKEN)) return undefined;
  if (!url) mkdirSync('.data', { recursive: true });
  client = createClient({ url: url || 'file:.data/edustay.db', authToken: process.env.TURSO_AUTH_TOKEN });
  return client;
}

function result(value: ResultSet) {
  return { results: value.rows, meta: { changes: value.rowsAffected } };
}

// Preserve the API's prepared statements and transactional batches when moving
// from D1 to libSQL. Bindings remain separate from SQL text.
export class Statement {
  client: Client;
  sql: string;
  args: InValue[];
  constructor(client: Client, sql: string, args: InValue[] = []) {
    this.client = client;
    this.sql = sql;
    this.args = args;
  }
  bind(...args: InValue[]) { return new Statement(this.client, this.sql, args); }
  async all<T = Record<string, unknown>>() {
    const value = result(await this.client.execute({ sql: this.sql, args: this.args }));
    return { ...value, results: value.results as unknown as T[] };
  }
  async first<T = Record<string, unknown>>() { return (await this.all<T>()).results[0] ?? null; }
  async run() { return result(await this.client.execute({ sql: this.sql, args: this.args })); }
}

export class Database {
  client: Client;
  constructor(client: Client) { this.client = client; }
  prepare(sql: string) { return new Statement(this.client, sql); }
  async batch(statements: Statement[]) {
    if (!statements.length) return [];
    return (await this.client.batch(statements.map(({ sql, args }) => ({ sql, args })), 'write')).map(result);
  }
}

export function getDatabase() {
  const connection = getClient();
  return connection ? new Database(connection) : undefined;
}
