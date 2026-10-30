import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

export async function migrate(client) {
  const directory = new URL('../drizzle/', import.meta.url);
  const journal = JSON.parse(await readFile(new URL('meta/_journal.json', directory), 'utf8'));
  await client.execute('CREATE TABLE IF NOT EXISTS edustay_migrations (name TEXT PRIMARY KEY, hash TEXT NOT NULL, applied_at TEXT NOT NULL)');
  for (const { tag } of journal.entries) {
    const sql = await readFile(new URL(`${tag}.sql`, directory), 'utf8');
    const hash = createHash('sha256').update(sql.replaceAll('\r\n', '\n')).digest('hex');
    const transaction = await client.transaction('write');
    try {
      const applied = await transaction.execute({ sql: 'SELECT hash FROM edustay_migrations WHERE name=?', args: [tag] });
      if (applied.rows.length) {
        if (applied.rows[0].hash !== hash) throw new Error(`Applied migration ${tag} has changed.`);
      } else {
        for (const statement of sql.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean)) {
          await transaction.execute(statement);
        }
        await transaction.execute({ sql: 'INSERT INTO edustay_migrations (name,hash,applied_at) VALUES (?,?,?)', args: [tag, hash, new Date().toISOString()] });
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally { transaction.close(); }
  }
}
