// Applies drizzle/*.sql to DATABASE_URL. Usage: pnpm db:migrate
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// Read .env.local / .env when present (Node 22+), so `pnpm db:*` works without exporting variables.
for (const f of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(f);
  } catch {
    // file not present
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
const client = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
await migrate(drizzle(client), { migrationsFolder: "drizzle" });
await client.end();
console.log("migrations applied");
