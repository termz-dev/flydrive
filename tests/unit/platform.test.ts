import { describe, expect, it } from "vitest";
import { ConfigError, parseConfig } from "@/platform/config";
import { resolveCorrelationId } from "@/platform/correlation";
import { AppError, FeatureUnavailableError, toErrorEnvelope } from "@/platform/errors";
import { createLogger, redact } from "@/platform/logger";

describe("config", () => {
  it("applies safe defaults", () => {
    const c = parseConfig({});
    expect(c.APP_ENV).toBe("local");
    expect(c.NEXT_PUBLIC_CONTACT_EMAIL).toBeUndefined();
  });

  it("treats empty optional contact values as unset", () => {
    const c = parseConfig({ NEXT_PUBLIC_CONTACT_EMAIL: "", NEXT_PUBLIC_CONTACT_PHONE: "  " });
    expect(c.NEXT_PUBLIC_CONTACT_EMAIL).toBeUndefined();
    expect(c.NEXT_PUBLIC_CONTACT_PHONE).toBeUndefined();
  });

  it("rejects invalid values and names the key without echoing the value", () => {
    let caught: unknown;
    try {
      parseConfig({ NEXT_PUBLIC_CONTACT_PHONE: "08012345678", APP_ENV: "prod" });
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(ConfigError);
    const err = caught as ConfigError;
    expect(err.invalidKeys.sort()).toEqual(["APP_ENV", "NEXT_PUBLIC_CONTACT_PHONE"]);
    expect(err.message).not.toContain("08012345678");
  });

  it("accepts an E.164 phone", () => {
    expect(
      parseConfig({ NEXT_PUBLIC_CONTACT_PHONE: "+2348012345678" }).NEXT_PUBLIC_CONTACT_PHONE,
    ).toBe("+2348012345678");
  });
});

describe("error envelope", () => {
  it("maps typed errors to status and safe message", () => {
    const { status, body } = toErrorEnvelope(
      new FeatureUnavailableError("Booking"),
      "cid-12345678",
    );
    expect(status).toBe(503);
    expect(body.error.code).toBe("FEATURE_UNAVAILABLE");
    expect(body.error.message).toContain("Nothing has been submitted or charged");
    expect(body.error.correlationId).toBe("cid-12345678");
  });

  it("maps conflict to 409 with field errors", () => {
    const e = new AppError("CONFLICT", "OFFER_EXPIRED", "This offer has expired.", {
      fieldErrors: [{ field: "offerId", message: "expired" }],
    });
    const { status, body } = toErrorEnvelope(e, "x");
    expect(status).toBe(409);
    expect(body.error.fieldErrors).toHaveLength(1);
  });

  it("never leaks unknown error details", () => {
    const { status, body } = toErrorEnvelope(new Error("SELECT * FROM users; secret=abc"), "x");
    expect(status).toBe(500);
    expect(body.error.code).toBe("INTERNAL");
    expect(JSON.stringify(body)).not.toContain("secret");
    expect(JSON.stringify(body)).not.toContain("SELECT");
  });
});

describe("logger redaction", () => {
  it("masks sensitive keys recursively", () => {
    const out = redact({ phone: "+2348012345678", nested: { licenceNumber: "ABC", ok: 1 } });
    expect(out).toEqual({ phone: "[redacted]", nested: { licenceNumber: "[redacted]", ok: 1 } });
  });

  it("scrubs emails and phone numbers from free text", () => {
    expect(redact("call +234 801 234 5678 or a.b@example.com")).toBe("call [phone] or [email]");
  });

  it("emits structured JSON and respects level", () => {
    const lines: string[] = [];
    const log = createLogger("warn", (l) => lines.push(l));
    log.info("skipped");
    log.error("failed for jane@example.com", { correlationId: "abc", token: "t" });
    expect(lines).toHaveLength(1);
    const rec = JSON.parse(lines[0]!);
    expect(rec).toMatchObject({ level: "error", msg: "failed for [email]", token: "[redacted]" });
  });
});

describe("correlation id", () => {
  it("keeps a well-formed inbound id", () => {
    expect(resolveCorrelationId("abcd-1234-efgh")).toBe("abcd-1234-efgh");
  });
  it("replaces missing or malformed ids", () => {
    expect(resolveCorrelationId(null)).toMatch(/^[0-9a-f-]{36}$/);
    expect(resolveCorrelationId("<script>")).not.toBe("<script>");
  });
});
