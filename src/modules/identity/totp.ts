import { Secret, TOTP } from "otpauth";

const PERIOD = 30;

export function newTotpSecret(): string {
  return new Secret({ size: 20 }).base32;
}

export function totpUri(secretBase32: string, account: string): string {
  return new TOTP({
    issuer: "Flydrive Ops",
    label: account,
    secret: Secret.fromBase32(secretBase32),
    period: PERIOD,
  }).toString();
}

/**
 * Returns the matched time step, or null. Callers reject a step <= the last used one, so a code
 * can't be replayed.
 */
export function verifyTotp(secretBase32: string, code: string, now = Date.now()): number | null {
  const clean = code.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(clean)) return null;
  const totp = new TOTP({ secret: Secret.fromBase32(secretBase32), period: PERIOD });
  const delta = totp.validate({ token: clean, timestamp: now, window: 1 });
  if (delta === null) return null;
  return Math.floor(now / 1000 / PERIOD) + delta;
}
