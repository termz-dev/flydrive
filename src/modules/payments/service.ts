import { randomBytes } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { bookings, payments, users, webhookEvents } from "@/db/schema";
import { transition } from "@/modules/booking/transition";
import { notFound } from "@/modules/shared/guards";
import { audit, notify, staffWith } from "@/modules/shared/records";
import type { Db } from "@/platform/db";
import { AppError } from "@/platform/errors";
import type { PaymentGateway, VerifiedCharge } from "./gateway";

/** Starts a Paystack checkout for a booking whose driver has accepted. Returns the redirect URL. */
export async function startPayment(
  db: Db,
  gateway: PaymentGateway,
  customerId: string,
  bookingId: string,
  baseUrl: string,
): Promise<string> {
  const [row] = await db
    .select({ b: bookings, email: users.email })
    .from(bookings)
    .innerJoin(users, eq(users.id, bookings.customerId))
    .where(and(eq(bookings.id, bookingId), eq(bookings.customerId, customerId)));
  if (!row) throw notFound("Booking");
  const { b } = row;
  if (b.status !== "payment_pending")
    throw new AppError("CONFLICT", "NOT_PAYABLE", "This booking isn't waiting for payment.");
  if (!b.quoteKobo)
    throw new AppError("CONFLICT", "NO_QUOTE", "This booking has no agreed price yet.");
  if (b.paymentDueAt && b.paymentDueAt <= new Date())
    throw new AppError(
      "CONFLICT",
      "PAYMENT_WINDOW_CLOSED",
      "The payment window has closed. Please choose a driver again.",
    );

  const reference = `${b.ref}-${randomBytes(4).toString("hex")}`;
  await db.insert(payments).values({ bookingId: b.id, reference, amountKobo: b.quoteKobo });
  const { authorizationUrl } = await gateway.initialize({
    email: row.email,
    amountKobo: b.quoteKobo,
    reference,
    callbackUrl: `${baseUrl.replace(/\/$/, "")}/bookings/${b.id}/payment`,
    metadata: { booking_ref: b.ref },
  });
  return authorizationUrl;
}

/**
 * Applies a verified charge to our records. Idempotent: safe to call from the webhook and the
 * customer's return page for the same reference. Never trusts the webhook body for amounts —
 * callers pass the result of gateway.verify().
 */
export async function applyVerifiedCharge(
  db: Db,
  charge: VerifiedCharge,
): Promise<"succeeded" | "failed" | "pending" | "ignored"> {
  return db.transaction(async (tx) => {
    const [p] = await tx
      .select()
      .from(payments)
      .where(eq(payments.reference, charge.reference))
      .for("update");
    if (!p) return "ignored";
    const summary = {
      channel: charge.channel,
      paid_at: charge.paidAt,
      gateway_response: charge.gatewayResponse,
    };
    if (charge.status === "success") {
      if (p.status === "succeeded") return "succeeded";
      const mismatch = charge.amountKobo !== p.amountKobo || charge.currency !== p.currency;
      await tx
        .update(payments)
        .set({
          status: "succeeded",
          providerSummary: { ...summary, amount_mismatch: mismatch },
          updatedAt: new Date(),
        })
        .where(eq(payments.id, p.id));
      const [b] = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.id, p.bookingId))
        .for("update");
      if (b?.status === "payment_pending" && !mismatch) {
        await transition(tx, {
          bookingId: b.id,
          command: "system.payment_succeeded",
          actor: "system",
          actorId: null,
          data: { reference: p.reference },
        });
        await notify(
          tx,
          [...(await staffWith(tx, "payments.verify")), ...(b.handlerId ? [b.handlerId] : [])],
          {
            title: `Payment received for ${b.ref}`,
            body: "Verify the payment and confirm the booking.",
            href: `/ops/bookings/${b.id}`,
          },
        );
      } else if (b) {
        // Paid after the window closed, or amount differs: a person must decide (refund / re-offer).
        await audit(
          tx,
          null,
          "payment.needs_attention",
          { type: "booking", id: b.id },
          { reference: p.reference, status: b.status, mismatch },
        );
        await notify(tx, await staffWith(tx, "payments.verify"), {
          title: `Payment needs attention on ${b.ref}`,
          body: mismatch
            ? "Amount paid doesn't match the quote."
            : "Paid after the payment window closed.",
          href: `/ops/bookings/${b.id}`,
        });
      }
      return "succeeded";
    }
    if (charge.status === "failed" || charge.status === "abandoned") {
      if (p.status === "initialized") {
        await tx
          .update(payments)
          .set({ status: charge.status, providerSummary: summary, updatedAt: new Date() })
          .where(eq(payments.id, p.id));
      }
      return "failed";
    }
    return "pending";
  });
}

/** Stores a webhook event once. Returns false if it was already received. */
export async function recordWebhook(
  db: Db,
  provider: string,
  eventKey: string,
  eventType: string,
  payload: unknown,
): Promise<string | null> {
  const r = await db
    .insert(webhookEvents)
    .values({ provider, eventKey, eventType, payload: payload as object })
    .onConflictDoNothing()
    .returning({ id: webhookEvents.id });
  return r[0]?.id ?? null;
}

export async function markWebhook(db: Db, id: string, error?: string) {
  await db
    .update(webhookEvents)
    .set({ processedAt: new Date(), error: error ?? null })
    .where(eq(webhookEvents.id, id));
}

export async function latestPayment(db: Db, bookingId: string) {
  const [p] = await db
    .select()
    .from(payments)
    .where(eq(payments.bookingId, bookingId))
    .orderBy(desc(payments.createdAt))
    .limit(1);
  return p ?? null;
}
