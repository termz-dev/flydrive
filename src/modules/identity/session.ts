import { and, eq, gt, isNull } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { sessions, staffMfa, staffPermissions, users } from "@/db/schema";
import { getDb, isDbConfigured } from "@/platform/db";
import { randomToken, sha256 } from "./crypto";

export const SESSION_COOKIE = "fd_session";
const CUSTOMER_TTL_DAYS = 14;
const STAFF_TTL_HOURS = 12;

export type Role = "customer" | "driver" | "staff";
export type Permission = (typeof staffPermissions.$inferSelect)["permission"];

export interface SessionUser {
  id: string;
  role: Role;
  email: string;
  fullName: string;
  phone: string | null;
  permissions: Permission[];
  mfaEnrolled: boolean;
  mfaVerified: boolean;
  tokenHash: string;
}

export async function createSession(userId: string, role: Role): Promise<void> {
  const token = randomToken();
  const ttlMs = role === "staff" ? STAFF_TTL_HOURS * 3600e3 : CUSTOMER_TTL_DAYS * 86400e3;
  const expiresAt = new Date(Date.now() + ttlMs);
  await getDb()
    .insert(sessions)
    .values({ tokenHash: sha256(token), userId, expiresAt });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token)
    await getDb()
      .delete(sessions)
      .where(eq(sessions.tokenHash, sha256(token)));
  jar.delete(SESSION_COOKIE);
}

/** Current user, or null. Never throws for a missing/expired/invalid session. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isDbConfigured()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const db = getDb();
  const tokenHash = sha256(token);
  const [row] = await db
    .select({
      id: users.id,
      role: users.role,
      email: users.email,
      fullName: users.fullName,
      phone: users.phone,
      mfaVerifiedAt: sessions.mfaVerifiedAt,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        gt(sessions.expiresAt, new Date()),
        isNull(users.disabledAt),
      ),
    );
  if (!row) return null;

  let permissions: Permission[] = [];
  let mfaEnrolled = false;
  if (row.role === "staff") {
    permissions = (
      await db
        .select({ p: staffPermissions.permission })
        .from(staffPermissions)
        .where(eq(staffPermissions.userId, row.id))
    ).map((r) => r.p);
    const [m] = await db
      .select({ enabledAt: staffMfa.enabledAt })
      .from(staffMfa)
      .where(eq(staffMfa.userId, row.id));
    mfaEnrolled = Boolean(m?.enabledAt);
  }
  return {
    id: row.id,
    role: row.role,
    email: row.email,
    fullName: row.fullName,
    phone: row.phone,
    permissions,
    mfaEnrolled,
    mfaVerified: Boolean(row.mfaVerifiedAt),
    tokenHash,
  };
}

async function currentPath(): Promise<string> {
  const h = await headers();
  return h.get("x-pathname") ?? "/";
}

/** Page guard for portal layouts and pages. Redirects instead of rendering anything. */
export async function requireRole(
  role: Role,
  opts: { permission?: Permission } = {},
): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(await currentPath())}`);
  if (user.role !== role) redirect("/sign-in?wrong_role=1");
  if (role === "staff") {
    if (!user.mfaEnrolled) redirect("/ops-mfa/setup");
    if (!user.mfaVerified) redirect("/ops-mfa/verify");
    if (opts.permission && !user.permissions.includes(opts.permission)) redirect("/ops?denied=1");
  }
  return user;
}

export function homeFor(role: Role): "/account" | "/driver" | "/ops" {
  return role === "customer" ? "/account" : role === "driver" ? "/driver" : "/ops";
}
