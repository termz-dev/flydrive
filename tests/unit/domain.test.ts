import { createHmac } from "node:crypto";
import { TOTP, Secret } from "otpauth";
import { beforeAll, describe, expect, it } from "vitest";
import { bookingStatusEnum } from "@/db/schema";
import {
  TRANSITIONS,
  TERMINAL,
  canTransition,
  type BookingStatus,
  type Command,
} from "@/modules/booking/states";
import { computeEligible } from "@/modules/drivers/service";
import { decrypt, encrypt, sha256 } from "@/modules/identity/crypto";
import { passwordProblem } from "@/modules/identity/password";
import { newTotpSecret, verifyTotp } from "@/modules/identity/totp";
import { verifyPaystackSignature } from "@/modules/payments/gateway";
import { lagosDateTime, nairaToKobo, toLagosInput } from "@/modules/shared/parse";

beforeAll(() => {
  process.env.APP_ENCRYPTION_KEY = Buffer.alloc(32, 3).toString("base64");
});

describe("booking state machine", () => {
  const statuses = bookingStatusEnum.enumValues as readonly BookingStatus[];

  it("only uses statuses that exist in the database enum", () => {
    for (const r of Object.values(TRANSITIONS)) {
      expect(statuses).toContain(r.to);
      for (const f of r.from) expect(statuses).toContain(f);
    }
  });

  it("has no transitions out of completed or cancelled", () => {
    for (const r of Object.values(TRANSITIONS))
      for (const t of TERMINAL) expect(r.from).not.toContain(t);
  });

  it("separates selection, acceptance, payment and confirmation", () => {
    expect(TRANSITIONS["customer.select_driver"].to).toBe("offer_pending");
    expect(TRANSITIONS["driver.accept"].to).toBe("payment_pending");
    expect(TRANSITIONS["system.payment_succeeded"].to).toBe("payment_review");
    expect(TRANSITIONS["ops.confirm"].to).toBe("confirmed");
  });

  it("enforces who can do what", () => {
    expect(canTransition("ops.confirm", "payment_review", "staff")).toBe(true);
    expect(canTransition("ops.confirm", "payment_review", "customer")).toBe(false);
    expect(canTransition("ops.confirm", "payment_pending", "staff")).toBe(false);
    expect(canTransition("customer.cancel", "confirmed", "customer")).toBe(false);
    expect(canTransition("system.payment_succeeded", "payment_pending", "customer")).toBe(false);
    const commands = Object.keys(TRANSITIONS) as Command[];
    expect(commands.length).toBeGreaterThan(10);
  });
});

describe("driver eligibility", () => {
  const passed = (kind: string, expiresAt: Date | null = null) => ({
    kind,
    status: "passed",
    expiresAt,
  });
  it("needs identity, licence and guarantor — background is optional for now", () => {
    expect(computeEligible([passed("identity"), passed("licence"), passed("guarantor")])).toBe(
      true,
    );
    expect(computeEligible([passed("identity"), passed("licence")])).toBe(false);
  });
  it("treats expired checks as not passed", () => {
    expect(
      computeEligible([
        passed("identity"),
        passed("licence", new Date(Date.now() - 1000)),
        passed("guarantor"),
      ]),
    ).toBe(false);
  });
});

describe("Paystack webhook signature", () => {
  const secret = "sk_test_abc";
  const body = JSON.stringify({ event: "charge.success", data: { reference: "FD-1" } });
  const sig = createHmac("sha512", secret).update(body).digest("hex");
  it("accepts the right signature", () =>
    expect(verifyPaystackSignature(body, sig, secret)).toBe(true));
  it("rejects a tampered body, wrong key or missing header", () => {
    expect(verifyPaystackSignature(body + " ", sig, secret)).toBe(false);
    expect(verifyPaystackSignature(body, sig, "sk_test_other")).toBe(false);
    expect(verifyPaystackSignature(body, null, secret)).toBe(false);
    expect(verifyPaystackSignature(body, "zz", secret)).toBe(false);
  });
});

describe("identity helpers", () => {
  it("round-trips encryption and detects tampering", () => {
    const enc = encrypt("JBSWY3DPEHPK3PXP");
    expect(enc).not.toContain("JBSWY3DP");
    expect(decrypt(enc)).toBe("JBSWY3DPEHPK3PXP");
    const [iv, tag, ct] = enc.split(".");
    expect(() => decrypt([iv, tag, ct!.slice(0, -2) + "AA"].join("."))).toThrow();
  });

  it("hashes tokens deterministically", () => expect(sha256("a")).toHaveLength(64));

  it("verifies TOTP codes for the current step only (±1)", () => {
    const secret = newTotpSecret();
    const now = Date.now();
    const code = new TOTP({ secret: Secret.fromBase32(secret), period: 30 }).generate({
      timestamp: now,
    });
    const step = verifyTotp(secret, code, now);
    expect(step).toBe(Math.floor(now / 30000));
    expect(verifyTotp(secret, code, now + 5 * 60_000)).toBeNull();
    expect(verifyTotp(secret, "12345", now)).toBeNull();
  });

  it("requires passwords of at least 10 characters", () => {
    expect(passwordProblem("short")).not.toBeNull();
    expect(passwordProblem("long enough pw")).toBeNull();
  });
});

describe("parsing", () => {
  it("reads datetime-local as Lagos time", () => {
    const d = lagosDateTime.parse("2027-01-10T09:00");
    expect(d.toISOString()).toBe("2027-01-10T08:00:00.000Z");
    expect(toLagosInput(d)).toBe("2027-01-10T09:00");
  });
  it("converts naira to kobo", () => {
    expect(nairaToKobo.parse("45,000")).toBe(4_500_000);
    expect(nairaToKobo.parse("₦ 1500.50")).toBe(150_050);
    expect(nairaToKobo.safeParse("abc").success).toBe(false);
    expect(nairaToKobo.safeParse("0").success).toBe(false);
  });
});
