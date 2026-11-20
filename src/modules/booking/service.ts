import { randomInt } from "node:crypto";
import { and, desc, eq, inArray, isNull, lt } from "drizzle-orm";
import {
  bookingEvents,
  bookings,
  candidates,
  customerVehicles,
  driverBlocks,
  driverProfiles,
  fleetBlocks,
  fleetVehicles,
  handovers,
  offers,
  payments,
  supportCases,
  users,
} from "@/db/schema";
import { availableDrivers, type City, type Transmission } from "@/modules/drivers/service";
import { notFound } from "@/modules/shared/guards";
import { audit, notify, staffWith } from "@/modules/shared/records";
import type { Db, DbOrTx, Tx } from "@/platform/db";
import { AppError } from "@/platform/errors";
import { transition } from "./transition";

/* Policy defaults. Offer expiry and payment deadline are OPEN; these are conservative defaults. */
export const NOTICE_MS = 3 * 86400e3;
export const OFFER_TTL_MS = 12 * 3600e3;
export const PAYMENT_WINDOW_MS = 24 * 3600e3;

const REF_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export function newRef(): string {
  let s = "FD-";
  for (let i = 0; i < 6; i++) s += REF_CHARS[randomInt(REF_CHARS.length)];
  return s;
}

const isExclusion = (e: unknown) => (e as { cause?: { code?: string } }).cause?.code === "23P01";

/* ------------------------------------------------------------------ request */

export interface RequestInput {
  pkg: "half-day" | "full-day" | "weekly" | "monthly" | "weekend" | "custom";
  vehicleSource: "customer" | "flydrive";
  vehicle?:
    | { make: string; model: string; colour?: string | undefined; transmission: Transmission }
    | undefined;
  customerVehicleId?: string | undefined;
  vehicleClass?: "saloon" | "suv" | "minivan" | undefined;
  city: City;
  pickupArea: string;
  startsAt: Date;
  endsAt: Date;
  duties: string;
  passengers: number;
  overnightOutOfState: boolean;
  accommodationNote?: string | undefined;
  prefersFemaleDriver: boolean;
  notes?: string | undefined;
}

export async function createRequest(db: Db, customerId: string, r: RequestInput, now = new Date()) {
  if (r.startsAt <= now)
    throw new AppError("INVALID_INPUT", "IN_PAST", "The start time must be in the future.", {
      fieldErrors: [{ field: "startsAt", message: "Choose a future time." }],
    });
  if (r.endsAt <= r.startsAt)
    throw new AppError("INVALID_INPUT", "BAD_RANGE", "The end must be after the start.", {
      fieldErrors: [{ field: "endsAt", message: "End must be after start." }],
    });
  if (r.overnightOutOfState && !r.accommodationNote) {
    throw new AppError(
      "INVALID_INPUT",
      "ACCOMMODATION",
      "Tell us where the driver will sleep and freshen up.",
      {
        fieldErrors: [
          { field: "accommodationNote", message: "Required for overnight out-of-state trips." },
        ],
      },
    );
  }
  return db.transaction(async (tx) => {
    let customerVehicleId: string | null = null;
    if (r.vehicleSource === "customer") {
      if (r.customerVehicleId) {
        const [v] = await tx
          .select()
          .from(customerVehicles)
          .where(
            and(
              eq(customerVehicles.id, r.customerVehicleId),
              eq(customerVehicles.ownerId, customerId),
            ),
          );
        if (!v) throw notFound("Vehicle");
        customerVehicleId = v.id;
      } else if (r.vehicle) {
        const [v] = await tx
          .insert(customerVehicles)
          .values({ ownerId: customerId, ...r.vehicle, colour: r.vehicle.colour ?? null })
          .returning();
        customerVehicleId = v!.id;
      } else {
        throw new AppError("INVALID_INPUT", "VEHICLE_REQUIRED", "Tell us about your car.");
      }
    }
    const shortNotice = r.startsAt.getTime() - now.getTime() < NOTICE_MS;
    const [b] = await tx
      .insert(bookings)
      .values({
        ref: newRef(),
        customerId,
        pkg: r.pkg,
        vehicleSource: r.vehicleSource,
        customerVehicleId,
        vehicleClass: r.vehicleSource === "flydrive" ? (r.vehicleClass ?? "saloon") : null,
        city: r.city,
        pickupArea: r.pickupArea,
        startsAt: r.startsAt,
        endsAt: r.endsAt,
        duties: r.duties,
        passengers: r.passengers,
        overnightOutOfState: r.overnightOutOfState,
        accommodationNote: r.accommodationNote ?? null,
        prefersFemaleDriver: r.prefersFemaleDriver,
        notes: r.notes ?? null,
        shortNotice,
      })
      .returning();
    await tx.insert(bookingEvents).values({
      bookingId: b!.id,
      actorId: customerId,
      actorRole: "customer",
      type: "customer.submitted",
      toStatus: "submitted",
      data: { shortNotice },
    });
    await notify(tx, await staffWith(tx, "bookings.manage"), {
      title: shortNotice ? `Short-notice request ${b!.ref}` : `New request ${b!.ref}`,
      body: shortNotice
        ? "Starts within 3 days — check availability by hand."
        : "Set a quote and shortlist drivers.",
      href: `/ops/bookings/${b!.id}`,
    });
    return b!;
  });
}

