// Creates a real staff account. Usage:
//   pnpm staff:create --email ada@flydrive.ng --name "Ada Okafor" --permissions all
//   pnpm staff:create --email ... --name ... --permissions bookings.manage,drivers.review
// Prints a one-time password; the person signs in and sets up their authenticator app.
import { randomBytes } from "node:crypto";
import { parseArgs } from "node:util";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as s from "../src/db/schema";
import { hashPassword } from "../src/modules/identity/password";

// Read .env.local / .env when present (Node 22+), so `pnpm db:*` works without exporting variables.
for (const f of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(f);
  } catch {
    // file not present
  }
}

const ALL = s.staffPermissionEnum.enumValues;
const { values } = parseArgs({
  options: {
    email: { type: "string" },
    name: { type: "string" },
    phone: { type: "string" },
    permissions: { type: "string" },
  },
});
if (!values.email || !values.name || !values.permissions || !process.env.DATABASE_URL) {
  console.error(
    'Usage: DATABASE_URL=... pnpm staff:create --email x --name "Full Name" --permissions all|a,b,c',
  );
  process.exit(1);
}
const perms =
  values.permissions === "all" ? [...ALL] : values.permissions.split(",").map((p) => p.trim());
const bad = perms.filter((p) => !(ALL as readonly string[]).includes(p));
if (bad.length) {
  console.error(`Unknown permissions: ${bad.join(", ")}. Valid: ${ALL.join(", ")}`);
  process.exit(1);
}
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, onnotice: () => {} });
const db = drizzle(sql, { schema: s });
const password = randomBytes(12).toString("base64url");
const [u] = await db
  .insert(s.users)
  .values({
    role: "staff",
    email: values.email.toLowerCase(),
    fullName: values.name,
    phone: values.phone ?? null,
    passwordHash: await hashPassword(password),
  })
  .onConflictDoNothing()
  .returning();
if (!u) {
  console.error("An account with that email already exists.");
  await sql.end();
  process.exit(1);
}
await db
  .insert(s.staffPermissions)
  .values(
    perms.map((permission) => ({ userId: u.id, permission: permission as (typeof ALL)[number] })),
  );
await db.insert(s.auditLog).values({
  actorId: null,
  action: "staff.created",
  targetType: "user",
  targetId: u.id,
  data: { permissions: perms },
});
await sql.end();
console.log(`Created ${values.email}. One-time password (share securely): ${password}`);
