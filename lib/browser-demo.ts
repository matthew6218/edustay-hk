import initSqlJs from 'sql.js';
import { createDemoClient } from './demo-client';
import { createDemoStore } from './demo-persistence';
import type { DemoMigration } from './demo-database';

let client: ReturnType<typeof createDemoClient> | undefined;

function getClient() {
  if (client) return client;
  if (!navigator.locks || !window.indexedDB) throw new Error('Use a current browser with site storage enabled to try the demo.');
  let sql: ReturnType<typeof initSqlJs> | undefined;
  let migrations: Promise<DemoMigration[]> | undefined;
  const store = createDemoStore();
  client = createDemoClient({
    sql: () => sql ??= initSqlJs({ locateFile: () => '/demo/sql-wasm.wasm' }).catch(error => { sql = undefined; throw error; }),
    migrations: () => migrations ??= fetch('/demo/schema.json').then(async response => {
      if (!response.ok) throw new Error('The demo could not load. Refresh and try again.');
      return response.json() as Promise<DemoMigration[]>;
    }).catch(error => { migrations = undefined; throw error; }),
    store,
    session: {
      get: () => sessionStorage.getItem('edustay-demo-session') || '',
      set: cookie => sessionStorage.setItem('edustay-demo-session', cookie),
    },
    lock: async work => await navigator.locks.request('edustay-browser-demo-v1', work),
  });
  return client;
}

export async function browserDemoResponse(path: string, body?: unknown) {
  const url = new URL('/api/' + path, location.origin);
  return getClient()(new Request(url, body === undefined ? {} : {
    method: 'POST', headers: { Origin: location.origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }));
}
