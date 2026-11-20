import { eq, inArray } from "drizzle-orm";
import { auditLog, notifications, staffPermissions, users } from "@/db/schema";
import type { DbOrTx } from "@/platform/db";
import type { Permission } from "@/modules/identity/session";

/** In-app notification. Email/SMS delivery is added when a provider is chosen (OPEN). */
export async function notify(
  db: DbOrTx,
  userIds: string | readonly string[],
  msg: { title: string; body: string; href?: string },
) {
  const ids = typeof userIds === "string" ? [userIds] : [...new Set(userIds)];
  if (ids.length === 0) return;
  await db
    .insert(notifications)
    .values(
      ids.map((userId) => ({ userId, title: msg.title, body: msg.body, href: msg.href ?? null })),
    );
}

export async function staffWith(db: DbOrTx, permission: Permission): Promise<string[]> {
  const rows = await db
    .select({ id: staffPermissions.userId })
    .from(staffPermissions)
    .innerJoin(users, eq(users.id, staffPermissions.userId))
    .where(eq(staffPermissions.permission, permission));
  return rows.map((r) => r.id);
}

export async function audit(
  db: DbOrTx,
  actorId: string | null,
  action: string,
  target: { type: string; id?: string | null },
  data?: Record<string, unknown>,
) {
  await db.insert(auditLog).values({
    actorId,
    action,
    targetType: target.type,
    targetId: target.id ?? null,
    data: data ?? null,
  });
}

export async function userNames(db: DbOrTx, ids: string[]): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const rows = await db
    .select({ id: users.id, n: users.fullName })
    .from(users)
    .where(inArray(users.id, ids));
  return new Map(rows.map((r) => [r.id, r.n]));
}

export const naira = (kobo: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);

const LAGOS = "Africa/Lagos";
export const fmtDateTime = (d: Date) =>
  new Intl.DateTimeFormat("en-NG", {
    timeZone: LAGOS,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
export const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("en-NG", {
    timeZone: LAGOS,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
