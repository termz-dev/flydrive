import { and, asc, eq, gt, inArray, isNull, lt, notInArray, sql } from "drizzle-orm";
import {
  REQUIRED_CHECKS,
  candidates,
  driverBlocks,
  driverChecks,
  driverProfiles,
  users,
} from "@/db/schema";
import { hashPassword } from "@/modules/identity/password";
import { audit, notify } from "@/modules/shared/records";
import { notFound } from "@/modules/shared/guards";
import type { Db, DbOrTx } from "@/platform/db";
import { AppError } from "@/platform/errors";

export type City = "lagos" | "ibadan";
export type Transmission = "manual" | "automatic";

export interface DriverApplication {
  fullName: string;
  firstName: string;
  email: string;
  phone: string;
  password: string;
  yearsExperience: number;
  transmissions: Transmission[];
  cities: City[];
  gender: "female" | "male" | "undisclosed";
  bio?: string | undefined;
}

/** Creates the driver account, profile and pending checks in one transaction. */
export async function applyAsDriver(db: Db, a: DriverApplication): Promise<string> {
  const passwordHash = await hashPassword(a.password);
  return db.transaction(async (tx) => {
    const [u] = await tx
      .insert(users)
      .values({
        role: "driver",
        email: a.email,
        phone: a.phone,
        fullName: a.fullName,
        passwordHash,
      })
      .onConflictDoNothing()
      .returning({ id: users.id });
    if (!u)
      throw new AppError(
        "CONFLICT",
        "ACCOUNT_EXISTS",
        "An account already uses that email or phone number. Try signing in.",
      );
    await tx.insert(driverProfiles).values({
      userId: u.id,
      firstName: a.firstName,
      yearsExperience: a.yearsExperience,
      transmissions: a.transmissions,
      cities: a.cities,
      gender: a.gender,
      bio: a.bio ?? null,
      status: "under_review",
    });
    await tx.insert(driverChecks).values(
      (["identity", "licence", "guarantor", "background"] as const).map((kind) => ({
        driverId: u.id,
        kind,
      })),
    );
    return u.id;
  });
}

export async function getDriverWithChecks(db: DbOrTx, driverId: string) {
  const [p] = await db
    .select({
      profile: driverProfiles,
      fullName: users.fullName,
      email: users.email,
      phone: users.phone,
    })
    .from(driverProfiles)
    .innerJoin(users, eq(users.id, driverProfiles.userId))
    .where(eq(driverProfiles.userId, driverId));
  if (!p) throw notFound("Driver");
  const checks = await db
    .select()
    .from(driverChecks)
    .where(eq(driverChecks.driverId, driverId))
    .orderBy(asc(driverChecks.kind));
  return { ...p, checks };
}

/** Eligible = all required checks passed and unexpired, and not suspended/rejected. */
export function computeEligible(
  checks: { kind: string; status: string; expiresAt: Date | null }[],
  now = new Date(),
): boolean {
  return REQUIRED_CHECKS.every((k) =>
    checks.some(
      (c) => c.kind === k && c.status === "passed" && (!c.expiresAt || c.expiresAt > now),
    ),
  );
}

export async function reviewCheck(
  db: Db,
  staffId: string,
  input: {
    checkId: string;
    status: "passed" | "failed" | "pending";
    note: string;
    expiresAt?: Date | null;
  },
) {
  return db.transaction(async (tx) => {
    const [c] = await tx
      .select()
      .from(driverChecks)
      .where(eq(driverChecks.id, input.checkId))
      .for("update");
    if (!c) throw notFound("Check");
    await tx
      .update(driverChecks)
      .set({
        status: input.status,
        reviewNote: input.note,
        reviewedBy: staffId,
        reviewedAt: new Date(),
        expiresAt: input.expiresAt ?? null,
      })
      .where(eq(driverChecks.id, c.id));
    await audit(
      tx,
      staffId,
      "driver.check_reviewed",
      { type: "driver", id: c.driverId },
      { kind: c.kind, status: input.status },
    );
    await recomputeStatus(tx, c.driverId, staffId);
    return c.driverId;
  });
}

