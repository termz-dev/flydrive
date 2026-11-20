import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { bookings, handovers } from "@/db/schema";
import { HandoverForm } from "@/modules/booking/CustomerForms";
import { requireRole } from "@/modules/identity/session";
import { getDb } from "@/platform/db";
import { Notice } from "@/ui/blocks";

export const metadata: Metadata = { title: "Vehicle handover" };

export default async function HandoverPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("customer");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const db = getDb();
  const [b] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.customerId, user.id)));
  if (!b) notFound();
  const mine = await db
    .select()
    .from(handovers)
    .where(and(eq(handovers.bookingId, b.id), eq(handovers.party, "customer")));
  const stage = b.status === "confirmed" ? "pickup" : b.status === "in_progress" ? "return" : null;
  const done = stage ? mine.some((h) => h.stage === stage) : false;
  return (
    <div style={{ maxWidth: 640 }}>
      <p>
        <Link href={`/bookings/${b.id}` as Route}>← Booking {b.ref}</Link>
      </p>
      <h1>Vehicle handover</h1>
      {!stage ? (
        <Notice title="Nothing to record right now" tone="pending">
          <p>Pickup can be recorded once the booking is confirmed, and return after pickup.</p>
        </Notice>
      ) : done ? (
        <Notice title={`You've recorded the ${stage}`}>
          <p>Waiting for the driver to record theirs.</p>
        </Notice>
      ) : (
        <div className="form-card">
          <HandoverForm bookingId={b.id} stage={stage} party="customer" />
        </div>
      )}
    </div>
  );
}
