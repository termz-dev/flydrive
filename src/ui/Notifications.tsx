import Link from "next/link";
import type { Route } from "next";
import { desc, eq } from "drizzle-orm";
import { notifications } from "@/db/schema";
import { fmtDateTime } from "@/modules/shared/records";
import { getDb } from "@/platform/db";

export async function Notifications({ userId, limit = 6 }: { userId: string; limit?: number }) {
  const rows = await getDb()
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
  return (
    <section className="panel" aria-labelledby="notif-h">
      <h2 id="notif-h">Updates</h2>
      {rows.length === 0 ? (
        <p className="empty">Nothing yet.</p>
      ) : (
        <ul className="timeline">
          {rows.map((n) => (
            <li key={n.id}>
              <time dateTime={n.createdAt.toISOString()}>{fmtDateTime(n.createdAt)}</time>
              {n.href ? <Link href={n.href as Route}>{n.title}</Link> : <strong>{n.title}</strong>}
              <div className="muted">{n.body}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
