import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@libsql/client';
import { Database, getClient } from '../../db/client.ts';
import { migrate } from '../../scripts/migrations.mjs';

test('Vercel requires a remote database and never uses local or memory storage', () => {
  const keys = ['VERCEL', 'TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN'];
  const original = keys.map(key => process.env[key]);
  try {
    process.env.VERCEL = '1';
    process.env.TURSO_AUTH_TOKEN = 'test-only';
    for (const url of ['', ':memory:', 'file:.data/test.db']) {
      process.env.TURSO_DATABASE_URL = url;
      assert.equal(getClient(), undefined);
    }
    process.env.TURSO_DATABASE_URL = 'libsql://example.turso.io';
    delete process.env.TURSO_AUTH_TOKEN;
    assert.equal(getClient(), undefined);
  } finally {
    keys.forEach((key, index) => { if (original[index] === undefined) delete process.env[key]; else process.env[key] = original[index]; });
  }
});

test('libSQL adapter preserves bindings, affected rows, empty reads and atomic batches', async () => {
  const client = createClient({ url: ':memory:' });
  try {
    const db = new Database(client);
    await db.prepare('CREATE TABLE items (id TEXT PRIMARY KEY, value TEXT)').run();
    const insert = db.prepare('INSERT INTO items (id,value) VALUES (?,?)');
    const value = "quote ' and SQL ; DROP TABLE items;";
    assert.equal((await insert.bind('one', value).run()).meta.changes, 1);
    assert.deepEqual(await db.prepare('SELECT value FROM items WHERE id=?').bind('one').first(), { value });
    assert.equal(await db.prepare('SELECT * FROM items WHERE id=?').bind('absent').first(), null);
    await assert.rejects(db.batch([insert.bind('two', 'rollback'), insert.bind('one', 'duplicate')]));
    assert.equal(await db.prepare('SELECT * FROM items WHERE id=?').bind('two').first(), null);
    assert.equal((await db.prepare('DELETE FROM items WHERE id=?').bind('one').run()).meta.changes, 1);
    assert.deepEqual((await db.prepare('SELECT * FROM items').all()).results, []);
  } finally { client.close(); }
});

test('schema migrations are repeatable and preserve existing records', async () => {
  const client = createClient({ url: ':memory:' });
  try {
    await migrate(client);
    await client.execute("INSERT INTO meta (key,value) VALUES ('preserved','yes')");
    await migrate(client);
    assert.equal((await client.execute('SELECT * FROM edustay_migrations')).rows.length, 2);
    assert.equal((await client.execute("SELECT value FROM meta WHERE key='preserved'")).rows[0].value, 'yes');
    assert.equal((await client.execute('SELECT * FROM media')).rows.length, 0);
  } finally { client.close(); }
});