/* ------------------------------------------------------------------ ops: quote + shortlist */

export async function publishCandidates(
  db: Db,
  staffId: string,
  bookingId: string,
  input: { quoteKobo: number; driverIds: string[]; fleetVehicleId?: string | null },
) {
  if (input.driverIds.length === 0)
    throw new AppError("INVALID_INPUT", "NO_DRIVERS", "Choose at least one driver.");
  if (!Number.isInteger(input.quoteKobo) || input.quoteKobo <= 0)
    throw new AppError("INVALID_INPUT", "BAD_QUOTE", "Enter the agreed price.");
  await db.transaction(async (tx) => {
    const [b] = await tx.select().from(bookings).where(eq(bookings.id, bookingId)).for("update");
    if (!b) throw notFound("Booking");
    const transmission = await bookingTransmission(tx, b);
    const free = await availableDrivers(tx, {
      city: b.city,
      startsAt: b.startsAt,
      endsAt: b.endsAt,
      transmission,
      bookingId,
    });
    const freeIds = new Set(free.map((f) => f.profile.userId));
    const bad = input.driverIds.filter((id) => !freeIds.has(id));
    if (bad.length)
      throw new AppError(
        "CONFLICT",
        "DRIVER_NOT_AVAILABLE",
        "One or more chosen drivers are no longer eligible or free. Refresh the list.",
      );
    let fleetVehicleId: string | null = b.fleetVehicleId;
    if (b.vehicleSource === "flydrive") {
      if (!input.fleetVehicleId)
        throw new AppError(
          "INVALID_INPUT",
          "FLEET_REQUIRED",
          "Choose the car Flydrive will provide.",
        );
      const [v] = await tx
        .select()
        .from(fleetVehicles)
        .where(and(eq(fleetVehicles.id, input.fleetVehicleId), eq(fleetVehicles.active, true)));
      if (!v) throw notFound("Vehicle");
      fleetVehicleId = v.id;
    }
    await tx
      .insert(candidates)
      .values(input.driverIds.map((driverId) => ({ bookingId, driverId, addedBy: staffId })))
      .onConflictDoNothing();
    await transition(tx, {
      bookingId,
      command: "ops.publish_candidates",
      actor: "staff",
      actorId: staffId,
      set: { quoteKobo: input.quoteKobo, fleetVehicleId, handlerId: b.handlerId ?? staffId },
      data: { quoteKobo: input.quoteKobo, drivers: input.driverIds.length },
    });
    await notify(tx, b.customerId, {
      title: `Choose your driver for ${b.ref}`,
      body: "Suitable drivers are ready for you to choose from.",
      href: `/bookings/${b.id}`,
    });
  });
}

async function bookingTransmission(
  tx: DbOrTx,
  b: typeof bookings.$inferSelect,
): Promise<Transmission | null> {
  if (b.customerVehicleId) {
    const [v] = await tx
      .select({ t: customerVehicles.transmission })
      .from(customerVehicles)
      .where(eq(customerVehicles.id, b.customerVehicleId));
    return v?.t ?? null;
  }
  if (b.fleetVehicleId) {
    const [v] = await tx
      .select({ t: fleetVehicles.transmission })
      .from(fleetVehicles)
      .where(eq(fleetVehicles.id, b.fleetVehicleId));
    return v?.t ?? null;
  }
  return null;
}

export async function markNoCandidate(db: Db, staffId: string, bookingId: string, reason: string) {
  await db.transaction(async (tx) => {
    const [b] = await tx.select().from(bookings).where(eq(bookings.id, bookingId));
    if (!b) throw notFound("Booking");
    await transition(tx, {
      bookingId,
      command: "ops.no_candidate",
      actor: "staff",
      actorId: staffId,
      data: { reason },
    });
    await notify(tx, b.customerId, {
      title: `No driver available for ${b.ref}`,
      body: "We couldn't find a suitable driver for those dates. Nothing has been charged.",
      href: `/bookings/${b.id}`,
    });
  });
}

