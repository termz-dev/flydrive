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
  });
  return cached;
}
