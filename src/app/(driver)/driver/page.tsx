import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { and, asc, eq, gt, inArray } from "drizzle-orm";
import { bookings, driverProfiles, offers } from "@/db/schema";
import { requireRole } from "@/modules/identity/session";
import { fmtDateTime } from "@/modules/shared/records";
import { getDb } from "@/platform/db";
import { Notice } from "@/ui/blocks";
import { Notifications } from "@/ui/Notifications";
import { StatusBadge } from "@/ui/StatusBadge";

export const metadata: Metadata = { title: "Driver home" };

const STATUS_COPY: Record<string, string> = {
  applicant: "Application started",
  under_review: "Checks in progress",
  eligible: "Cleared to drive",
  suspended: "Suspended",
  rejected: "Not approved",
};

export default async function DriverHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireRole("driver");
  const sp = await searchParams;
  const db = getDb();
  const [p] = await db.select().from(driverProfiles).where(eq(driverProfiles.userId, user.id));
  const pending = await db
    .select({ o: offers, ref: bookings.ref, startsAt: bookings.startsAt })
    .from(offers)
    .innerJoin(bookings, eq(bookings.id, offers.bookingId))
    .where(
      and(
        eq(offers.driverId, user.id),
        eq(offers.status, "pending"),
        gt(offers.expiresAt, new Date()),
      ),
    )
    .orderBy(asc(offers.expiresAt));
  const jobs = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.selectedDriverId, user.id),
        inArray(bookings.status, ["payment_pending", "payment_review", "confirmed", "in_progress"]),
      ),
    )
    .orderBy(asc(bookings.startsAt));
  return (
    <>
      <div className="page-title-row">
        <div className="page-title">
          <h1>Hello, {p?.firstName ?? user.fullName}</h1>
          <span className={`badge ${p?.status === "eligible" ? "badge-green" : "badge-amber"}`}>
            {STATUS_COPY[p?.status ?? "applicant"]}
          </span>
        </div>
      </div>
      {sp.applied ? (
        <p className="form-success" role="status">
          Application received. Our team will contact you to check your identity, licence and
          guarantor.
        </p>
      ) : null}
      {p && p.status !== "eligible" ? (
        <Notice title="You can't be offered jobs yet" tone="pending">
          <p>
            Once your identity, licence and guarantor checks pass, you&apos;ll start receiving
            offers. <Link href="/driver/onboarding">See your checks</Link>.
          </p>
        </Notice>
      ) : null}
      <div className="cols">
        <div className="stack">
          <section className="panel">
            <h2>Job offers</h2>
            {pending.length === 0 ? (
              <p className="empty">No offers waiting.</p>
            ) : (
              <ul className="timeline">
                {pending.map(({ o, ref, startsAt }) => (
                  <li key={o.id}>
                    <Link href={`/driver/offers/${o.id}` as Route}>Offer for {ref}</Link>
                    <div className="muted">
                      Starts {fmtDateTime(startsAt)} · reply by {fmtDateTime(o.expiresAt)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="panel">
            <h2>Your jobs</h2>
            {jobs.length === 0 ? (
              <p className="empty">No upcoming jobs.</p>
            ) : (
              <table className="table">
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id}>
                      <td>
                        <Link href={`/driver/assignments/${j.id}` as Route}>{j.ref}</Link>
                      </td>
                      <td>{fmtDateTime(j.startsAt)}</td>
                      <td>
                        <StatusBadge status={j.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
        <Notifications userId={user.id} />
      </div>
    </>
  );
}
