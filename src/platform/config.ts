import { z } from "zod";

/**
 * Typed, validated environment. Parsing happens once per process; an invalid value
 * throws with the variable name (never its value) so readiness fails loudly.
 */
const optionalNonEmpty = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

export const envSchema = z.object({
  APP_ENV: z.enum(["local", "ci", "staging", "production"]).default("local"),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_CONTACT_EMAIL: optionalNonEmpty.pipe(z.email().optional()),
  NEXT_PUBLIC_CONTACT_PHONE: optionalNonEmpty.pipe(
    z
      .string()
      .regex(/^\+[1-9]\d{7,14}$/, "must be E.164, e.g. +2348000000000")
      .optional(),
  ),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  /** "true" opens customer sign-up, booking requests and driver applications. Build-time. */
  NEXT_PUBLIC_BOOKINGS_OPEN: z.enum(["true", "false"]).default("false"),
  /** Postgres URL. Local in development; Supabase pooler (port 6543) on Vercel. */
  DATABASE_URL: optionalNonEmpty.pipe(z.string().startsWith("postgres").optional()),
  /** 32 random bytes, base64. Encrypts staff MFA secrets. */
  APP_ENCRYPTION_KEY: optionalNonEmpty.pipe(
    z
      .string()
      .refine((v) => Buffer.from(v, "base64").length === 32, "must be 32 bytes, base64")
      .optional(),
  ),
  PAYSTACK_SECRET_KEY: optionalNonEmpty.pipe(z.string().startsWith("sk_").optional()),
  /** Shared secret Vercel Cron sends as a Bearer token to /api/cron/*. */
  CRON_SECRET: optionalNonEmpty.pipe(z.string().min(16).optional()),
});

export type AppConfig = z.infer<typeof envSchema>;

export class ConfigError extends Error {
  override readonly name = "ConfigError";
  constructor(readonly invalidKeys: string[]) {
    super(`Invalid environment configuration: ${invalidKeys.join(", ")}`);
  }
}

export function parseConfig(source: Record<string, string | undefined>): AppConfig {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const keys = [...new Set(result.error.issues.map((i) => String(i.path[0] ?? "unknown")))];
    throw new ConfigError(keys);
  }
  return result.data;
}

let cached: AppConfig | undefined;

export function getConfig(): AppConfig {
  cached ??= parseConfig({
    APP_ENV: process.env.APP_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_CONTACT_PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE,
    LOG_LEVEL: process.env.LOG_LEVEL,
    NEXT_PUBLIC_BOOKINGS_OPEN: process.env.NEXT_PUBLIC_BOOKINGS_OPEN,
    DATABASE_URL: process.env.DATABASE_URL,
    APP_ENCRYPTION_KEY: process.env.APP_ENCRYPTION_KEY,
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
    CRON_SECRET: process.env.CRON_SECRET,
  });
  return cached;
}

/** Whether the public can sign up, request bookings and apply to drive. */
export function bookingsOpen(): boolean {
  return process.env.NEXT_PUBLIC_BOOKINGS_OPEN === "true";
}
