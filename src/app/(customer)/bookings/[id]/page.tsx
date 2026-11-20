import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { bookings, customerVehicles, fleetVehicles, handovers } from "@/db/schema";
import {
  CancelBooking,
  MeetingDetailsForm,
  PayButton,
  SelectDriverButton,
} from "@/modules/booking/CustomerForms";
import { bookingTimeline, candidateViews, driverContact } from "@/modules/booking/service";
import { STATUS_LABEL } from "@/modules/booking/states";
import { requireRole } from "@/modules/identity/session";
import { fmtDateTime, naira } from "@/modules/shared/records";
import { PACKAGE_LABEL, label } from "@/modules/shared/labels";
import { getDb } from "@/platform/db";
import { Notice } from "@/ui/blocks";
import { StatusBadge } from "@/ui/StatusBadge";

export const metadata: Metadata = { title: "Booking" };

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireRole("customer");
  const { id } = await params;
  const sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const db = getDb();
  const [b] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.customerId, user.id)));
  if (!b) notFound();

  const [vehicle] = b.customerVehicleId
    ? await db.select().from(customerVehicles).where(eq(customerVehicles.id, b.customerVehicleId))
    : [];
  const [fleet] = b.fleetVehicleId
    ? await db.select().from(fleetVehicles).where(eq(fleetVehicles.id, b.fleetVehicleId))
    : [];
  const cands =
    b.status === "candidates_ready"
      ? (await candidateViews(db, b.id)).filter((c) => !c.excluded)
      : [];
  const confirmed = ["confirmed", "in_progress", "completed"].includes(b.status);
  const driver =
    confirmed && b.selectedDriverId ? await driverContact(db, b.selectedDriverId) : null;
  const events = await bookingTimeline(db, b.id);
  const hv = await db.select().from(handovers).where(eq(handovers.bookingId, b.id));
  const cancellable = [
    "submitted",
    "candidates_ready",
    "offer_pending",
    "payment_pending",
  ].includes(b.status);

  return (
    <>
      <Link className="back-link" href="/account">
        ← My bookings
      </Link>
      <div className="page-title-row">
        <div className="page-title">
          <h1>Booking {b.ref}</h1>
          <StatusBadge status={b.status} />
        </div>
      </div>
      {sp.submitted ? (
        <p className="form-success" role="status">
          Request sent.{" "}
          {b.shortNotice
            ? "It starts within 3 days, so our team will check availability by hand."
            : "We'll shortlist suitable drivers for you."}
        </p>
      ) : null}

      <div className="cols">
        <div className="stack">
          {b.status === "submitted" ? (
            <section className="panel">
              <h2>What happens next</h2>
              <p>
                Our team is checking suitable drivers and the price for this booking. You&apos;ll be
                notified when you can choose a driver. Nothing has been charged.
              </p>
            </section>
          ) : null}

          {b.status === "candidates_ready" ? (
            <section className="panel" aria-labelledby="c-h">
              <h2 id="c-h">Choose your driver</h2>
              <p className="muted">
                Price: <strong>{b.quoteKobo ? naira(b.quoteKobo) : "—"}</strong>. Choosing a driver
                sends them an offer; they see the full job and accept or decline. You pay only after
                they accept.
              </p>
              {cands.length === 0 ? (
                <p className="empty">
                  No drivers are available right now. Your handler will be in touch.
                </p>
              ) : (
                cands.map((c) => (
                  <div className="candidate" key={c.driverId}>
                    <div className="candidate-info">
                      <span className="avatar" aria-hidden="true">
                        {c.firstName.charAt(0)}
                      </span>
                      <div>
                        <strong>{c.firstName}</strong>
                        <div className="muted">
                          {c.yearsExperience} years&apos; experience · {c.transmissions.join(" & ")}{" "}
                          · Training:{" "}
                          {c.trainingStatus === "pending" ? "Pending" : c.trainingStatus}
                        </div>
                      </div>
                    </div>
                    <SelectDriverButton bookingId={b.id} driverId={c.driverId} name={c.firstName} />
                  </div>
                ))
              )}
              <p className="field-hint" style={{ marginTop: 12 }}>
                Before payment we show limited details only. Full name and contact are shared once
                the booking is confirmed.
              </p>
            </section>
          ) : null}

          {b.status === "offer_pending" ? (
            <section className="panel">
              <h2>Waiting for your driver</h2>
              <p>
                Your chosen driver is reviewing the full job. If they decline or don&apos;t respond
                in time, you&apos;ll choose again. Nothing has been charged.
              </p>
            </section>
          ) : null}

          {b.status === "payment_pending" ? (
            <section className="panel">
              <h2>Pay to secure your booking</h2>
              <p>
                Your driver accepted. Pay <strong>{b.quoteKobo ? naira(b.quoteKobo) : ""}</strong>
                {b.paymentDueAt ? (
                  <>
                    {" "}
                    by <strong>{fmtDateTime(b.paymentDueAt)}</strong>
                  </>
                ) : null}
                . After payment our team checks it and confirms the booking.
              </p>
              <PayButton bookingId={b.id} amount={b.quoteKobo ? naira(b.quoteKobo) : ""} />
            </section>
          ) : null}

          {b.status === "payment_review" ? (
            <section className="panel">
              <h2>Payment received — checking it now</h2>
              <p>
                Our team is verifying your payment. Your booking isn&apos;t confirmed until they do;
                we&apos;ll notify you.
              </p>
            </section>
          ) : null}

          {confirmed ? (
            <section className="panel">
              <h2>{b.status === "completed" ? "Completed" : "Confirmed"}</h2>
              {driver ? (
                <dl className="kv">
                  <dt>Driver</dt>
                  <dd>{driver.fullName}</dd>
                  <dt>Driver&apos;s phone</dt>
                  <dd>{driver.phone ? <a href={`tel:${driver.phone}`}>{driver.phone}</a> : "—"}</dd>
                </dl>
              ) : null}
              {b.status !== "completed" ? (
                <>
                  <h3 style={{ marginTop: 20 }}>Meeting details</h3>
                  <MeetingDetailsForm
                    bookingId={b.id}
                    meetingPoint={b.meetingPoint}
                    contactPhone={b.contactPhone}
                  />
                  <p style={{ marginTop: 16 }}>
                    <Link
                      className="button button-secondary"
                      href={`/bookings/${b.id}/handover` as Route}
                    >
                      Record pickup or return
                    </Link>
                  </p>
                </>
              ) : null}
              {hv.length ? (
                <p className="muted">
                  Handover records: {hv.map((h) => `${h.stage} (${h.party})`).join(", ")}.
                </p>
              ) : null}
            </section>
          ) : null}

          {b.status === "no_candidate" ? (
            <Notice title="No driver available" tone="pending">
              <p>
                We couldn&apos;t find a suitable driver for these dates. Nothing has been charged.
                You can request different dates.
              </p>
            </Notice>
          ) : null}

          {cancellable ? (
            <section className="panel">
              <h2>Cancel</h2>
              <p className="muted">You can cancel any time before paying, free of charge.</p>
              <CancelBooking bookingId={b.id} />
            </section>
          ) : null}
        </div>

        <div className="stack">
          <section className="panel">
            <h2>Details</h2>
            <dl className="kv">
              <dt>Package</dt>
              <dd>{label(PACKAGE_LABEL, b.pkg)}</dd>
              <dt>Starts</dt>
              <dd>{fmtDateTime(b.startsAt)}</dd>
              <dt>Ends</dt>
              <dd>{fmtDateTime(b.endsAt)}</dd>
              <dt>City</dt>
              <dd>{b.city === "lagos" ? "Lagos" : "Ibadan"}</dd>
              <dt>Pickup area</dt>
              <dd>{b.pickupArea}</dd>
              <dt>Car</dt>
              <dd>
                {vehicle
                  ? `${vehicle.make} ${vehicle.model} (${vehicle.transmission})`
                  : fleet
                    ? `${fleet.label}`
                    : `Flydrive ${b.vehicleClass ?? ""}`}
              </dd>
              <dt>Price</dt>
              <dd>{b.quoteKobo ? naira(b.quoteKobo) : "Being set"}</dd>
            </dl>
          </section>
          <section className="panel">
            <h2>Timeline</h2>
            <ul className="timeline">
              {events.map((e) => (
                <li key={e.id}>
                  <time dateTime={e.createdAt.toISOString()}>{fmtDateTime(e.createdAt)}</time>
                  {e.toStatus ? STATUS_LABEL[e.toStatus] : e.type}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
