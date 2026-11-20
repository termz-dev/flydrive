import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { bookings, supportCases } from "@/db/schema";
import { SupportForm } from "@/modules/booking/CustomerForms";
import { requireRole } from "@/modules/identity/session";
import { fmtDateTime } from "@/modules/shared/records";
import { getDb } from "@/platform/db";

export const metadata: Metadata = { title: "Support" };

export default async function SupportPage() {
  const user = await requireRole("customer");
  const db = getDb();
  const mine = await db
    .select({ id: bookings.id, ref: bookings.ref })
    .from(bookings)
    .where(eq(bookings.customerId, user.id))
    .orderBy(desc(bookings.createdAt));
  const cases = await db
    .select()
    .from(supportCases)
    .where(eq(supportCases.openedBy, user.id))
    .orderBy(desc(supportCases.createdAt));
  return (
    <div className="cols">
      <div>
        <h1>Support</h1>
        <p className="lead">
          Tell your Flydrive handler what you need. Safety concerns are handled first.
        </p>
        <SupportForm role="customer" bookings={mine} />
      </div>
      <section className="panel">
        <h2>Your requests</h2>
        {cases.length === 0 ? (
          <p className="empty">None yet.</p>
        ) : (
          <ul className="timeline">
            {cases.map((c) => (
              <li key={c.id}>
                <time dateTime={c.createdAt.toISOString()}>{fmtDateTime(c.createdAt)}</time>
                <strong>{c.kind === "safety" ? "Safety" : "Support"}</strong> ·{" "}
                {c.status === "open" ? "Open" : "Resolved"}
                <div className="muted">{c.message}</div>
                {c.resolution ? <div>Reply: {c.resolution}</div> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
