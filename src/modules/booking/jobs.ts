import { and, eq, lt } from "drizzle-orm";
import { bookings, candidates, offers } from "@/db/schema";
import { pruneRateLimits } from "@/modules/identity/rate-limit";
import { createLogger } from "@/platform/logger";
import { notify } from "@/modules/shared/records";
import type { Db } from "@/platform/db";
import { releaseExpiredHolds } from "./service";
import { transition } from "./transition";

const log = createLogger("info");

/** Time-based housekeeping. Run by Vercel Cron (/api/cron/tick) and by sweepIfDue(). */
export async function runExpiryJobs(db: Db, now = new Date()) {
  let offersExpired = 0;
  let paymentsExpired = 0;

  const staleOffers = await db
    .select()
    .from(offers)
    .where(and(eq(offers.status, "pending"), lt(offers.expiresAt, now)));
  for (const o of staleOffers) {
    await db.transaction(async (tx) => {
      const r = await tx
        .update(offers)
        .set({ status: "expired", respondedAt: now })
        .where(and(eq(offers.id, o.id), eq(offers.status, "pending")))
        .returning();
      if (!r[0]) return;
      await tx
        .update(candidates)
        .set({ excludedReason: "no_response" })
        .where(and(eq(candidates.bookingId, o.bookingId), eq(candidates.driverId, o.driverId)));
      const [b] = await tx.select().from(bookings).where(eq(bookings.id, o.bookingId));
      if (b?.status === "offer_pending") {
        await transition(tx, {
          bookingId: b.id,
          command: "system.offer_expired",
          actor: "system",
          actorId: null,
          set: { selectedDriverId: null },
        });
        await notify(tx, b.customerId, {
          title: `Please choose another driver for ${b.ref}`,
          body: "Your chosen driver didn't respond in time. Nothing has been charged.",
          href: `/bookings/${b.id}`,
        });
      }
      offersExpired++;
    });
  }

  const overdue = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.status, "payment_pending"), lt(bookings.paymentDueAt, now)));
  for (const b of overdue) {
    await db.transaction(async (tx) => {
      await transition(tx, {
        bookingId: b.id,
        command: "system.payment_window_expired",
        actor: "system",
        actorId: null,
        set: { selectedDriverId: null, paymentDueAt: null },
      });
      await notify(tx, b.customerId, {
        title: `Payment window closed for ${b.ref}`,
        body: "The driver's time was released. You can choose a driver again.",
        href: `/bookings/${b.id}`,
      });
      if (b.selectedDriverId)
        await notify(tx, b.selectedDriverId, {
          title: `${b.ref} wasn't paid in time`,
          body: "You no longer need to keep this time free.",
          href: "/driver",
        });
      paymentsExpired++;
    });
  }
  await db.transaction((tx) => releaseExpiredHolds(tx, now));
  await pruneRateLimits();
  return { offersExpired, paymentsExpired };
}

let lastSweep = 0;

/**
 * Runs the expiry jobs at most once a minute per server instance, on page loads. Vercel's Hobby
 * plan only allows a daily cron, so this keeps statuses current between cron runs. Actions
 * already refuse expired offers and closed payment windows, so this only tidies statuses.
 */
export async function sweepIfDue(db: Db): Promise<void> {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  try {
    await runExpiryJobs(db);
  } catch (err) {
    log.error("expiry sweep failed", {
      module: "booking",
      error: err instanceof Error ? err : String(err),
    });
  }
}
