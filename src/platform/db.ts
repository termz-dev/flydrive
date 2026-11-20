import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
import { FeatureUnavailableError } from "./errors";

export type Db = PostgresJsDatabase<typeof schema>;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
export type DbOrTx = Db | Tx;

const g = globalThis as unknown as {
  __flydriveDb?: Db | undefined;
  __flydriveSql?: postgres.Sql | undefined;
};

/**
 * Lazily connects to DATABASE_URL. `prepare: false` keeps it compatible with Supabase's
 * transaction pooler (port 6543), which Vercel functions should use.
 */
export function getDb(): Db {
  if (g.__flydriveDb) return g.__flydriveDb;
  const url = process.env.DATABASE_URL;
  if (!url) throw new FeatureUnavailableError("The database");
  const sql = postgres(url, {
    max: process.env.VERCEL ? 1 : 10,
    prepare: false,
    idle_timeout: 20,
    onnotice: () => {},
  });
  g.__flydriveSql = sql;
  g.__flydriveDb = drizzle(sql, { schema });
  return g.__flydriveDb;
}

export async function closeDb() {
  await g.__flydriveSql?.end({ timeout: 5 });
  g.__flydriveSql = undefined;
  g.__flydriveDb = undefined;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
