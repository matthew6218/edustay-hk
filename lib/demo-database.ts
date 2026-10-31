import type { Database as SqlDatabase, SqlJsStatic, SqlValue } from 'sql.js';
import type { AppDatabase, PreparedStatement, ImageStorage } from '../db/contracts';

class DemoStatement implements PreparedStatement {
  database: SqlDatabase;
  sql: string;
  args: SqlValue[];
  constructor(database: SqlDatabase, sql: string, args: SqlValue[] = []) {
    this.database = database; this.sql = sql; this.args = args;
  }
  bind(...args: SqlValue[]) { return new DemoStatement(this.database, this.sql, args); }
  async all<T = Record<string, unknown>>() {
    const statement = this.database.prepare(this.sql);
    const results: T[] = [];
    try {
      statement.bind(this.args);
      while (statement.step()) results.push(statement.getAsObject() as T);
      return { results, meta: { changes: this.database.getRowsModified() } };
    } finally { statement.free(); }
  }
  async first<T = Record<string, unknown>>() { return (await this.all<T>()).results[0] ?? null; }
  async run() { return this.all(); }
}

export type DemoMigration = { tag: string; sql: string };

export function openDemoDatabase(SQL: SqlJsStatic, migrations: DemoMigration[], bytes?: Uint8Array) {
  const database = new SQL.Database(bytes);
  try {
    database.run('PRAGMA foreign_keys=ON');
    database.run('CREATE TABLE IF NOT EXISTS browser_migrations (tag TEXT PRIMARY KEY)');
    for (const { tag, sql } of migrations) {
      if (database.exec('SELECT tag FROM browser_migrations WHERE tag=?', [tag]).length) continue;
      database.run('BEGIN');
      try {
        database.exec(sql);
        database.run('INSERT INTO browser_migrations (tag) VALUES (?)', [tag]);
        database.run('COMMIT');
      } catch (error) { database.run('ROLLBACK'); throw error; }
    }
    database.run('CREATE TABLE IF NOT EXISTS browser_images (id TEXT PRIMARY KEY, bytes BLOB NOT NULL)');
  } catch (error) { database.close(); throw error; }

  const db: AppDatabase = {
    prepare: sql => new DemoStatement(database, sql),
    async batch(statements) {
      database.run('BEGIN');
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.run());
        database.run('COMMIT');
        return results;
      } catch (error) { database.run('ROLLBACK'); throw error; }
    },
  };
  const bucket: ImageStorage = {
    async put(key, bytes) { database.run('INSERT INTO browser_images (id,bytes) VALUES (?,?)', [key, bytes]); },
    async get(key) {
      const row = await db.prepare('SELECT bytes FROM browser_images WHERE id=?').bind(key).first<{ bytes: Uint8Array }>();
      return row ? { body: Uint8Array.from(row.bytes) } : null;
    },
  };
  return { db, bucket, export: () => database.export(), close: () => database.close() };
}
