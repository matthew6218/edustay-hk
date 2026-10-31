import type { SqlJsStatic } from 'sql.js';
import { openDemoDatabase, type DemoMigration } from './demo-database.ts';
import { handle } from './handler.ts';

type Options = {
  sql: () => Promise<SqlJsStatic>;
  migrations: () => Promise<DemoMigration[]>;
  store: { load(): Promise<Uint8Array | undefined>; save(bytes: Uint8Array): Promise<void> };
  session: { get(): string; set(cookie: string): void };
  lock<T>(work: () => Promise<T>): Promise<T>;
};

// The same request handlers power both the optional server API and this fully
// local sandbox. Session cookies below are virtual and never sent to a server.
export function createDemoClient(options: Options) {
  return (request: Request) => options.lock(async () => {
    const [SQL, migrations, saved] = await Promise.all([options.sql(), options.migrations(), options.store.load()]);
    const runtime = openDemoDatabase(SQL, migrations, saved);
    try {
      let nextSession: string | undefined;
      const response = await handle(request, {
        ...runtime, localDemo: true, sessionCookie: options.session.get(),
        onSession: cookie => { nextSession = cookie; },
      });
      // Save before acknowledging any change, including seed, rate limits and
      // one-time tokens. Never lose updates between tabs or page navigations.
      await options.store.save(runtime.export());
      if (nextSession !== undefined) options.session.set(nextSession.split(';')[0]);
      return response;
    } finally { runtime.close(); }
  });
}
