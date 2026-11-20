import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { desc, eq } from "drizzle-orm";
import { bookings } from "@/db/schema";
import { requireRole } from "@/modules/identity/session";
import { fmtDateTime } from "@/modules/shared/records";
import { PACKAGE_LABEL, label } from "@/modules/shared/labels";
import { getDb } from "@/platform/db";
import { Notifications } from "@/ui/Notifications";
import { StatusBadge } from "@/ui/StatusBadge";

export const metadata: Metadata = { title: "My bookings" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireRole("customer");
  const sp = await searchParams;
  const rows = await getDb()
    .select()
    .from(bookings)
    .where(eq(bookings.customerId, user.id))
    .orderBy(desc(bookings.createdAt));
  return (
    <>
      <div className="page-title-row">
        <h1>{sp.welcome ? `Welcome, ${user.fullName.split(" ")[0]}` : "My bookings"}</h1>
        <Link className="button button-yellow button-arrow" href="/bookings/new">
          Request a driver
        </Link>
      </div>
      <div className="cols">
        <section className="panel" aria-labelledby="b-h">
          <h2 id="b-h">Bookings</h2>
          {rows.length === 0 ? (
            <p className="empty">No bookings yet. Request a driver to get started.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Ref</th>
                    <th scope="col">Starts</th>
                    <th scope="col">Package</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <Link href={`/bookings/${b.id}` as Route}>{b.ref}</Link>
                      </td>
                      <td>{fmtDateTime(b.startsAt)}</td>
                      <td>
                        {label(PACKAGE_LABEL, b.pkg)}
                        {b.vehicleSource === "flydrive" ? " · car + driver" : ""}
                      </td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <Notifications userId={user.id} />
      </div>
    </>
  );
}
