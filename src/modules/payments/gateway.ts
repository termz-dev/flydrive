import { createHmac, timingSafeEqual } from "node:crypto";
import { AppError, FeatureUnavailableError } from "@/platform/errors";

export interface VerifiedCharge {
  reference: string;
  status: "success" | "failed" | "abandoned" | "pending" | "other";
  amountKobo: number;
  currency: string;
  paidAt: string | null;
  channel: string | null;
  gatewayResponse: string | null;
}

export interface PaymentGateway {
  initialize(input: {
    email: string;
    amountKobo: number;
    reference: string;
    callbackUrl: string;
    metadata: Record<string, string>;
  }): Promise<{ authorizationUrl: string }>;
  verify(reference: string): Promise<VerifiedCharge>;
}

const API = "https://api.paystack.co";

export class PaystackGateway implements PaymentGateway {
  constructor(private readonly secret: string) {}

  private async call<T>(path: string, init?: RequestInit): Promise<T> {
    let res: Response;
    try {
      res = await fetch(API + path, {
        ...init,
        headers: { Authorization: `Bearer ${this.secret}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000),
      });
    } catch (cause) {
      throw new AppError(
        "DEPENDENCY_UNAVAILABLE",
        "PAYSTACK_UNREACHABLE",
        "We couldn't reach the payment provider. Nothing was charged. Please try again.",
        { retryable: true, cause },
      );
    }
    const body = (await res.json().catch(() => null)) as {
      status?: boolean;
      message?: string;
      data?: T;
    } | null;
    if (!res.ok || !body?.status || !body.data) {
      throw new AppError(
        "DEPENDENCY_UNAVAILABLE",
        "PAYSTACK_ERROR",
        "The payment provider returned an error. Nothing was charged.",
        { retryable: true },
      );
    }
    return body.data;
  }

  async initialize(i: Parameters<PaymentGateway["initialize"]>[0]) {
    const d = await this.call<{ authorization_url: string }>("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email: i.email,
        amount: i.amountKobo,
        currency: "NGN",
        reference: i.reference,
        callback_url: i.callbackUrl,
        metadata: i.metadata,
      }),
    });
    return { authorizationUrl: d.authorization_url };
  }

  async verify(reference: string): Promise<VerifiedCharge> {
    const d = await this.call<{
      reference: string;
      status: string;
      amount: number;
      currency: string;
      paid_at: string | null;
      channel: string | null;
      gateway_response: string | null;
    }>(`/transaction/verify/${encodeURIComponent(reference)}`);
    const known = ["success", "failed", "abandoned", "pending"] as const;
    return {
      reference: d.reference,
      status: (known as readonly string[]).includes(d.status)
        ? (d.status as VerifiedCharge["status"])
        : "other",
      amountKobo: d.amount,
      currency: d.currency,
      paidAt: d.paid_at,
      channel: d.channel,
      gatewayResponse: d.gateway_response,
    };
  }
}

export function getGateway(): PaymentGateway {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new FeatureUnavailableError("Online payment");
  return new PaystackGateway(key);
}

/** Paystack signs the raw body with HMAC-SHA512 using the secret key. */
export function verifyPaystackSignature(
  rawBody: string,
  signature: string | null,
  secret = process.env.PAYSTACK_SECRET_KEY,
): boolean {
  if (!secret || !signature) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
