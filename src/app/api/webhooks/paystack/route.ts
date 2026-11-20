import { getGateway, verifyPaystackSignature } from "@/modules/payments/gateway";
import { applyVerifiedCharge, markWebhook, recordWebhook } from "@/modules/payments/service";
import { getDb } from "@/platform/db";
import { createLogger } from "@/platform/logger";

export const dynamic = "force-dynamic";
const log = createLogger("info");

/**
 * Paystack webhook. Verifies the signature on the raw body, stores the event once, then
 * re-verifies the charge with Paystack's API before changing any booking.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyPaystackSignature(raw, req.headers.get("x-paystack-signature"))) {
    return new Response("invalid signature", { status: 401 });
  }
  let event: { event?: string; data?: { reference?: string; id?: number } };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("bad json", { status: 400 });
  }
  const reference = event.data?.reference;
  if (!event.event || !reference) return new Response("ignored", { status: 200 });

  const db = getDb();
  const key = `${event.event}:${reference}:${event.data?.id ?? ""}`;
  const id = await recordWebhook(db, "paystack", key, event.event, event);
  if (!id) return new Response("duplicate", { status: 200 });

  if (event.event !== "charge.success") {
    await markWebhook(db, id);
    return new Response("ok", { status: 200 });
  }
  try {
    const charge = await getGateway().verify(reference);
    const outcome = await applyVerifiedCharge(db, charge);
    await markWebhook(db, id);
    log.info("paystack webhook processed", { module: "payments", outcome, code: event.event });
    return new Response("ok", { status: 200 });
  } catch (err) {
    await markWebhook(db, id, err instanceof Error ? err.message : "error");
    log.error("paystack webhook failed", {
      module: "payments",
      error: err instanceof Error ? err : String(err),
    });
    // 500 makes Paystack retry later.
    return new Response("retry", { status: 500 });
  }
}
