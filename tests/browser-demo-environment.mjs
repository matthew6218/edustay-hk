import initSqlJs from 'sql.js';
import { IDBFactory } from 'fake-indexeddb';
import { readFile } from 'node:fs/promises';
import { createDemoClient } from '../lib/demo-client.ts';
import { createDemoStore } from '../lib/demo-persistence.ts';

const sql = initSqlJs();
const journal = JSON.parse(await readFile(new URL('../drizzle/meta/_journal.json', import.meta.url), 'utf8'));
const migrations = await Promise.all(journal.entries.map(async ({ tag }) => ({
  tag, sql: await readFile(new URL(`../drizzle/${tag}.sql`, import.meta.url), 'utf8'),
})));

export function createBrowserTestEnvironment() {
  const factory = new IDBFactory();
  let queue = Promise.resolve();
  function lock(work) {
    const result = queue.then(work);
    queue = result.catch(() => {});
    return result;
  }
  return {
    makeClient(session = { value: '' }) {
      const client = createDemoClient({
        sql: () => sql, migrations: async () => migrations,
        store: createDemoStore(factory),
        session: { get: () => session.value, set: value => { session.value = value; } },
        lock,
      });
      return (url, options) => client(new Request(url, options));
    },
  };
}

const environment = createBrowserTestEnvironment();
export const createBrowserTestClient = () => environment.makeClient();