/* ------------------------------------------------------------------ customer: select */

export async function selectDriver(
  db: Db,
  customerId: string,
  bookingId: string,
  driverId: string,
  now = new Date(),
) {
  await db.transaction(async (tx) => {
    const [b] = await tx
      .select()
      .from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.customerId, customerId)))
      .for("update");
    if (!b) throw notFound("Booking");
    const [c] = await tx
      .select()
      .from(candidates)
      .where(and(eq(candidates.bookingId, bookingId), eq(candidates.driverId, driverId)));
    if (!c || c.excludedReason)
      throw new AppError(
        "CONFLICT",
        "NOT_A_CANDIDATE",
        "That driver isn't available for this booking any more.",
      );
    const expiresAt = new Date(
      Math.min(now.getTime() + OFFER_TTL_MS, b.startsAt.getTime() - 3600e3),
    );
    if (expiresAt <= now)
      throw new AppError(
        "CONFLICT",
        "TOO_LATE",
        "This booking starts too soon to send an offer. Contact your Flydrive handler.",
      );
    await transition(tx, {
      bookingId,
      command: "customer.select_driver",
      actor: "customer",
      actorId: customerId,
      set: { selectedDriverId: driverId },
      data: { driverId },
    });
    const [o] = await tx.insert(offers).values({ bookingId, driverId, expiresAt }).returning();
    await notify(tx, driverId, {
      title: `New job offer ${b.ref}`,
      body: "A customer chose you. Review the full job and accept or decline.",
      href: `/driver/offers/${o!.id}`,
    });
  });
}

/* ------------------------------------------------------------------ driver: accept / decline */

export async function respondToOffer(
  db: Db,
  driverId: string,
  offerId: string,
  accept: boolean,
  reason?: string,
  now = new Date(),
) {
  await db.transaction(async (tx) => {
    const [o] = await tx
      .select()
      .from(offers)
      .where(and(eq(offers.id, offerId), eq(offers.driverId, driverId)))
      .for("update");
    if (!o) throw notFound("Offer");
    if (o.status !== "pending")
      throw new AppError(
        "CONFLICT",
        "OFFER_CLOSED",
        "This offer has already been answered or withdrawn.",
      );
    if (o.expiresAt <= now)
      throw new AppError("CONFLICT", "OFFER_EXPIRED", "This offer has expired.");
    const [b] = await tx.select().from(bookings).where(eq(bookings.id, o.bookingId)).for("update");
    if (!b) throw notFound("Booking");

    if (!accept) {
      await tx
        .update(offers)
        .set({ status: "declined", respondedAt: now, declineReason: reason ?? null })
        .where(eq(offers.id, o.id));
      await tx
        .update(candidates)
        .set({ excludedReason: "declined" })
        .where(and(eq(candidates.bookingId, b.id), eq(candidates.driverId, driverId)));
      await transition(tx, {
        bookingId: b.id,
        command: "driver.decline",
        actor: "driver",
        actorId: driverId,
        set: { selectedDriverId: null },
      });
      await notify(tx, b.customerId, {
        title: `Please choose another driver for ${b.ref}`,
        body: "Your chosen driver can't take this job. Nothing has been charged.",
        href: `/bookings/${b.id}`,
      });
      return;
    }

    const paymentDueAt = new Date(
      Math.min(now.getTime() + PAYMENT_WINDOW_MS, b.startsAt.getTime() - 2 * 3600e3),
    );
    if (paymentDueAt <= now)
      throw new AppError(
        "CONFLICT",
        "TOO_LATE",
        "This job starts too soon to accept online. Contact Flydrive operations.",
      );
    await releaseExpiredHolds(tx, now);
    try {
      await tx.insert(driverBlocks).values({
        driverId,
        kind: "hold",
        startsAt: b.startsAt,
        endsAt: b.endsAt,
        bookingId: b.id,
        holdExpiresAt: paymentDueAt,
      });
      if (b.fleetVehicleId) {
        await tx.insert(fleetBlocks).values({
          vehicleId: b.fleetVehicleId,
          kind: "hold",
          startsAt: b.startsAt,
          endsAt: b.endsAt,
          bookingId: b.id,
          holdExpiresAt: paymentDueAt,
        });
      }
    } catch (e) {
      if (isExclusion(e))
        throw new AppError(
          "CONFLICT",
          "TIME_TAKEN",
          "You already have a job or blocked time that overlaps this one.",
        );
      throw e;
    }
    await tx
      .update(offers)
      .set({ status: "accepted", respondedAt: now })
      .where(eq(offers.id, o.id));
    await transition(tx, {
      bookingId: b.id,
      command: "driver.accept",
      actor: "driver",
      actorId: driverId,
      set: { paymentDueAt },
    });
    await notify(tx, b.customerId, {
      title: `Your driver accepted ${b.ref}`,
      body: "Pay to secure the booking. Our team confirms once your payment is checked.",
      href: `/bookings/${b.id}`,
    });
  });
}

