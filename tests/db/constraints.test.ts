import { eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import { transition } from "@/modules/booking/transition";
import { closeDb, getDb } from "@/platform/db";
import { day, makeBooking, makeDriver, makeUser } from "./fixtures";

const db = getDb();
afterAll(closeDb);

const pgCode = (e: unknown) =>
  (e as { cause?: { code?: string }; code?: string }).cause?.code ?? (e as { code?: string }).code;

describe("driver time blocks", () => {
  it("rejects overlapping active blocks, including payment holds", async () => {
    const { profile } = await makeDriver(db);
    await db.insert(s.driverBlocks).values({
      driverId: profile.userId,
      kind: "hold",
      startsAt: day(1, 8),
      endsAt: day(1, 18),
      holdExpiresAt: day(0),
    });
    const err = await db
      .insert(s.driverBlocks)
      .values({
        driverId: profile.userId,
        kind: "hold",
        startsAt: day(1, 12),
        endsAt: day(1, 20),
        holdExpiresAt: day(0),
      })
      .catch((e: unknown) => e);
    expect(pgCode(err)).toBe("23P01"); // exclusion_violation
  });

  it("allows back-to-back and released blocks", async () => {
    const { profile } = await makeDriver(db);
    const [a] = await db
      .insert(s.driverBlocks)
      .values({
        driverId: profile.userId,
        kind: "assignment",
        startsAt: day(2, 8),
        endsAt: day(2, 12),
      })
      .returning();
    await db.insert(s.driverBlocks).values({
      driverId: profile.userId,
      kind: "assignment",
      startsAt: day(2, 12),
      endsAt: day(2, 16),
    });
    await db
      .update(s.driverBlocks)
      .set({ releasedAt: new Date() })
      .where(eq(s.driverBlocks.id, a!.id));
    await expect(
      db.insert(s.driverBlocks).values({
        driverId: profile.userId,
        kind: "unavailable",
        startsAt: day(2, 9),
        endsAt: day(2, 11),
      }),
    ).resolves.toBeDefined();
  });

  it("requires an expiry on holds", async () => {
    const { profile } = await makeDriver(db);
    const err = await db
      .insert(s.driverBlocks)
      .values({ driverId: profile.userId, kind: "hold", startsAt: day(3), endsAt: day(3, 18) })
      .catch((e: unknown) => e);
    expect(pgCode(err)).toBe("23514"); // check_violation
  });
});

describe("offers", () => {
  it("allows only one pending offer per booking", async () => {
    const c = await makeUser(db, "customer");
    const b = await makeBooking(db, c.id);
    const d1 = await makeDriver(db);
    const d2 = await makeDriver(db);
    await db
      .insert(s.offers)
      .values({ bookingId: b.id, driverId: d1.profile.userId, expiresAt: day(0) });
    const err = await db
      .insert(s.offers)
      .values({ bookingId: b.id, driverId: d2.profile.userId, expiresAt: day(0) })
      .catch((e: unknown) => e);
    expect(pgCode(err)).toBe("23505");
  });
});

describe("bookings", () => {
  it("requires a vehicle that matches the vehicle source", async () => {
    const c = await makeUser(db, "customer");
    const err = await makeBooking(db, c.id, {
      vehicleSource: "flydrive",
      vehicleClass: null,
    }).catch((e: unknown) => e);
    expect(pgCode(err)).toBe("23514");
  });

  it("applies allowed transitions and records events", async () => {
    const c = await makeUser(db, "customer");
    const b = await makeBooking(db, c.id);
    const r = await db.transaction((tx) =>
      transition(tx, {
        bookingId: b.id,
        command: "ops.publish_candidates",
        actor: "staff",
        actorId: null,
      }),
    );
    expect(r).toEqual({ from: "submitted", to: "candidates_ready" });
    const events = await db
      .select()
      .from(s.bookingEvents)
      .where(eq(s.bookingEvents.bookingId, b.id));
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      type: "ops.publish_candidates",
      toStatus: "candidates_ready",
    });
  });

  it("refuses transitions from the wrong state or by the wrong actor", async () => {
    const c = await makeUser(db, "customer");
    const b = await makeBooking(db, c.id);
    await expect(
      db.transaction((tx) =>
        transition(tx, { bookingId: b.id, command: "ops.confirm", actor: "staff", actorId: null }),
      ),
    ).rejects.toMatchObject({ code: "BOOKING_STATE_CHANGED" });
    await expect(
      db.transaction((tx) =>
        transition(tx, {
          bookingId: b.id,
          command: "ops.confirm",
          actor: "customer",
          actorId: c.id,
        }),
      ),
    ).rejects.toMatchObject({ code: "TRANSITION_FORBIDDEN" });
  });

  it("lets only one of two concurrent identical commands win", async () => {
    const c = await makeUser(db, "customer");
    const b = await makeBooking(db, c.id, { status: "candidates_ready" });
    const attempt = () =>
      db.transaction((tx) =>
        transition(tx, {
          bookingId: b.id,
          command: "customer.select_driver",
          actor: "customer",
          actorId: c.id,
        }),
      );
    const results = await Promise.allSettled([attempt(), attempt()]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((r) => r.status === "rejected")).toHaveLength(1);
  });
});

describe("audit trail", () => {
  it("is append-only", async () => {
    const [row] = await db
      .insert(s.auditLog)
      .values({ action: "test", targetType: "test" })
      .returning();
    await expect(db.delete(s.auditLog).where(eq(s.auditLog.id, row!.id))).rejects.toBeDefined();
  });
});
