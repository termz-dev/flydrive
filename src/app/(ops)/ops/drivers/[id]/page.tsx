import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDriverWithChecks } from "@/modules/drivers/service";
import { requireRole } from "@/modules/identity/session";
import { CheckReview, DriverStatusForm } from "@/modules/ops/OpsForms";
import { fmtDate, fmtDateTime } from "@/modules/shared/records";
import { getDb } from "@/platform/db";
import { AppError } from "@/platform/errors";

export const metadata: Metadata = { title: "Driver" };

const LABEL: Record<string, string> = {
  identity: "Identity",
  licence: "Driver's licence",
  guarantor: "Guarantor",
  background: "Background check (optional for now)",
};

export default async function OpsDriver({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("staff", { permission: "drivers.review" });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const d = await getDriverWithChecks(getDb(), id).catch((e: unknown) => {
    if (e instanceof AppError && e.category === "NOT_FOUND") notFound();
    throw e;
  });
  return (
    <>
      <p>
        <Link href="/ops/drivers">← Drivers</Link>
      </p>
      <div className="page-title-row">
        <h1>{d.fullName}</h1>
        <span className="badge">{d.profile.status.replace("_", " ")}</span>
      </div>
      <div className="cols">
        <div className="stack">
          {d.checks.map((c) => (
            <section className="panel" key={c.id}>
              <h2>
                {LABEL[c.kind]} — <span className="muted">{c.status}</span>
              </h2>
              {c.reviewedAt ? (
                <p className="muted">
                  Last reviewed {fmtDateTime(c.reviewedAt)}: {c.reviewNote}
                  {c.expiresAt ? ` · valid until ${fmtDate(c.expiresAt)}` : ""}
                </p>
              ) : null}
              <CheckReview checkId={c.id} status={c.status} />
            </section>
          ))}
        </div>
        <div className="stack">
          <section className="panel">
            <h2>Profile</h2>
            <dl className="kv">
              <dt>Shown as</dt>
              <dd>{d.profile.firstName}</dd>
              <dt>Email</dt>
              <dd>{d.email}</dd>
              <dt>Phone</dt>
              <dd>{d.phone}</dd>
              <dt>Experience</dt>
              <dd>{d.profile.yearsExperience} years</dd>
              <dt>Drives</dt>
              <dd>{d.profile.transmissions.join(", ")}</dd>
              <dt>Cities</dt>
              <dd>{d.profile.cities.join(", ")}</dd>
              <dt>Gender</dt>
              <dd>{d.profile.gender}</dd>
              <dt>Training</dt>
              <dd>{d.profile.trainingStatus}</dd>
            </dl>
            {d.profile.bio ? <p style={{ marginTop: 12 }}>{d.profile.bio}</p> : null}
          </section>
          <section className="panel">
            <h2>Status</h2>
            <p className="muted">
              Eligibility updates automatically when checks pass. Use this to suspend, reject or
              reinstate.
            </p>
            <DriverStatusForm driverId={d.profile.userId} />
          </section>
        </div>
      </div>
    </>
  );
}