/** Releases holds whose payment window has passed (also run by the cron job). */
export async function releaseExpiredHolds(tx: DbOrTx, now = new Date()) {
  await tx
    .update(driverBlocks)
    .set({ releasedAt: now })
    .where(
      and(
        eq(driverBlocks.kind, "hold"),
        isNull(driverBlocks.releasedAt),
        lt(driverBlocks.holdExpiresAt, now),
      ),
    );
  await tx
    .update(fleetBlocks)
    .set({ releasedAt: now })
    .where(
      and(
        eq(fleetBlocks.kind, "hold"),
        isNull(fleetBlocks.releasedAt),
        lt(fleetBlocks.holdExpiresAt, now),
      ),
    );
}

async function releaseBookingBlocks(tx: Tx, bookingId: string, now: Date) {
  await tx
    .update(driverBlocks)
    .set({ releasedAt: now })
    .where(and(eq(driverBlocks.bookingId, bookingId), isNull(driverBlocks.releasedAt)));
  await tx
    .update(fleetBlocks)
    .set({ releasedAt: now })
    .where(and(eq(fleetBlocks.bookingId, bookingId), isNull(fleetBlocks.releasedAt)));
}

/* ------------------------------------------------------------------ ops: verify + confirm */

export async function confirmBooking(db: Db, staffId: string, bookingId: string) {
  await db.transaction(async (tx) => {
    const [b] = await tx.select().from(bookings).where(eq(bookings.id, bookingId)).for("update");
    if (!b) throw notFound("Booking");
    if (b.status !== "payment_review") {
      throw new AppError(
        "CONFLICT",
        "BOOKING_STATE_CHANGED",
        "This booking isn't waiting for payment verification.",
      );
    }
    const [p] = await tx
      .select()
      .from(payments)
      .where(and(eq(payments.bookingId, bookingId), eq(payments.status, "succeeded")))
      .orderBy(desc(payments.updatedAt))
      .limit(1);
    if (!p)
      throw new AppError(
        "CONFLICT",
        "NO_PAYMENT",
        "There's no successful payment on this booking.",
      );
    if (p.amountKobo !== b.quoteKobo || p.currency !== "NGN") {
      throw new AppError(
        "CONFLICT",
        "AMOUNT_MISMATCH",
        "The amount paid doesn't match the quote. Don't confirm — check with the customer.",
      );
    }
    const now = new Date();
    await tx
      .update(payments)
      .set({ verifiedBy: staffId, verifiedAt: now, updatedAt: now })
      .where(eq(payments.id, p.id));
    const h = await tx
      .update(driverBlocks)
      .set({ kind: "assignment", holdExpiresAt: null })
      .where(
        and(
          eq(driverBlocks.bookingId, bookingId),
          eq(driverBlocks.kind, "hold"),
          isNull(driverBlocks.releasedAt),
        ),
      )
      .returning({ id: driverBlocks.id });
    if (h.length === 0) {
      // The hold lapsed (e.g. paid late). Try to re-take the driver's time before confirming.
      try {
        await tx.insert(driverBlocks).values({
          driverId: b.selectedDriverId!,
          kind: "assignment",
          startsAt: b.startsAt,
          endsAt: b.endsAt,
          bookingId,
        });
      } catch (e) {
        if (isExclusion(e))
          throw new AppError(
            "CONFLICT",
            "DRIVER_NOW_BUSY",
            "The driver's time is no longer free. Offer a replacement or refund.",
          );
        throw e;
      }
    }
    if (b.fleetVehicleId) {
      await tx
        .update(fleetBlocks)
        .set({ kind: "assignment", holdExpiresAt: null })
        .where(
          and(
            eq(fleetBlocks.bookingId, bookingId),
            eq(fleetBlocks.kind, "hold"),
            isNull(fleetBlocks.releasedAt),
          ),
        );
    }
    await transition(tx, {
      bookingId,
      command: "ops.confirm",
      actor: "staff",
      actorId: staffId,
      set: { handlerId: b.handlerId ?? staffId },
      data: { paymentId: p.id },
    });
    await audit(
      tx,
      staffId,
      "booking.confirmed",
      { type: "booking", id: bookingId },
      { paymentReference: p.reference },
    );
    await notify(tx, b.customerId, {
      title: `${b.ref} is confirmed`,
      body: "Add the meeting point and a phone number your driver can call.",
      href: `/bookings/${b.id}`,
    });
    if (b.selectedDriverId)
      await notify(tx, b.selectedDriverId, {
        title: `${b.ref} is confirmed`,
        body: "The booking is confirmed. Details are on your assignment page.",
        href: `/driver/assignments/${b.id}`,
      });
  });
}