async function recomputeStatus(tx: DbOrTx, driverId: string, staffId: string) {
  const [p] = await tx.select().from(driverProfiles).where(eq(driverProfiles.userId, driverId));
  if (!p || p.status === "suspended" || p.status === "rejected") return;
  const checks = await tx.select().from(driverChecks).where(eq(driverChecks.driverId, driverId));
  const next = computeEligible(checks) ? "eligible" : "under_review";
  if (next !== p.status) {
    await tx
      .update(driverProfiles)
      .set({ status: next })
      .where(eq(driverProfiles.userId, driverId));
    await audit(
      tx,
      staffId,
      "driver.status_changed",
      { type: "driver", id: driverId },
      { from: p.status, to: next },
    );
    if (next === "eligible") {
      await notify(tx, driverId, {
        title: "You're cleared to drive",
        body: "Your checks are complete. You can now be offered Flydrive assignments.",
        href: "/driver",
      });
    }
  }
}

export async function setDriverStatus(
  db: Db,
  staffId: string,
  driverId: string,
  status: "suspended" | "rejected" | "under_review",
  reason: string,
) {
  await db.transaction(async (tx) => {
    const [p] = await tx
      .select()
      .from(driverProfiles)
      .where(eq(driverProfiles.userId, driverId))
      .for("update");
    if (!p) throw notFound("Driver");
    await tx.update(driverProfiles).set({ status }).where(eq(driverProfiles.userId, driverId));
    await audit(
      tx,
      staffId,
      "driver.status_changed",
      { type: "driver", id: driverId },
      { from: p.status, to: status, reason },
    );
    if (status === "under_review") await recomputeStatus(tx, driverId, staffId);
  });
}

/**
 * Drivers who can be shortlisted for a time window: eligible, serve the city, drive the
 * transmission, have no active block overlapping, and weren't excluded from this booking.
 */
export async function availableDrivers(
  db: DbOrTx,
  q: {
    city: City;
    startsAt: Date;
    endsAt: Date;
    transmission?: Transmission | null;
    bookingId?: string;
    preferFemale?: boolean;
  },
) {
  const busy = db
    .select({ id: driverBlocks.driverId })
    .from(driverBlocks)
    .where(
      and(
        isNull(driverBlocks.releasedAt),
        lt(driverBlocks.startsAt, q.endsAt),
        gt(driverBlocks.endsAt, q.startsAt),
      ),
    );
  const conds = [
    eq(driverProfiles.status, "eligible"),
    sql`${q.city} = any(${driverProfiles.cities})`,
    notInArray(driverProfiles.userId, busy),
  ];
  if (q.transmission) conds.push(sql`${q.transmission} = any(${driverProfiles.transmissions})`);
  if (q.bookingId) {
    const excluded = db
      .select({ id: candidates.driverId })
      .from(candidates)
      .where(
        and(eq(candidates.bookingId, q.bookingId), sql`${candidates.excludedReason} is not null`),
      );
    conds.push(notInArray(driverProfiles.userId, excluded));
  }
  const rows = await db
    .select({ profile: driverProfiles, fullName: users.fullName })
    .from(driverProfiles)
    .innerJoin(users, eq(users.id, driverProfiles.userId))
    .where(and(...conds))
    .orderBy(asc(driverProfiles.firstName));
  if (q.preferFemale)
    rows.sort(
      (a, b) => Number(b.profile.gender === "female") - Number(a.profile.gender === "female"),
    );
  return rows;
}

export async function addUnavailability(db: Db, driverId: string, startsAt: Date, endsAt: Date) {
  if (endsAt <= startsAt)
    throw new AppError("INVALID_INPUT", "BAD_RANGE", "The end must be after the start.");
  try {
    await db.insert(driverBlocks).values({ driverId, kind: "unavailable", startsAt, endsAt });
  } catch (e) {
    if ((e as { cause?: { code?: string } }).cause?.code === "23P01") {
      throw new AppError(
        "CONFLICT",
        "OVERLAP",
        "That overlaps time you've already blocked or a job you've accepted.",
      );
    }
    throw e;
  }
}

export async function removeUnavailability(db: Db, driverId: string, blockId: string) {
  const r = await db
    .update(driverBlocks)
    .set({ releasedAt: new Date() })
    .where(
      and(
        eq(driverBlocks.id, blockId),
        eq(driverBlocks.driverId, driverId),
        eq(driverBlocks.kind, "unavailable"),
        isNull(driverBlocks.releasedAt),
      ),
    )
    .returning({ id: driverBlocks.id });
  if (r.length === 0) throw notFound("That time block");
}

export async function driverIds(db: DbOrTx, ids: string[]) {
  if (ids.length === 0) return [];
  return db.select().from(driverProfiles).where(inArray(driverProfiles.userId, ids));
}
