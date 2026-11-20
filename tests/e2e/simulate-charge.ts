// LOCAL TESTING ONLY. Records a successful charge for a booking through the real payment service,
// for trying the flow before you have Paystack test keys. Refuses to run in production.
// Usage: DATABASE_URL=... pnpm exec tsx tests/e2e/simulate-charge.ts FD-ABC123
import { eq } from "drizzle-orm";
import { bookings, payments } from "../../src/db/schema";
import { applyVerifiedCharge } from "../../src/modules/payments/service";
import { closeDb, getDb } from "../../src/platform/db";

if (process.env.APP_ENV === "production" || process.env.VERCEL) {
  console.error("Refusing to simulate payments outside local development.");
  process.exit(1);
}
const ref = process.argv[2];
if (!ref) {
  console.error("Usage: tsx tests/e2e/simulate-charge.ts <booking ref>");
  process.exit(1);
}
const db = getDb();
const [b] = await db.select().from(bookings).where(eq(bookings.ref, ref));
if (!b?.quoteKobo || b.status !== "payment_pending") {
  console.error("Booking not found or not waiting for payment.");
  await closeDb();
  process.exit(1);
}
const reference = `${ref}-localtest-${Date.now()}`;
await db.insert(payments).values({ bookingId: b.id, reference, amountKobo: b.quoteKobo });
const result = await applyVerifiedCharge(db, {
  reference,
  status: "success",
  amountKobo: b.quoteKobo,
  currency: "NGN",
  paidAt: new Date().toISOString(),
  channel: "local-test",
  gatewayResponse: "Simulated locally",
});
console.log(result);
await closeDb();
