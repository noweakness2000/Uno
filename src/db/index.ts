import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

/**
 * Lazy DB client — app still boots without DATABASE_URL (demo / local mode).
 * Auth and progress APIs require DATABASE_URL at request time.
 */
function createDb() {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Configure Postgres to enable auth and progress sync."
    );
  }
  const client = postgres(connectionString, { max: 10, prepare: false });
  return drizzle(client, { schema });
}

let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}

export function hasDatabase() {
  return Boolean(connectionString);
}

export type Db = ReturnType<typeof createDb>;
