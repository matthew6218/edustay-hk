export interface PreparedStatement {
  bind(...args: any[]): PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<{ results: T[]; meta: { changes: number } }>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<{ meta: { changes: number } }>;
}

export interface AppDatabase {
  prepare(sql: string): PreparedStatement;
  batch(statements: PreparedStatement[]): Promise<unknown>;
}

export interface ImageStorage {
  put(key: string, bytes: Uint8Array, options: { httpMetadata: { contentType: string } }): Promise<void>;
  get(key: string): Promise<{ body: BodyInit } | null>;
}
