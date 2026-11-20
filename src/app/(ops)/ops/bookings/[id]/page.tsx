import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import {
  bookings,
  customerVehicles,
  fleetVehicles,
  handovers,
  payments,
  supportCases,
  users,
} from "@/db/schema";
import { bookingTimeline, candidateViews } from "@/modules/booking/service";
import { STATUS_LABEL } from "@/modules/booking/states";
import { availableDrivers } from "@/modules/drivers/service";
import { requireRole } from "@/modules/identity/session";
import { ConfirmButtons, NoCandidateForm, OpsCancel, PublishForm } from "@/modules/ops/OpsForms";
import { fmtDateTime, naira, userNames } from "@/modules/shared/records";
import { getDb } from "@/platform/db";
import { Notice } from "@/ui/blocks";
import { StatusBadge } from "@/ui/StatusBadge";

export const metadata: Metadata = { title: "Booking detail" };

export default async function OpsBooking({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireRole("staff", { permission: "bookings.manage" });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const db = getDb();
  const [row] = await db
    .select({ b: bookings, cust: users })
    .from(bookings)
    .innerJoin(users, eq(users.id, bookings.customerId))
    .where(eq(bookings.id, id));
  if (!row) notFound();
  const { b, cust } = row;
  const [veh] = b.customerVehicleId
    ? await db.select().from(customerVehicles).where(eq(customerVehicles.id, b.customerVehicleId))
    : [];
  const transmission = veh?.transmission ?? null;
  const canShortlist = ["submitted", "candidates_ready", "no_candidate"].includes(b.status);
  const free = canShortlist
    ? await availableDrivers(db, {
        city: b.city,
        startsAt: b.startsAt,
        endsAt: b.endsAt,
        transmission,
        bookingId: b.id,
        preferFemale: b.prefersFemaleDriver,
      })
    : [];
  const fleet =
    canShortlist && b.vehicleSource === "flydrive"
      ? await db
          .select()
          .from(fleetVehicles)
          .where(and(eq(fleetVehicles.active, true), eq(fleetVehicles.city, b.city)))
      : [];
  const cands = await candidateViews(db, b.id);
  const pays = await db
    .select()
    .from(payments)
    .where(eq(payments.bookingId, b.id))
    .orderBy(desc(payments.createdAt));
  const events = await bookingTimeline(db, b.id);
  const names = await userNames(
    db,
    events.map((e) => e.actorId).filter((x): x is string => Boolean(x)),
  );
  const hv = await db.select().from(handovers).where(eq(handovers.bookingId, b.id));
  const cases = await db.select().from(supportCases).where(eq(supportCases.bookingId, b.id));
  const canConfirm =
    staff.permissions.includes("bookings.confirm") && staff.permissions.includes("payments.verify");
  const succeeded = pays.find((p) => p.status === "succeeded");

  return (
    <>
      <p>
        <Link href="/ops/bookings">← Bookings</Link>
      </p>
      <div className="page-title-row">
        <h1>
          {b.ref} {b.shortNotice ? <span className="badge badge-red">Short notice</span> : null}
        </h1>
        <StatusBadge status={b.status} />
      </div>
      <div className="cols">
        <div className="stack">
          {canShortlist ? (
            <section className="panel">
              <h2>Quote and shortlist</h2>
              {b.prefersFemaleDriver ? (
                <p className="badge badge-blue">
                  Customer prefers a female driver — listed first where available
                </p>
              ) : null}
              <PublishForm
                bookingId={b.id}
                needsFleet={b.vehicleSource === "flydrive"}
                fleet={fleet.map((f) => ({
                  id: f.id,
                  label: `${f.label} · ${f.vehicleClass} · ${f.transmission}`,
                }))}
                drivers={free.map((d) => ({
                  id: d.profile.userId,
                  label: `${d.fullName} (${d.profile.firstName}) · ${d.profile.yearsExperience} yrs · ${d.profile.transmissions.join("/")}${d.profile.gender === "female" ? " · female" : ""}`,
                }))}
                quoteNaira={b.quoteKobo ? String(b.quoteKobo / 100) : undefined}
              />
              <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "20px 0" }} />
              <NoCandidateForm bookingId={b.id} />
            </section>
          ) : null}

          {b.status === "payment_review" ? (
            <section className="panel">
              <h2>Verify payment</h2>
              {succeeded ? (
                <dl className="kv">
                  <dt>Reference</dt>
                  <dd className="mono">{succeeded.reference}</dd>
                  <dt>Amount</dt>
                  <dd>
                    {naira(succeeded.amountKobo)}{" "}
                    {succeeded.amountKobo === b.quoteKobo ? (
                      <span className="badge badge-green">matches quote</span>
                    ) : (
                      <span className="badge badge-red">doesn&apos;t match</span>
                    )}
                  </dd>
                  {Object.entries((succeeded.providerSummary ?? {}) as Record<string, unknown>)
                    .filter(([, v]) => v !== null && v !== "")
                    .map(([k, v]) => (
                      <Fragment key={k}>
                        <dt>{k.replace(/_/g, " ")}</dt>
                        <dd>{String(v)}</dd>
                      </Fragment>
                    ))}
                </dl>
              ) : (
                <p>No successful payment found.</p>
              )}
              <p className="field-hint">
                Check the transaction in the Paystack dashboard before confirming.
              </p>
              {canConfirm ? (
                <ConfirmButtons bookingId={b.id} />
              ) : (
                <p className="muted">You need payment-verification and confirmation permissions.</p>
              )}
            </section>
          ) : null}

          {cands.length ? (
            <section className="panel">
              <h2>Candidates</h2>
              <ul>
                {cands.map((c) => (
                  <li key={c.driverId}>
                    <Link href={`/ops/drivers/${c.driverId}` as Route}>{c.firstName}</Link>
                    {c.excluded ? " — excluded (declined / no response)" : ""}
                    {b.selectedDriverId === c.driverId ? " — selected" : ""}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {hv.length || cases.length ? (
            <section className="panel">
              <h2>Handover and issues</h2>
              {hv.map((h) => (
                <p key={h.id}>
                  <strong>
                    {h.stage} · {h.party}
                  </strong>
                  {h.disputed ? <span className="badge badge-red"> disputed</span> : null}:{" "}
                  {h.conditionNote} {h.fuelLevel ? `(fuel: ${h.fuelLevel})` : ""}
                </p>
              ))}
              {cases.map((c) => (
                <Notice
                  key={c.id}
                  title={`${c.kind} case · ${c.status}`}
                  tone={c.status === "open" ? "pending" : "info"}
                >
                  <p>{c.message}</p>
                </Notice>
              ))}
            </section>
          ) : null}

          {!["completed", "cancelled", "in_progress"].includes(b.status) ? (
            <section className="panel">
              <h2>Cancel</h2>
              {succeeded ? (
                <p className="muted">
                  This booking is paid. Cancelling records it; the refund must be done manually in
                  Paystack.
                </p>
              ) : null}
              <OpsCancel bookingId={b.id} />
            </section>
          ) : null}
        </div>

        <div className="stack">
          <section className="panel">
            <h2>Request</h2>
            <dl className="kv">
              <dt>Customer</dt>
              <dd>
                {cust.fullName}
                <br />
                <span className="muted">{cust.phone}</span>
              </dd>
              <dt>Package</dt>
              <dd>{b.pkg}</dd>
              <dt>When</dt>
              <dd>
                {fmtDateTime(b.startsAt)} → {fmtDateTime(b.endsAt)}
              </dd>
              <dt>Where</dt>
              <dd>
                {b.city} · {b.pickupArea}
              </dd>
              <dt>Car</dt>
              <dd>
                {veh
                  ? `${veh.make} ${veh.model} (${veh.transmission})`
                  : `Flydrive ${b.vehicleClass}`}
              </dd>
              <dt>Passengers</dt>
              <dd>{b.passengers}</dd>
              <dt>Duties</dt>
              <dd style={{ whiteSpace: "pre-wrap" }}>{b.duties}</dd>
              {b.overnightOutOfState ? (
                <>
                  <dt>Overnight</dt>
                  <dd>{b.accommodationNote}</dd>
                </>
              ) : null}
              {b.notes ? (
                <>
                  <dt>Notes</dt>
                  <dd>{b.notes}</dd>
                </>
              ) : null}
              <dt>Quote</dt>
              <dd>{b.quoteKobo ? naira(b.quoteKobo) : "—"}</dd>
              {b.paymentDueAt ? (
                <>
                  <dt>Pay by</dt>
                  <dd>{fmtDateTime(b.paymentDueAt)}</dd>
                </>
              ) : null}
            </dl>
          </section>
          <section className="panel">
            <h2>Timeline</h2>
            <ul className="timeline">
              {events.map((e) => (
                <li key={e.id}>
                  <time dateTime={e.createdAt.toISOString()}>{fmtDateTime(e.createdAt)}</time>
                  {e.toStatus ? STATUS_LABEL[e.toStatus] : e.type}
                  <div className="muted">
                    {e.actorRole}
                    {e.actorId ? ` · ${names.get(e.actorId) ?? ""}` : ""}
                    {e.data && typeof e.data === "object" && "reason" in e.data
                      ? ` · ${String((e.data as { reason: unknown }).reason)}`
                      : ""}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
