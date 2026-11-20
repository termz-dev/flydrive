// Local demo data. Refuses to run against production. Usage: pnpm db:seed
import { randomBytes } from "node:crypto";
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

if (process.env.APP_ENV === "production") {
  console.error("Refusing to seed demo data in production.");
  process.exit(1);
}
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
const db = drizzle(sql, { schema: s });
const password = process.env.SEED_PASSWORD ?? randomBytes(9).toString("base64url");
const hash = await hashPassword(password);

const ALL = [
  "bookings.manage",
  "drivers.review",
  "payments.verify",
  "bookings.confirm",
  "incidents.manage",
  "audit.read",
  "staff.admin",
] as const;

async function user(
  role: "customer" | "driver" | "staff",
  email: string,
  fullName: string,
  phone: string,
) {
  const [u] = await db
    .insert(s.users)
    .values({ role, email, fullName, phone, passwordHash: hash })
    .onConflictDoNothing()
    .returning();
  return u;
}

const staff = await user("staff", "ops@flydrive.local", "Ops Admin", "+2348000000001");
if (staff)
  await db
    .insert(s.staffPermissions)
    .values(ALL.map((permission) => ({ userId: staff.id, permission })));
await user("customer", "customer@flydrive.local", "Demo Customer", "+2348000000002");

const drivers = [
  {
    first: "Tunde",
    full: "Tunde Adeyemi",
    years: 9,
    t: ["automatic", "manual"],
    c: ["lagos"],
    g: "male",
  },
  {
    first: "Ngozi",
    full: "Ngozi Eze",
    years: 6,
    t: ["automatic"],
    c: ["lagos", "ibadan"],
    g: "female",
  },
  {
    first: "Sola",
    full: "Sola Ogunleye",
    years: 12,
    t: ["manual", "automatic"],
    c: ["ibadan"],
    g: "male",
  },
  { first: "Halima", full: "Halima Bello", years: 4, t: ["automatic"], c: ["lagos"], g: "female" },
] as const;
let n = 10;
for (const d of drivers) {
  const u = await user(
    "driver",
    `${d.first.toLowerCase()}@flydrive.local`,
    d.full,
    `+23480000000${n++}`,
  );
  if (!u) continue;
  await db.insert(s.driverProfiles).values({
    userId: u.id,
    firstName: d.first,
    yearsExperience: d.years,
    transmissions: [...d.t],
    cities: [...d.c],
    gender: d.g,
    status: "eligible",
  });
  await db.insert(s.driverChecks).values(
    (["identity", "licence", "guarantor", "background"] as const).map((kind) => ({
      driverId: u.id,
      kind,
      status: kind === "background" ? ("pending" as const) : ("passed" as const),
      reviewNote: kind === "background" ? null : "Demo data",
      reviewedBy: staff?.id ?? null,
      reviewedAt: kind === "background" ? null : new Date(),
    })),
  );
}
await db
  .insert(s.fleetVehicles)
  .values([
    {
      label: "Toyota Camry (demo)",
      vehicleClass: "saloon",
      transmission: "automatic",
      city: "lagos",
      seats: 4,
    },
    {
      label: "Toyota Highlander (demo)",
      vehicleClass: "suv",
      transmission: "automatic",
      city: "lagos",
      seats: 6,
    },
  ])
  .onConflictDoNothing();
await sql.end();

console.log(`Seeded demo data. Password for every demo account: ${password}
  ops@flydrive.local (staff — you'll set up an authenticator on first sign-in)
  customer@flydrive.local
  tunde@ / ngozi@ / sola@ / halima@flydrive.local (drivers)`);
