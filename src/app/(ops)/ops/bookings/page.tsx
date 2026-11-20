import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { and, desc, eq, type SQL } from "drizzle-orm";
import { bookings, users } from "@/db/schema";
import { STATUS_LABEL, type BookingStatus } from "@/modules/booking/states";
import { requireRole } from "@/modules/identity/session";
import { fmtDateTime } from "@/modules/shared/records";
import { getDb } from "@/platform/db";
import { StatusBadge } from "@/ui/StatusBadge";

export const metadata: Metadata = { title: "Bookings" };

export default async function OpsBookings({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireRole("staff", { permission: "bookings.manage" });
  const sp = await searchParams;
  const conds: SQL[] = [];
  if (sp.status && sp.status in STATUS_LABEL)
    conds.push(eq(bookings.status, sp.status as BookingStatus));
  if (sp.short) conds.push(eq(bookings.shortNotice, true));
  const rows = await getDb()
    .select({ b: bookings, customer: users.fullName })
    .from(bookings)
    .innerJoin(users, eq(users.id, bookings.customerId))
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(bookings.createdAt))
    .limit(200);
  return (
    <>
      <h1>Bookings</h1>
      <nav aria-label="Filter" className="portal-nav" style={{ marginBottom: 16 }}>
        <ul>
          <li>
            <Link href="/ops/bookings" aria-current={!sp.status && !sp.short ? "page" : undefined}>
              All
            </Link>
          </li>
          {(Object.keys(STATUS_LABEL) as BookingStatus[]).map((s) => (
            <li key={s}>
              <Link
                href={`/ops/bookings?status=${s}` as Route}
                aria-current={sp.status === s ? "page" : undefined}
              >
                {STATUS_LABEL[s]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="panel table-wrap">
        {rows.length === 0 ? (
          <p className="empty">No bookings match.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Ref</th>
                <th scope="col">Customer</th>
                <th scope="col">Starts</th>
                <th scope="col">Type</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ b, customer }) => (
                <tr key={b.id}>
                  <td>
                    <Link href={`/ops/bookings/${b.id}` as Route}>{b.ref}</Link>
                    {b.shortNotice ? (
                      <>
                        {" "}
                        <span className="badge badge-red">Short notice</span>
                      </>
                    ) : null}
                  </td>
                  <td>{customer}</td>
                  <td>{fmtDateTime(b.startsAt)}</td>
                  <td>
                    {b.pkg} · {b.city}
                    {b.vehicleSource === "flydrive" ? " · car + driver" : ""}
                  </td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
