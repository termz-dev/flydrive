import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { and, count, eq, inArray } from "drizzle-orm";
import { bookings, driverProfiles, supportCases } from "@/db/schema";
import { requireRole } from "@/modules/identity/session";
import { getDb } from "@/platform/db";
import { Notice } from "@/ui/blocks";
import { Notifications } from "@/ui/Notifications";

export const metadata: Metadata = { title: "Operations" };

export default async function OpsHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireRole("staff");
  const sp = await searchParams;
  const db = getDb();
  const n = async (q: Promise<{ n: number }[]>) => (await q)[0]?.n ?? 0;
  const [newReq, urgent, payReview, confirmed, cases, review] = await Promise.all([
    n(db.select({ n: count() }).from(bookings).where(eq(bookings.status, "submitted"))),
    n(
      db
        .select({ n: count() })
        .from(bookings)
        .where(
          and(
            eq(bookings.shortNotice, true),
            inArray(bookings.status, ["submitted", "candidates_ready"]),
          ),
        ),
    ),
    n(db.select({ n: count() }).from(bookings).where(eq(bookings.status, "payment_review"))),
    n(
      db
        .select({ n: count() })
        .from(bookings)
        .where(inArray(bookings.status, ["confirmed", "in_progress"])),
    ),
    n(db.select({ n: count() }).from(supportCases).where(eq(supportCases.status, "open"))),
    n(
      db
        .select({ n: count() })
        .from(driverProfiles)
        .where(eq(driverProfiles.status, "under_review")),
    ),
  ]);
  const tiles: [string, number, Route][] = [
    ["New requests", newReq, "/ops/bookings?status=submitted" as Route],
    ["Short notice", urgent, "/ops/bookings?short=1" as Route],
    ["Payments to verify", payReview, "/ops/payments"],
    ["Confirmed / in progress", confirmed, "/ops/bookings?status=confirmed" as Route],
    ["Open incidents", cases, "/ops/incidents"],
    ["Drivers to review", review, "/ops/drivers?status=under_review" as Route],
  ];
  return (
    <>
      <h1>Overview</h1>
      {sp.denied ? (
        <Notice title="You don't have permission for that page" tone="pending">
          <p>Ask an admin to grant the permission.</p>
        </Notice>
      ) : null}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        {tiles.map(([label, value, href]) => (
          <Link key={label} className="stat" href={href}>
            <strong>{value}</strong>
            {label}
          </Link>
        ))}
      </div>
      <Notifications userId={user.id} limit={10} />
    </>
  );
}
