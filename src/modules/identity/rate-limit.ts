import { and, count, eq, gt, lt } from "drizzle-orm";
import { rateLimits } from "@/db/schema";
import { getDb } from "@/platform/db";
import { AppError } from "@/platform/errors";

/**
 * Fixed-window limiter backed by Postgres (works across Vercel instances). Records the attempt,
 * then throws RATE_LIMITED if the key has more than `max` attempts in the window.
 */
export async function rateLimit(key: string, max: number, windowSeconds: number): Promise<void> {
  const db = getDb();
  const since = new Date(Date.now() - windowSeconds * 1000);
  await db.insert(rateLimits).values({ key });
  const [row] = await db
    .select({ n: count() })
    .from(rateLimits)
    .where(and(eq(rateLimits.key, key), gt(rateLimits.at, since)));
  if ((row?.n ?? 0) > max) {
    throw new AppError(
      "RATE_LIMITED",
      "RATE_LIMITED",
      "Too many attempts. Please wait a few minutes and try again.",
      {
        retryable: true,
      },
    );
  }
}

export async function pruneRateLimits(olderThanSeconds = 86400): Promise<void> {
  await getDb()
    .delete(rateLimits)
    .where(lt(rateLimits.at, new Date(Date.now() - olderThanSeconds * 1000)));
}
