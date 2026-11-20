import { and, eq, inArray, sql } from "drizzle-orm";
import { bookingEvents, bookings } from "@/db/schema";
import { AppError } from "@/platform/errors";
import type { Tx } from "@/platform/db";
import { TRANSITIONS, type Actor, type BookingStatus, type Command } from "./states";

export interface TransitionInput {
  bookingId: string;
  command: Command;
  actor: Actor;
  actorId: string | null;
  data?: Record<string, unknown>;
  /** Extra columns to set in the same update (e.g. selectedDriverId, paymentDueAt). */
  set?: Partial<typeof bookings.$inferInsert>;
}

/**
 * Applies a command atomically: the update succeeds only if the booking is still in an allowed
 * "from" status. Returns the previous and new status. Must run inside a transaction.
 */
export async function transition(tx: Tx, input: TransitionInput) {
  const rule = TRANSITIONS[input.command];
  if (!rule.actors.includes(input.actor)) {
    throw new AppError("FORBIDDEN", "TRANSITION_FORBIDDEN", "You can't do that on this booking.");
  }
  const [before] = await tx
    .select({ status: bookings.status })
    .from(bookings)
    .where(eq(bookings.id, input.bookingId))
    .for("update");
  if (!before) throw new AppError("NOT_FOUND", "BOOKING_NOT_FOUND", "Booking not found.");

  const updated = await tx
    .update(bookings)
    .set({
      ...input.set,
      status: rule.to,
      version: sql`${bookings.version} + 1`,
      updatedAt: new Date(),
    })
    .where(
      and(eq(bookings.id, input.bookingId), inArray(bookings.status, rule.from as BookingStatus[])),
    )
    .returning({ status: bookings.status });

  if (updated.length === 0) {
    throw new AppError(
      "CONFLICT",
      "BOOKING_STATE_CHANGED",
      "This booking has changed since you opened it. Refresh and try again.",
    );
  }

  await tx.insert(bookingEvents).values({
    bookingId: input.bookingId,
    actorId: input.actorId,
    actorRole: input.actor,
    type: input.command,
    fromStatus: before.status,
    toStatus: rule.to,
    data: input.data ?? null,
  });
  return { from: before.status as BookingStatus, to: rule.to };
}
