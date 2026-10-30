import { getClient } from "./client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export function getDb() {
  const client = getClient();
  if (!client) throw new Error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.");
  return drizzle(client, { schema });
}
