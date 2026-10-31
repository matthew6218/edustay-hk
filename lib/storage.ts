import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { get, put } from '@vercel/blob';

import type { ImageStorage } from '../db/contracts';

function pathname(key: string) {
  if (!/^[a-zA-Z0-9-]+$/.test(key)) throw new Error('Invalid image key.');
  return `media/${key}`;
}

export function getImageStorage(): ImageStorage | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return {
    async put(key, bytes, options) {
      await put(pathname(key), Buffer.from(bytes), {
        access: 'private', addRandomSuffix: false,
        contentType: options.httpMetadata.contentType,
      });
    },
    async get(key) {
      const value = await get(pathname(key), { access: 'private', useCache: false });
      return value?.statusCode === 200 ? { body: value.stream } : null;
    },
  };
  if (process.env.VERCEL) return undefined;
  return {
    async put(key, bytes) {
      pathname(key);
      await mkdir('.data/media', { recursive: true });
      await writeFile(join('.data/media', key), bytes, { flag: 'wx' });
    },
    async get(key) {
      pathname(key);
      try { return { body: Uint8Array.from(await readFile(join('.data/media', key))) }; }
      catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null; throw error; }
    },
  };
}
