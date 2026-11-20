import { and, eq, isNull } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import { runExpiryJobs } from "@/modules/booking/jobs";
import {
  cancelBooking,
  confirmBooking,
  createRequest,
  publishCandidates,
  recordHandover,
  respondToOffer,
  selectDriver,
} from "@/modules/booking/service";
import { applyAsDriver, reviewCheck } from "@/modules/drivers/service";
import type { PaymentGateway } from "@/modules/payments/gateway";
import { applyVerifiedCharge, startPayment } from "@/modules/payments/service";
import { closeDb, getDb } from "@/platform/db";
import { makeDriver, makeUser } from "./fixtures";

const db = getDb();
afterAll(closeDb);

const inDays = (d: number, h = 9) => new Date(Date.now() + d * 86400e3 + h * 3600e3);

/** Test double: records initialize() calls; never used by application code. */
class FakeGateway implements PaymentGateway {
  calls: { reference: string; amountKobo: number }[] = [];
  async initialize(i: { reference: string; amountKobo: number }) {
    this.calls.push(i);
    return { authorizationUrl: `https://checkout.example/${i.reference}` };
  }
  async verify(): Promise<never> {
    throw new Error("not used");
  }
}

async function status(id: string) {
  const [b] = await db
    .select({ status: s.bookings.status })
    .from(s.bookings)
    .where(eq(s.bookings.id, id));
  return b!.status;
}

