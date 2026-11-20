// Test-only data builders. Never import from src/.
import { randomUUID } from "node:crypto";
import * as s from "@/db/schema";
import type { Db } from "@/platform/db";

export async function makeUser(
  db: Db,
  role: "customer" | "driver" | "staff",
  over: Partial<typeof s.users.$inferInsert> = {},
) {
  const [u] = await db
    .insert(s.users)
    .values({
      role,
      email: `${role}-${randomUUID().slice(0, 8)}@example.test`,
      passwordHash: "x",
      fullName: `Test ${role}`,
      ...over,
    })
    .returning();
  return u!;
}

export async function makeDriver(db: Db, over: Partial<typeof s.driverProfiles.$inferInsert> = {}) {
  const u = await makeUser(db, "driver");
  const [d] = await db
    .insert(s.driverProfiles)
    .values({
      userId: u.id,
      firstName: "Tunde",
      yearsExperience: 6,
      transmissions: ["automatic", "manual"],
      cities: ["lagos"],
      status: "eligible",
      ...over,
    })
    .returning();
  return { user: u, profile: d! };
}

export const day = (n: number, hour = 9) => {
  const d = new Date(Date.UTC(2027, 0, 10 + n, hour - 1));
  return d;
};

export async function makeBooking(
  db: Db,
  customerId: string,
  over: Partial<typeof s.bookings.$inferInsert> = {},
) {
  const [v] = await db
    .insert(s.customerVehicles)
    .values({ ownerId: customerId, make: "Toyota", model: "Camry", transmission: "automatic" })
    .returning();
  const [b] = await db
    .insert(s.bookings)
    .values({
      ref: `FD-${randomUUID().slice(0, 6).toUpperCase()}`,
      customerId,
      pkg: "full-day",
      vehicleSource: "customer",
      customerVehicleId: v!.id,
      city: "lagos",
      pickupArea: "Lekki Phase 1",
      startsAt: day(0, 8),
      endsAt: day(0, 18),
      duties: "Meetings on the Island",
      shortNotice: false,
      ...over,
    })
    .returning();
  return b!;
}
