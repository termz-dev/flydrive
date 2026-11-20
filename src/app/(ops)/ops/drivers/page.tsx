import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { asc, eq } from "drizzle-orm";
import { driverProfiles, users } from "@/db/schema";
import { requireRole } from "@/modules/identity/session";
import { fmtDate } from "@/modules/shared/records";
import { getDb } from "@/platform/db";

export const metadata: Metadata = { title: "Drivers" };

const STATUSES = ["applicant", "under_review", "eligible", "suspended", "rejected"] as const;

export default async function OpsDrivers({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireRole("staff", { permission: "drivers.review" });
  const sp = await searchParams;
  const filter = STATUSES.find((s) => s === sp.status);
  const rows = await getDb()
    .select({ p: driverProfiles, name: users.fullName, phone: users.phone })
    .from(driverProfiles)
    .innerJoin(users, eq(users.id, driverProfiles.userId))
    .where(filter ? eq(driverProfiles.status, filter) : undefined)
    .orderBy(asc(driverProfiles.createdAt));
  return (
    <>
      <h1>Drivers</h1>
      <nav aria-label="Filter" className="portal-nav" style={{ marginBottom: 16 }}>
        <ul>
          <li>
            <Link href="/ops/drivers" aria-current={!filter ? "page" : undefined}>
              All
            </Link>
          </li>
          {STATUSES.map((s) => (
            <li key={s}>
              <Link
                href={`/ops/drivers?status=${s}` as Route}
                aria-current={filter === s ? "page" : undefined}
              >
                {s.replace("_", " ")}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="panel table-wrap">
        {rows.length === 0 ? (
          <p className="empty">No drivers.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Cities</th>
                <th scope="col">Experience</th>
                <th scope="col">Status</th>
                <th scope="col">Applied</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ p, name, phone }) => (
                <tr key={p.userId}>
                  <td>
                    <Link href={`/ops/drivers/${p.userId}` as Route}>{name}</Link>
                  </td>
                  <td>{phone}</td>
                  <td>{p.cities.join(", ")}</td>
                  <td>{p.yearsExperience} yrs</td>
                  <td>
                    <span
                      className={`badge ${p.status === "eligible" ? "badge-green" : p.status === "under_review" ? "badge-amber" : p.status === "applicant" ? "" : "badge-red"}`}
                    >
                      {p.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>{fmtDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