describe("full booking flow", () => {
  it("runs request → shortlist → decline → reselect → accept → pay → confirm → handover → complete", async () => {
    const staff = await makeUser(db, "staff");
    const customer = await makeUser(db, "customer");
    const d1 = await makeDriver(db, { firstName: "Ada" });
    const d2 = await makeDriver(db, { firstName: "Bayo" });

    const b = await createRequest(db, customer.id, {
      pkg: "full-day",
      vehicleSource: "customer",
      vehicle: { make: "Toyota", model: "Corolla", transmission: "automatic" },
      city: "lagos",
      pickupArea: "Ikeja GRA",
      startsAt: inDays(5),
      endsAt: inDays(5, 19),
      duties: "Airport pickup then meetings",
      passengers: 2,
      overnightOutOfState: false,
      prefersFemaleDriver: false,
    });
    expect(b.shortNotice).toBe(false);
    expect(b.status).toBe("submitted");

    await publishCandidates(db, staff.id, b.id, {
      quoteKobo: 4_500_000,
      driverIds: [d1.profile.userId, d2.profile.userId],
    });
    expect(await status(b.id)).toBe("candidates_ready");

    // Customer picks Ada, Ada declines → back to choosing, Ada excluded.
    await selectDriver(db, customer.id, b.id, d1.profile.userId);
    const [o1] = await db
      .select()
      .from(s.offers)
      .where(and(eq(s.offers.bookingId, b.id), eq(s.offers.status, "pending")));
    await respondToOffer(db, d1.profile.userId, o1!.id, false, "Busy");
    expect(await status(b.id)).toBe("candidates_ready");
    await expect(selectDriver(db, customer.id, b.id, d1.profile.userId)).rejects.toMatchObject({
      code: "NOT_A_CANDIDATE",
    });

    // Picks Bayo, Bayo accepts → hold placed, payment due.
    await selectDriver(db, customer.id, b.id, d2.profile.userId);
    const [o2] = await db
      .select()
      .from(s.offers)
      .where(and(eq(s.offers.bookingId, b.id), eq(s.offers.status, "pending")));
    await respondToOffer(db, d2.profile.userId, o2!.id, true);
    expect(await status(b.id)).toBe("payment_pending");
    const holds = await db
      .select()
      .from(s.driverBlocks)
      .where(and(eq(s.driverBlocks.bookingId, b.id), isNull(s.driverBlocks.releasedAt)));
    expect(holds).toHaveLength(1);
    expect(holds[0]!.kind).toBe("hold");

    // Another customer can't grab Bayo for an overlapping time: he's held.
    const other = await createRequest(db, customer.id, {
      pkg: "half-day",
      vehicleSource: "customer",
      vehicle: { make: "Kia", model: "Rio", transmission: "automatic" },
      city: "lagos",
      pickupArea: "Yaba",
      startsAt: inDays(5, 12),
      endsAt: inDays(5, 16),
      duties: "Errands",
      passengers: 1,
      overnightOutOfState: false,
      prefersFemaleDriver: false,
    });
    await expect(
      publishCandidates(db, staff.id, other.id, {
        quoteKobo: 2_000_000,
        driverIds: [d2.profile.userId],
      }),
    ).rejects.toMatchObject({ code: "DRIVER_NOT_AVAILABLE" });

    // Payment: start (fake gateway), then a verified charge with the right amount.
    const gw = new FakeGateway();
    const url = await startPayment(db, gw, customer.id, b.id, "http://localhost:3000");
    expect(url).toContain("checkout.example");
    const ref = gw.calls[0]!.reference;
    await expect(confirmBooking(db, staff.id, b.id)).rejects.toMatchObject({
      code: "BOOKING_STATE_CHANGED",
    });
    const r = await applyVerifiedCharge(db, {
      reference: ref,
      status: "success",
      amountKobo: 4_500_000,
      currency: "NGN",
      paidAt: null,
      channel: "card",
      gatewayResponse: "Approved",
    });
    expect(r).toBe("succeeded");
    expect(await status(b.id)).toBe("payment_review");
    // Idempotent: replaying the same charge changes nothing.
    await applyVerifiedCharge(db, {
      reference: ref,
      status: "success",
      amountKobo: 4_500_000,
      currency: "NGN",
      paidAt: null,
      channel: "card",
      gatewayResponse: "Approved",
    });
    expect(await status(b.id)).toBe("payment_review");

    await confirmBooking(db, staff.id, b.id);
    expect(await status(b.id)).toBe("confirmed");
    const [assign] = await db
      .select()
      .from(s.driverBlocks)
      .where(and(eq(s.driverBlocks.bookingId, b.id), isNull(s.driverBlocks.releasedAt)));
    expect(assign!.kind).toBe("assignment");

    // Handover: needs both parties for each stage.
    await recordHandover(db, { id: customer.id, role: "customer" }, b.id, {
      stage: "pickup",
      conditionNote: "Clean, no scratches",
      disputed: false,
    });
    expect(await status(b.id)).toBe("confirmed");
    await expect(
      recordHandover(db, { id: d1.profile.userId, role: "driver" }, b.id, {
        stage: "pickup",
        conditionNote: "x",
        disputed: false,
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await recordHandover(db, { id: d2.profile.userId, role: "driver" }, b.id, {
      stage: "pickup",
      conditionNote: "Agree",
      disputed: false,
    });
    expect(await status(b.id)).toBe("in_progress");
    await recordHandover(db, { id: d2.profile.userId, role: "driver" }, b.id, {
      stage: "return",
      conditionNote: "Returned clean",
      disputed: false,
    });
    await recordHandover(db, { id: customer.id, role: "customer" }, b.id, {
      stage: "return",
      conditionNote: "All good",
      disputed: true,
    });
    expect(await status(b.id)).toBe("completed");
    const cases = await db.select().from(s.supportCases).where(eq(s.supportCases.bookingId, b.id));
    expect(cases).toHaveLength(1);

    const events = await db
      .select()
      .from(s.bookingEvents)
      .where(eq(s.bookingEvents.bookingId, b.id));
    expect(events.map((e) => e.type)).toContain("ops.confirm");
  });

  it("won't let ops confirm when the amount paid differs from the quote", async () => {
    const staff = await makeUser(db, "staff");
    const customer = await makeUser(db, "customer");
    const d = await makeDriver(db);
    const b = await createRequest(db, customer.id, {
      pkg: "half-day",
      vehicleSource: "customer",
      vehicle: { make: "Honda", model: "Accord", transmission: "automatic" },
      city: "lagos",
      pickupArea: "VI",
      startsAt: inDays(9),
      endsAt: inDays(9, 14),
      duties: "x",
      passengers: 1,
      overnightOutOfState: false,
      prefersFemaleDriver: false,
    });
    await publishCandidates(db, staff.id, b.id, {
      quoteKobo: 3_000_000,
      driverIds: [d.profile.userId],
    });
    await selectDriver(db, customer.id, b.id, d.profile.userId);
    const [o] = await db.select().from(s.offers).where(eq(s.offers.bookingId, b.id));
    await respondToOffer(db, d.profile.userId, o!.id, true);
    const gw = new FakeGateway();
    await startPayment(db, gw, customer.id, b.id, "http://x");
    await applyVerifiedCharge(db, {
      reference: gw.calls[0]!.reference,
      status: "success",
      amountKobo: 100,
      currency: "NGN",
      paidAt: null,
      channel: null,
      gatewayResponse: null,
    });
    // Mismatched amount: booking stays awaiting payment and needs a person.
    expect(await status(b.id)).toBe("payment_pending");
  });

  it("expires unanswered offers and unpaid holds", async () => {
    const staff = await makeUser(db, "staff");
    const customer = await makeUser(db, "customer");
    const d = await makeDriver(db);
    const b = await createRequest(db, customer.id, {
      pkg: "weekly",
      vehicleSource: "customer",
      vehicle: { make: "Lexus", model: "RX", transmission: "automatic" },
      city: "lagos",
      pickupArea: "Ikoyi",
      startsAt: inDays(12),
      endsAt: inDays(18),
      duties: "School runs",
      passengers: 3,
      overnightOutOfState: false,
      prefersFemaleDriver: false,
    });
    await publishCandidates(db, staff.id, b.id, {
      quoteKobo: 25_000_000,
      driverIds: [d.profile.userId],
    });
    await selectDriver(db, customer.id, b.id, d.profile.userId);
    const later = new Date(Date.now() + 13 * 3600e3);
    const r1 = await runExpiryJobs(db, later);
    expect(r1.offersExpired).toBeGreaterThanOrEqual(1);
    expect(await status(b.id)).toBe("candidates_ready");

    // Second driver accepts, then doesn't get paid in time.
    const d2 = await makeDriver(db);
    await publishCandidates(db, staff.id, b.id, {
      quoteKobo: 25_000_000,
      driverIds: [d2.profile.userId],
    });
    await selectDriver(db, customer.id, b.id, d2.profile.userId);
    const [o] = await db
      .select()
      .from(s.offers)
      .where(and(eq(s.offers.bookingId, b.id), eq(s.offers.status, "pending")));
    await respondToOffer(db, d2.profile.userId, o!.id, true);
    await runExpiryJobs(db, new Date(Date.now() + 25 * 3600e3));
    expect(await status(b.id)).toBe("candidates_ready");
    const active = await db
      .select()
      .from(s.driverBlocks)
      .where(and(eq(s.driverBlocks.bookingId, b.id), isNull(s.driverBlocks.releasedAt)));
    expect(active).toHaveLength(0);
  });

  it("flags short-notice requests and lets customers cancel before paying", async () => {
    const customer = await makeUser(db, "customer");
    const b = await createRequest(db, customer.id, {
      pkg: "half-day",
      vehicleSource: "flydrive",
      vehicleClass: "suv",
      city: "ibadan",
      pickupArea: "Bodija",
      startsAt: inDays(1),
      endsAt: inDays(1, 14),
      duties: "Wedding",
      passengers: 4,
      overnightOutOfState: false,
      prefersFemaleDriver: true,
    });
    expect(b.shortNotice).toBe(true);
    const stranger = await makeUser(db, "customer");
    await expect(
      cancelBooking(db, { id: stranger.id, role: "customer" }, b.id, "x"),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await cancelBooking(db, { id: customer.id, role: "customer" }, b.id, "Plans changed");
    expect(await status(b.id)).toBe("cancelled");
  });
});

describe("driver vetting", () => {
  it("becomes eligible only when identity, licence and guarantor pass", async () => {
    const staff = await makeUser(db, "staff");
    const id = await applyAsDriver(db, {
      fullName: "Chika Obi",
      firstName: "Chika",
      email: `chika-${Date.now()}@example.test`,
      phone: `+23480${Date.now().toString().slice(-8)}`,
      password: "long-enough-pass",
      yearsExperience: 8,
      transmissions: ["manual"],
      cities: ["ibadan"],
      gender: "female",
    });
    const checks = await db.select().from(s.driverChecks).where(eq(s.driverChecks.driverId, id));
    expect(checks).toHaveLength(4);
    const get = async () =>
      (await db.select().from(s.driverProfiles).where(eq(s.driverProfiles.userId, id)))[0]!.status;
    for (const kind of ["identity", "licence"] as const) {
      await reviewCheck(db, staff.id, {
        checkId: checks.find((c) => c.kind === kind)!.id,
        status: "passed",
        note: "Sighted",
      });
    }
    expect(await get()).toBe("under_review");
    await reviewCheck(db, staff.id, {
      checkId: checks.find((c) => c.kind === "guarantor")!.id,
      status: "passed",
      note: "Called guarantor",
    });
    expect(await get()).toBe("eligible");
    await reviewCheck(db, staff.id, {
      checkId: checks.find((c) => c.kind === "licence")!.id,
      status: "failed",
      note: "Expired",
    });
    expect(await get()).toBe("under_review");
  });
});
