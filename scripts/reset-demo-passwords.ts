// LOCAL ONLY: sets one password on every demo account (@flydrive.local) and signs them out.
// Refuses to run in production. Usage: pnpm demo:password <new-password>
import { inArray, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as s from "../src/db/schema";
import { hashPassword } from "../src/modules/identity/password";

for (const f of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(f);
  } catch {
    // file not present
  }
}
if (process.env.APP_ENV === "production" || process.env.VERCEL) {
  console.error("Refusing to reset passwords outside local development.");
  process.exit(1);
}
const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error("Usage: pnpm demo:password <new-password>   (at least 10 characters)");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, onnotice: () => {} });
const db = drizzle(sql, { schema: s });
const updated = await db
  .update(s.users)
  .set({ passwordHash: await hashPassword(pw) })
  .where(like(s.users.email, "%@flydrive.local"))
  .returning({ id: s.users.id, email: s.users.email });
await db.delete(s.sessions).where(
  inArray(
    s.sessions.userId,
    updated.map((u) => u.id),
  ),
);
console.log(
  `Updated ${updated.length} demo accounts:\n  ${updated.map((u) => u.email).join("\n  ")}`,
);
await sql.end();
