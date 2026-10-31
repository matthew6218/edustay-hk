import { mkdir, readFile, copyFile, writeFile } from 'node:fs/promises';

const output = new URL('../public/demo/', import.meta.url);
await mkdir(output, { recursive: true });
await copyFile(new URL('../node_modules/sql.js/dist/sql-wasm-browser.wasm', import.meta.url), new URL('sql-wasm.wasm', output));
const journal = JSON.parse(await readFile(new URL('../drizzle/meta/_journal.json', import.meta.url), 'utf8'));
const migrations = await Promise.all(journal.entries.map(async ({ tag }) => ({
  tag, sql: await readFile(new URL(`../drizzle/${tag}.sql`, import.meta.url), 'utf8'),
})));
await writeFile(new URL('schema.json', output), JSON.stringify(migrations));
