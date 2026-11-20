import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { auditLog, users } from "@/db/schema";
import { requireRole } from "@/modules/identity/session";
import { fmtDateTime } from "@/modules/shared/records";
import { getDb } from "@/platform/db";

export const metadata: Metadata = { title: "Audit log" };

export default async function OpsAudit() {
  await requireRole("staff", { permission: "audit.read" });
  const rows = await getDb()
    .select({ a: auditLog, name: users.fullName })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.actorId))
    .orderBy(desc(auditLog.createdAt))
    .limit(300);
  return (
    <>
      <h1>Audit log</h1>
      <p className="lead">Append-only record of staff and system actions.</p>
      <section className="panel table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">Who</th>
              <th scope="col">Action</th>
              <th scope="col">Target</th>
              <th scope="col">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ a, name }) => (
              <tr key={a.id}>
                <td>{fmtDateTime(a.createdAt)}</td>
                <td>{name ?? "system"}</td>
                <td className="mono">{a.action}</td>
                <td>
                  {a.targetType} <span className="mono muted">{a.targetId?.slice(0, 8)}</span>
                </td>
                <td className="mono muted">{a.data ? JSON.stringify(a.data) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
