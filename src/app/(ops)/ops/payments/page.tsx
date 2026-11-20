import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { desc, eq } from "drizzle-orm";
import { bookings, payments } from "@/db/schema";
import { requireRole } from "@/modules/identity/session";
import { fmtDateTime, naira } from "@/modules/shared/records";
import { getDb } from "@/platform/db";
import { StatusBadge } from "@/ui/StatusBadge";

export const metadata: Metadata = { title: "Payments" };

export default async function OpsPayments() {
  await requireRole("staff", { permission: "payments.verify" });
  const db = getDb();
  const review = await db
    .select()
    .from(bookings)
    .where(eq(bookings.status, "payment_review"))
    .orderBy(bookings.updatedAt);
  const recent = await db
    .select({ p: payments, ref: bookings.ref, status: bookings.status, bid: bookings.id })
    .from(payments)
    .innerJoin(bookings, eq(bookings.id, payments.bookingId))
    .orderBy(desc(payments.createdAt))
    .limit(50);
  return (
    <>
      <h1>Payments</h1>
      <section className="panel">
        <h2>Waiting for verification ({review.length})</h2>
        {review.length === 0 ? (
          <p className="empty">Nothing to verify.</p>
        ) : (
          <ul>
            {review.map((b) => (
              <li key={b.id}>
                <Link href={`/ops/bookings/${b.id}` as Route}>{b.ref}</Link> ·{" "}
                {b.quoteKobo ? naira(b.quoteKobo) : ""}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="panel table-wrap">
        <h2>Recent payment attempts</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">Booking</th>
              <th scope="col">Reference</th>
              <th scope="col">Amount</th>
              <th scope="col">Payment</th>
              <th scope="col">Booking status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(({ p, ref, status, bid }) => (
              <tr key={p.id}>
                <td>{fmtDateTime(p.createdAt)}</td>
                <td>
                  <Link href={`/ops/bookings/${bid}` as Route}>{ref}</Link>
                </td>
                <td className="mono">{p.reference}</td>
                <td>{naira(p.amountKobo)}</td>
                <td>
                  {p.status}
                  {p.verifiedAt ? " · verified" : ""}
                </td>
                <td>
                  <StatusBadge status={status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
