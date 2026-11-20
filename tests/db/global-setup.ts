import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

/** Resets the test database to an empty schema and applies every migration. */
export default async function setup() {
  const url = process.env.DATABASE_URL_TEST;
  if (!url) throw new Error("Set DATABASE_URL_TEST to a disposable Postgres database");
  if (!/test/i.test(url)) throw new Error("DATABASE_URL_TEST must point at a *test* database");
  const sql = postgres(url, { max: 1, onnotice: () => {} });
  await sql.unsafe(
    "drop schema if exists public cascade; drop schema if exists drizzle cascade; create schema public;",
  );
  await migrate(drizzle(sql), { migrationsFolder: "drizzle" });
  await sql.end();
}
