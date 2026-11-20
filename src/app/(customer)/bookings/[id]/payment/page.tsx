import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { bookings, payments } from "@/db/schema";
import { requireRole } from "@/modules/identity/session";
import { getGateway } from "@/modules/payments/gateway";
import { applyVerifiedCharge } from "@/modules/payments/service";
import { getDb } from "@/platform/db";
import { AppError } from "@/platform/errors";
import { Notice } from "@/ui/blocks";

export const metadata: Metadata = { title: "Payment" };

/**
 * Paystack sends the customer back here with ?reference=. We verify with Paystack's API (never
 * trusting the query string) and apply the result idempotently — the webhook may have already.
 */
export default async function PaymentReturnPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireRole("customer");
  const { id } = await params;
  const { reference } = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const db = getDb();
  const [b] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.customerId, user.id)));
  if (!b) notFound();

  let outcome: "succeeded" | "failed" | "pending" | "ignored" | "error" = "pending";
  if (reference) {
    const [p] = await db
      .select()
      .from(payments)
      .where(and(eq(payments.reference, reference), eq(payments.bookingId, b.id)));
    if (!p) notFound();
    try {
      outcome = await applyVerifiedCharge(db, await getGateway().verify(reference));
    } catch (e) {
      outcome = e instanceof AppError ? "error" : "error";
    }
  }
  const back = `/bookings/${b.id}` as Route;
  return (
    <div style={{ maxWidth: 640 }}>
      <h1>Payment for {b.ref}</h1>
      {outcome === "succeeded" ? (
        <Notice title="Payment received">
          <p>
            Thank you. Our team will verify it and confirm your booking — you&apos;ll be notified.
            It isn&apos;t confirmed yet.
          </p>
        </Notice>
      ) : outcome === "failed" ? (
        <Notice title="Payment didn't go through" tone="pending">
          <p>Nothing was taken. You can try again from your booking page.</p>
        </Notice>
      ) : (
        <Notice title="We're still waiting to hear from Paystack" tone="pending">
          <p>This can take a minute. Don&apos;t pay again — check your booking page shortly.</p>
        </Notice>
      )}
      <p>
        <Link className="button" href={back}>
          Back to booking
        </Link>
      </p>
    </div>
  );
}
