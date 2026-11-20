import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { bookings, customerVehicles, fleetVehicles, handovers, users } from "@/db/schema";
import { HandoverForm, SupportForm } from "@/modules/booking/CustomerForms";
import { requireRole } from "@/modules/identity/session";
import { fmtDateTime } from "@/modules/shared/records";
import { getDb } from "@/platform/db";
import { Notice } from "@/ui/blocks";
import { StatusBadge } from "@/ui/StatusBadge";

export const metadata: Metadata = { title: "Assignment" };

export default async function AssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("driver");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const db = getDb();
  const [b] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.selectedDriverId, user.id)));
  if (!b) notFound();
  const confirmed = ["confirmed", "in_progress", "completed"].includes(b.status);
  const [customer] = confirmed
    ? await db.select({ fullName: users.fullName }).from(users).where(eq(users.id, b.customerId))
    : [];
  const [handler] =
    b.handlerId && confirmed
      ? await db
          .select({ fullName: users.fullName, phone: users.phone })
          .from(users)
          .where(eq(users.id, b.handlerId))
      : [];
  const [v] = b.customerVehicleId
    ? await db.select().from(customerVehicles).where(eq(customerVehicles.id, b.customerVehicleId))
    : [];
  const [f] = b.fleetVehicleId
    ? await db.select().from(fleetVehicles).where(eq(fleetVehicles.id, b.fleetVehicleId))
    : [];
  const mine = await db
    .select()
    .from(handovers)
    .where(and(eq(handovers.bookingId, b.id), eq(handovers.party, "driver")));
  const stage = b.status === "confirmed" ? "pickup" : b.status === "in_progress" ? "return" : null;
  const stageDone = stage ? mine.some((h) => h.stage === stage) : false;
  return (
    <>
      <Link className="back-link" href="/driver">
        ← Driver home
      </Link>
      <div className="page-title-row">
        <div className="page-title">
          <h1>Assignment {b.ref}</h1>
          <StatusBadge status={b.status} />
        </div>
      </div>
      {!confirmed ? (
        <Notice title="Not confirmed yet" tone="pending">
          <p>
            Your time is held while the customer pays and our team checks the payment. Customer
            details appear once it&apos;s confirmed.
          </p>
        </Notice>
      ) : null}
      <div className="cols">
        <div className="stack">
          <section className="panel">
            <h2>Job</h2>
            <dl className="kv">
              <dt>Starts</dt>
              <dd>{fmtDateTime(b.startsAt)}</dd>
              <dt>Ends</dt>
              <dd>{fmtDateTime(b.endsAt)}</dd>
              <dt>Car</dt>
              <dd>
                {v ? `${v.make} ${v.model} (${v.transmission})` : f ? f.label : b.vehicleClass}
              </dd>
              <dt>Duties</dt>
              <dd style={{ whiteSpace: "pre-wrap" }}>{b.duties}</dd>
              {confirmed ? (
                <>
                  <dt>Customer</dt>
                  <dd>{customer?.fullName}</dd>
                  <dt>Meeting point</dt>
                  <dd>{b.meetingPoint ?? "The customer hasn't added it yet."}</dd>
                  <dt>Customer phone</dt>
                  <dd>
                    {b.contactPhone ? (
                      <a href={`tel:${b.contactPhone}`}>{b.contactPhone}</a>
                    ) : (
                      "Not added yet"
                    )}
                  </dd>
                  <dt>Flydrive handler</dt>
                  <dd>
                    {handler?.fullName ?? "—"}
                    {handler?.phone ? (
                      <>
                        {" "}
                        · <a href={`tel:${handler.phone}`}>{handler.phone}</a>
                      </>
                    ) : null}
                  </dd>
                </>
              ) : null}
            </dl>
          </section>
          {stage ? (
            <section className="panel">
              <h2>{stage === "pickup" ? "Pickup check" : "Return check"}</h2>
              {stageDone ? (
                <p>You&apos;ve recorded this. Waiting for the customer.</p>
              ) : (
                <HandoverForm bookingId={b.id} stage={stage} party="driver" />
              )}
            </section>
          ) : null}
        </div>
        <div>
          <h2>Need help?</h2>
          <p className="muted">
            You can refuse unsafe work. Reporting a concern never counts against you.
          </p>
          <SupportForm role="driver" bookings={[{ id: b.id, ref: b.ref }]} />
        </div>
      </div>
    </>
  );
}