export async function rejectPayment(db: Db, staffId: string, bookingId: string, reason: string) {
  await db.transaction(async (tx) => {
    const [b] = await tx.select().from(bookings).where(eq(bookings.id, bookingId));
    if (!b) throw notFound("Booking");
    await transition(tx, {
      bookingId,
      command: "ops.reject_payment",
      actor: "staff",
      actorId: staffId,
      data: { reason },
      set: { paymentDueAt: new Date(Date.now() + PAYMENT_WINDOW_MS) },
    });
    await audit(tx, staffId, "payment.rejected", { type: "booking", id: bookingId }, { reason });
    await notify(tx, b.customerId, {
      title: `Payment for ${b.ref} needs attention`,
      body: "We couldn't verify your payment. Your handler will contact you.",
      href: `/bookings/${b.id}`,
    });
  });
}

/* ------------------------------------------------------------------ cancel */

export async function cancelBooking(
  db: Db,
  who: { id: string; role: "customer" | "staff" },
  bookingId: string,
  reason: string,
) {
  await db.transaction(async (tx) => {
    const where =
      who.role === "customer"
        ? and(eq(bookings.id, bookingId), eq(bookings.customerId, who.id))
        : eq(bookings.id, bookingId);
    const [b] = await tx.select().from(bookings).where(where).for("update");
    if (!b) throw notFound("Booking");
    const now = new Date();
    await transition(tx, {
      bookingId,
      command: who.role === "customer" ? "customer.cancel" : "ops.cancel",
      actor: who.role,
      actorId: who.id,
      data: { reason },
    });
    await tx
      .update(offers)
      .set({ status: "withdrawn", respondedAt: now })
      .where(and(eq(offers.bookingId, bookingId), eq(offers.status, "pending")));
    await releaseBookingBlocks(tx, bookingId, now);
    const paid = await tx
      .select({ id: payments.id })
      .from(payments)
      .where(and(eq(payments.bookingId, bookingId), eq(payments.status, "succeeded")));
    if (who.role === "staff")
      await audit(
        tx,
        who.id,
        "booking.cancelled",
        { type: "booking", id: bookingId },
        { reason, paid: paid.length > 0 },
      );
    const msg = paid.length
      ? "Your handler will contact you about the refund."
      : "Nothing has been charged.";
    await notify(tx, b.customerId, {
      title: `${b.ref} was cancelled`,
      body: msg,
      href: `/bookings/${b.id}`,
    });
    if (b.selectedDriverId)
      await notify(tx, b.selectedDriverId, {
        title: `${b.ref} was cancelled`,
        body: "You no longer need to keep this time free.",
        href: "/driver",
      });
  });
}

/* ------------------------------------------------------------------ after confirmation */

export async function setMeetingDetails(
  db: Db,
  customerId: string,
  bookingId: string,
  meetingPoint: string,
  contactPhone: string,
) {
  const r = await db
    .update(bookings)
    .set({ meetingPoint, contactPhone, updatedAt: new Date() })
    .where(
      and(
        eq(bookings.id, bookingId),
        eq(bookings.customerId, customerId),
        inArray(bookings.status, ["confirmed", "in_progress"]),
      ),
    )
    .returning({ ref: bookings.ref, driver: bookings.selectedDriverId });
  if (!r[0])
    throw new AppError(
      "CONFLICT",
      "NOT_CONFIRMED",
      "You can add these once the booking is confirmed.",
    );
  if (r[0].driver)
    await notify(db, r[0].driver, {
      title: `Meeting details for ${r[0].ref}`,
      body: "The customer added the meeting point and contact number.",
      href: `/driver/assignments/${bookingId}`,
    });
}

