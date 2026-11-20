import type { Metadata } from "next";
import { and, asc, eq, gt, isNull } from "drizzle-orm";
import { driverBlocks } from "@/db/schema";
import { AddUnavailability, RemoveUnavailability } from "@/modules/drivers/DriverForms";
import { requireRole } from "@/modules/identity/session";
import { toLagosInput } from "@/modules/shared/parse";
import { fmtDateTime } from "@/modules/shared/records";
import { getDb } from "@/platform/db";

export const metadata: Metadata = { title: "Availability" };

const KIND: Record<string, string> = {
  unavailable: "You blocked this time",
  hold: "Held for a job awaiting payment",
  assignment: "Confirmed job",
};

export default async function AvailabilityPage() {
  const user = await requireRole("driver");
  const rows = await getDb()
    .select()
    .from(driverBlocks)
    .where(
      and(
        eq(driverBlocks.driverId, user.id),
        isNull(driverBlocks.releasedAt),
        gt(driverBlocks.endsAt, new Date()),
      ),
    )
    .orderBy(asc(driverBlocks.startsAt));
  return (
    <div className="cols">
      <div>
        <h1>Availability</h1>
        <p className="lead">
          You&apos;re available unless you block time here. Blocked time is never offered to
          customers.
        </p>
        <AddUnavailability minStart={toLagosInput(new Date())} />
      </div>
      <section className="panel">
        <h2>Upcoming</h2>
        {rows.length === 0 ? (
          <p className="empty">Nothing blocked.</p>
        ) : (
          <ul className="timeline">
            {rows.map((r) => (
              <li key={r.id}>
                <strong>{fmtDateTime(r.startsAt)}</strong> → {fmtDateTime(r.endsAt)}
                <div className="muted">{KIND[r.kind]}</div>
                {r.kind === "unavailable" ? <RemoveUnavailability blockId={r.id} /> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
