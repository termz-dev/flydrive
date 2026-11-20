import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { FeatureUnavailableError } from "@/platform/errors";

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

function key(): Buffer {
  const raw = process.env.APP_ENCRYPTION_KEY;
  if (!raw) throw new FeatureUnavailableError("Encryption (APP_ENCRYPTION_KEY)");
  const k = Buffer.from(raw, "base64");
  if (k.length !== 32) throw new FeatureUnavailableError("Encryption (APP_ENCRYPTION_KEY)");
  return k;
}

/** AES-256-GCM. Output: base64url(iv).base64url(tag).base64url(ciphertext) */
export function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const ct = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), ct].map((b) => b.toString("base64url")).join(".");
}

export function decrypt(enc: string): string {
  const [iv, tag, ct] = enc.split(".").map((p) => Buffer.from(p, "base64url"));
  if (!iv || !tag || !ct) throw new Error("Malformed ciphertext");
  const d = createDecipheriv("aes-256-gcm", key(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(ct), d.final()]).toString("utf8");
}
