import { hash, verify } from "@node-rs/argon2";

// argon2id with OWASP-recommended parameters (19 MiB, 2 iterations).
const OPTS = { memoryCost: 19456, timeCost: 2, parallelism: 1 } as const;

export function hashPassword(password: string): Promise<string> {
  return hash(password, OPTS);
}

export async function verifyPassword(hashValue: string, password: string): Promise<boolean> {
  try {
    return await verify(hashValue, password);
  } catch {
    return false;
  }
}

/** Equalises timing when the account doesn't exist. */
let dummy: string | undefined;
export async function burnPasswordCheck(password: string): Promise<void> {
  dummy ??= await hashPassword("flydrive-timing-equaliser");
  await verifyPassword(dummy, password);
}

export const PASSWORD_RULES = "At least 10 characters.";
export function passwordProblem(password: string): string | null {
  if (password.length < 10) return "Use at least 10 characters.";
  if (password.length > 200) return "That password is too long.";
  return null;
}