export async function recordHandover(
  db: Db,
  who: { id: string; role: "customer" | "driver" },
  bookingId: string,
  input: {
    stage: "pickup" | "return";
    conditionNote: string;
    fuelLevel?: string | undefined;
    disputed: boolean;
  },
) {
  await db.transaction(async (tx) => {
    const [b] = await tx.select().from(bookings).where(eq(bookings.id, bookingId)).for("update");
    const allowed =
      b && (who.role === "customer" ? b.customerId === who.id : b.selectedDriverId === who.id);
    if (!b || !allowed) throw notFound("Booking");
    const expected = input.stage === "pickup" ? "confirmed" : "in_progress";
    if (b.status !== expected)
      throw new AppError(
        "CONFLICT",
        "WRONG_STAGE",
        input.stage === "pickup"
          ? "Pickup can be recorded once the booking is confirmed."
          : "Return can be recorded after pickup.",
      );
    const inserted = await tx
      .insert(handovers)
      .values({
        bookingId,
        stage: input.stage,
        party: who.role,
        userId: who.id,
        conditionNote: input.conditionNote,
        fuelLevel: input.fuelLevel ?? null,
        disputed: input.disputed,
      })
      .onConflictDoNothing()
      .returning({ id: handovers.id });
    if (!inserted[0])
      throw new AppError("CONFLICT", "ALREADY_RECORDED", "You've already recorded this handover.");
    if (input.disputed) {
      await tx.insert(supportCases).values({
        bookingId,
        openedBy: who.id,
        kind: "support",
        message: `Handover (${input.stage}) disputed: ${input.conditionNote}`,
      });
      await notify(
        tx,
        [...(await staffWith(tx, "incidents.manage")), ...(b.handlerId ? [b.handlerId] : [])],
        {
          title: `Handover disputed on ${b.ref}`,
          body: "A party disagrees with the car's condition.",
          href: `/ops/bookings/${b.id}`,
        },
      );
    }
    const both = await tx
      .select({ party: handovers.party })
      .from(handovers)
      .where(and(eq(handovers.bookingId, bookingId), eq(handovers.stage, input.stage)));
    if (both.length === 2) {
      await transition(tx, {
        bookingId,
        command: input.stage === "pickup" ? "handover.pickup_complete" : "handover.return_complete",
        actor: "system",
        actorId: null,
      });
      if (input.stage === "return") await releaseBookingBlocksAfterEnd(tx, bookingId);
    }
  });
}

async function releaseBookingBlocksAfterEnd(tx: Tx, bookingId: string) {
  // Completed early: free the driver and car from now on.
  const now = new Date();
  await tx
    .update(driverBlocks)
    .set({ releasedAt: now })
    .where(and(eq(driverBlocks.bookingId, bookingId), isNull(driverBlocks.releasedAt)));
  await tx
    .update(fleetBlocks)
    .set({ releasedAt: now })
    .where(and(eq(fleetBlocks.bookingId, bookingId), isNull(fleetBlocks.releasedAt)));
}

/* ------------------------------------------------------------------ reads */

/** Limited profile shown before payment: first name, experience, training, transmissions. */
export interface CandidateView {
  driverId: string;
  firstName: string;
  yearsExperience: number;
  trainingStatus: string;
  transmissions: string[];
  excluded: boolean;
}

export async function candidateViews(db: DbOrTx, bookingId: string): Promise<CandidateView[]> {
  const rows = await db
    .select({ c: candidates, p: driverProfiles })
    .from(candidates)
    .innerJoin(driverProfiles, eq(driverProfiles.userId, candidates.driverId))
    .where(eq(candidates.bookingId, bookingId));
  return rows.map(({ c, p }) => ({
    driverId: p.userId,
    firstName: p.firstName,
    yearsExperience: p.yearsExperience,
    trainingStatus: p.trainingStatus,
    transmissions: p.transmissions,
    excluded: Boolean(c.excludedReason),
  }));
}

export async function bookingTimeline(db: DbOrTx, bookingId: string) {
  return db
    .select()
    .from(bookingEvents)
    .where(eq(bookingEvents.bookingId, bookingId))
    .orderBy(bookingEvents.createdAt);
}

export async function driverContact(db: DbOrTx, driverId: string) {
  const [u] = await db
    .select({ fullName: users.fullName, phone: users.phone })
    .from(users)
    .where(eq(users.id, driverId));
  return u ?? null;
}
