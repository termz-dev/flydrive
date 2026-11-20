import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { desc, eq } from "drizzle-orm";
import { supportCases, users } from "@/db/schema";
import { requireRole } from "@/modules/identity/session";
import { ResolveCase } from "@/modules/ops/OpsForms";
import { fmtDateTime } from "@/modules/shared/records";
import { getDb } from "@/platform/db";

export const metadata: Metadata = { title: "Incidents" };

export default async function OpsIncidents() {
  await requireRole("staff", { permission: "incidents.manage" });
  const rows = await getDb()
    .select({ c: supportCases, name: users.fullName, role: users.role })
    .from(supportCases)
    .innerJoin(users, eq(users.id, supportCases.openedBy))
    .orderBy(supportCases.status, desc(supportCases.kind), desc(supportCases.createdAt))
    .limit(200);
  return (
    <>
      <h1>Incidents and support</h1>
      <p className="lead">
        Safety cases are listed first. Resolve each with a reply the person will see.
      </p>
      <div className="stack">
        {rows.length === 0 ? <p className="empty">No cases.</p> : null}
        {rows.map(({ c, name, role }) => (
          <section key={c.id} className="panel">
            <h2 style={{ fontSize: "1.1rem" }}>
              <span className={`badge ${c.kind === "safety" ? "badge-red" : "badge-blue"}`}>
                {c.kind}
              </span>{" "}
              {c.status === "open" ? "Open" : "Resolved"} · {name} ({role}) ·{" "}
              {fmtDateTime(c.createdAt)}
            </h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{c.message}</p>
            {c.bookingId ? (
              <p>
                <Link href={`/ops/bookings/${c.bookingId}` as Route}>Open booking</Link>
              </p>
            ) : null}
            {c.status === "open" ? (
              <ResolveCase caseId={c.id} />
            ) : (
              <p className="muted">Resolution: {c.resolution}</p>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
