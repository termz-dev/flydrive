import { runExpiryJobs } from "@/modules/booking/jobs";
import { getDb } from "@/platform/db";

export const dynamic = "force-dynamic";

/** Vercel Cron calls this with "Authorization: Bearer $CRON_SECRET". */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("unauthorized", { status: 401 });
  }
  const result = await runExpiryJobs(getDb());
  return Response.json({ ok: true, ...result });
}
