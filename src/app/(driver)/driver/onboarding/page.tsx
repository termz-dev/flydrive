import type { Metadata } from "next";
import { getDriverWithChecks } from "@/modules/drivers/service";
import { requireRole } from "@/modules/identity/session";
import { fmtDate } from "@/modules/shared/records";
import { getDb } from "@/platform/db";

export const metadata: Metadata = { title: "My checks" };

const LABEL: Record<string, string> = {
  identity: "Identity",
  licence: "Driver's licence",
  guarantor: "Guarantor",
  background: "Background check",
};
const STATUS: Record<string, [string, string]> = {
  pending: ["Pending", "badge-amber"],
  passed: ["Passed", "badge-green"],
  failed: ["Not passed", "badge-red"],
  expired: ["Expired", "badge-red"],
};

export default async function OnboardingPage() {
  const user = await requireRole("driver");
  const d = await getDriverWithChecks(getDb(), user.id);
  return (
    <div style={{ maxWidth: 720 }}>
      <h1>My checks</h1>
      <p className="lead">
        Identity, licence and guarantor must pass before you can be offered jobs. Our team will
        contact you to verify each one.
      </p>
      <section className="panel">
        <table className="table">
          <tbody>
            {d.checks.map((c) => {
              const [label, tone] = STATUS[c.status] ?? ["—", ""];
              return (
                <tr key={c.id}>
                  <th scope="row">
                    {LABEL[c.kind]}
                    {c.kind === "background" ? (
                      <div className="muted" style={{ fontWeight: 400 }}>
                        Process being finalised; not required yet
                      </div>
                    ) : null}
                  </th>
                  <td>
                    <span className={`badge ${tone}`}>{label}</span>
                  </td>
                  <td className="muted">
                    {c.expiresAt ? `Valid until ${fmtDate(c.expiresAt)}` : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <section className="panel">
        <h2>Training</h2>
        <p>
          The Flydrive driving assessment hasn&apos;t started yet. Your training status shows as{" "}
          <strong>Pending</strong> to customers.
        </p>
      </section>
    </div>
  );
}
