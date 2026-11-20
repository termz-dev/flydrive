"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auditLog, sessions, staffMfa, users } from "@/db/schema";
import { formObject, toActionError, type ActionState } from "@/platform/action";
import { bookingsOpen } from "@/platform/config";
import { getDb } from "@/platform/db";
import { AppError, FeatureUnavailableError } from "@/platform/errors";
import { decrypt, encrypt } from "./crypto";
import { burnPasswordCheck, hashPassword, passwordProblem, verifyPassword } from "./password";
import { rateLimit } from "./rate-limit";
import { createSession, destroySession, getSessionUser, homeFor } from "./session";
import { newTotpSecret, verifyTotp } from "./totp";

async function clientKey(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim();
}

const email = z.string().trim().toLowerCase().email("Enter a valid email address.").max(200);
const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .transform((v) => (v.startsWith("0") && v.length === 11 ? `+234${v.slice(1)}` : v))
  .pipe(
    z
      .string()
      .regex(/^\+[1-9]\d{7,14}$/, "Enter a phone number like 0803 123 4567 or +234 803 123 4567."),
  );

/** Only same-site relative paths, so ?next= can't send people elsewhere. */
function safeNext(next: string | undefined): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return null;
  return next;
}

/* ------------------------------------------------------------------ customer sign-up */

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  email,
  phone,
  password: z.string(),
});

export async function signUpCustomer(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    if (!bookingsOpen()) throw new FeatureUnavailableError("Customer sign-up");
    const input = signUpSchema.parse(formObject(fd));
    const problem = passwordProblem(input.password);
    if (problem)
      throw new AppError("INVALID_INPUT", "WEAK_PASSWORD", problem, {
        fieldErrors: [{ field: "password", message: problem }],
      });
    await rateLimit(`signup:${await clientKey()}`, 10, 3600);
    const db = getDb();
    const passwordHash = await hashPassword(input.password);
    const inserted = await db
      .insert(users)
      .values({
        role: "customer",
        email: input.email,
        phone: input.phone,
        fullName: input.fullName,
        passwordHash,
      })
      .onConflictDoNothing()
      .returning({ id: users.id });
    if (!inserted[0]) {
      throw new AppError(
        "CONFLICT",
        "ACCOUNT_EXISTS",
        "An account already uses that email or phone number. Try signing in.",
      );
    }
    await createSession(inserted[0].id, "customer");
  } catch (err) {
    return toActionError(err, "identity");
  }
  redirect("/account?welcome=1");
}

/* ------------------------------------------------------------------ sign in / out */

const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password.").max(200),
  next: z.string().optional(),
});

export async function signIn(_: ActionState, fd: FormData): Promise<ActionState> {
  let target: string;
  try {
    const input = signInSchema.parse(formObject(fd));
    const ip = await clientKey();
    await rateLimit(`signin:ip:${ip}`, 30, 900);
    await rateLimit(`signin:acct:${input.email}`, 8, 900);
    const db = getDb();
    const [u] = await db.select().from(users).where(eq(users.email, input.email));
    const ok =
      u && !u.disabledAt
        ? await verifyPassword(u.passwordHash, input.password)
        : (await burnPasswordCheck(input.password), false);
    if (!u || !ok)
      throw new AppError(
        "UNAUTHENTICATED",
        "BAD_CREDENTIALS",
        "That email and password don't match an account.",
      );
    await createSession(u.id, u.role);
    const next = safeNext(input.next);
    target = u.role === "staff" ? "/ops-mfa/verify" : (next ?? homeFor(u.role));
  } catch (err) {
    return toActionError(err, "identity");
  }
  redirect(target as Route);
}

export async function signOut(): Promise<void> {
  await destroySession();
  redirect("/sign-in?signed_out=1");
}

/* ------------------------------------------------------------------ staff MFA */

/** Creates (or returns) a pending TOTP secret for the signed-in staff member. */
export async function ensurePendingMfaSecret(): Promise<{ secret: string; email: string } | null> {
  const user = await getSessionUser();
  if (!user || user.role !== "staff" || user.mfaEnrolled) return null;
  const db = getDb();
  const [row] = await db.select().from(staffMfa).where(eq(staffMfa.userId, user.id));
  if (row) return { secret: decrypt(row.secretEnc), email: user.email };
  const secret = newTotpSecret();
  await db
    .insert(staffMfa)
    .values({ userId: user.id, secretEnc: encrypt(secret) })
    .onConflictDoNothing();
  const [again] = await db.select().from(staffMfa).where(eq(staffMfa.userId, user.id));
  return { secret: decrypt(again!.secretEnc), email: user.email };
}

const codeSchema = z.object({ code: z.string().trim().min(6, "Enter the 6-digit code.").max(8) });

async function checkCode(userId: string, code: string): Promise<void> {
  const db = getDb();
  await rateLimit(`mfa:${userId}`, 6, 600);
  const [m] = await db.select().from(staffMfa).where(eq(staffMfa.userId, userId));
  if (!m) throw new AppError("FORBIDDEN", "MFA_NOT_SET_UP", "Set up your authenticator app first.");
  const step = verifyTotp(decrypt(m.secretEnc), code);
  if (step === null || (m.lastUsedStep !== null && step <= m.lastUsedStep)) {
    throw new AppError(
      "UNAUTHENTICATED",
      "MFA_BAD_CODE",
      "That code didn't work. Wait for a new code and try again.",
      {
        fieldErrors: [{ field: "code", message: "Code not accepted." }],
      },
    );
  }
  await db
    .update(staffMfa)
    .set({ lastUsedStep: step, enabledAt: m.enabledAt ?? new Date() })
    .where(eq(staffMfa.userId, userId));
}

export async function verifyMfa(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "staff")
      throw new AppError("UNAUTHENTICATED", "SIGN_IN", "Please sign in again.");
    const { code } = codeSchema.parse(formObject(fd));
    const wasEnrolled = user.mfaEnrolled;
    await checkCode(user.id, code);
    const db = getDb();
    await db
      .update(sessions)
      .set({ mfaVerifiedAt: new Date() })
      .where(and(eq(sessions.tokenHash, user.tokenHash), eq(sessions.userId, user.id)));
    if (!wasEnrolled) {
      await db.insert(auditLog).values({
        actorId: user.id,
        action: "staff.mfa_enrolled",
        targetType: "user",
        targetId: user.id,
      });
    }
  } catch (err) {
    return toActionError(err, "identity");
  }
  redirect("/ops");
}
