import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { bookings, customerVehicles, fleetVehicles, offers } from "@/db/schema";
import { OfferResponse } from "@/modules/drivers/DriverForms";
import { requireRole } from "@/modules/identity/session";
import { fmtDateTime, naira } from "@/modules/shared/records";
import { PACKAGE_LABEL, label } from "@/modules/shared/labels";
import { getDb } from "@/platform/db";
import { Notice } from "@/ui/blocks";

export const metadata: Metadata = { title: "Job offer" };

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("driver");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const db = getDb();
  const [row] = await db
    .select({ o: offers, b: bookings })
    .from(offers)
    .innerJoin(bookings, eq(bookings.id, offers.bookingId))
    .where(and(eq(offers.id, id), eq(offers.driverId, user.id)));
  if (!row) notFound();
  const { o, b } = row;
  const [v] = b.customerVehicleId
    ? await db.select().from(customerVehicles).where(eq(customerVehicles.id, b.customerVehicleId))
    : [];
  const [f] = b.fleetVehicleId
    ? await db.select().from(fleetVehicles).where(eq(fleetVehicles.id, b.fleetVehicleId))
    : [];
  const open = o.status === "pending" && o.expiresAt > new Date();
  return (
    <div style={{ maxWidth: 760 }}>
      <Link className="back-link" href="/driver">
        ← Driver home
      </Link>
      <h1>Job offer {b.ref}</h1>
      {open ? (
        <p className="lead">
          Read the full job. Reply by {fmtDateTime(o.expiresAt)}. Declining never counts against
          you.
        </p>
      ) : null}
      <section className="panel">
        <dl className="kv">
          <dt>Package</dt>
          <dd>{label(PACKAGE_LABEL, b.pkg)}</dd>
          <dt>Starts</dt>
          <dd>{fmtDateTime(b.startsAt)}</dd>
          <dt>Ends</dt>
          <dd>{fmtDateTime(b.endsAt)}</dd>
          <dt>City / area</dt>
          <dd>
            {b.city === "lagos" ? "Lagos" : "Ibadan"} — {b.pickupArea}
          </dd>
          <dt>Car</dt>
          <dd>
            {v
              ? `${v.make} ${v.model}, ${v.transmission} (customer's car)`
              : f
                ? `${f.label}, ${f.transmission} (Flydrive car)`
                : `Flydrive ${b.vehicleClass}`}
          </dd>
          <dt>Passengers</dt>
          <dd>{b.passengers}</dd>
          <dt>Duties</dt>
          <dd style={{ whiteSpace: "pre-wrap" }}>{b.duties}</dd>
          {b.overnightOutOfState ? (
            <>
              <dt>Overnight</dt>
              <dd>Out of state. Accommodation: {b.accommodationNote}</dd>
            </>
          ) : null}
          {b.notes ? (
            <>
              <dt>Notes</dt>
              <dd>{b.notes}</dd>
            </>
          ) : null}
          <dt>Booking value</dt>
          <dd>{b.quoteKobo ? naira(b.quoteKobo) : "—"}</dd>
        </dl>
        <p className="field-hint" style={{ marginTop: 12 }}>
          You cover your own transport to and from the job. The customer covers fuel, tolls, parking
          and washing on driver-only bookings.
        </p>
      </section>
      {open ? (
        <section className="panel">
          <OfferResponse offerId={o.id} />
          <p className="field-hint">
            If you accept, this time is held for you while the customer pays. The booking is
            confirmed only after our team checks the payment.
          </p>
        </section>
      ) : (
        <Notice
          title={o.status === "accepted" ? "You accepted this job" : "This offer is closed"}
          tone="pending"
        >
          <p>
            {o.status === "accepted"
              ? "You'll be notified when the booking is confirmed."
              : "It was declined, expired or withdrawn."}
          </p>
        </Notice>
      )}
    </div>
  );
}
