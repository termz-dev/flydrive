import { AppError } from "@/platform/errors";
import {
  getSessionUser,
  type Permission,
  type Role,
  type SessionUser,
} from "@/modules/identity/session";

/** Guard for server actions: throws instead of redirecting. */
export async function actor(role: Role, permission?: Permission): Promise<SessionUser> {
  const u = await getSessionUser();
  if (!u) throw new AppError("UNAUTHENTICATED", "SIGN_IN_REQUIRED", "Please sign in again.");
  if (u.role !== role) throw new AppError("FORBIDDEN", "WRONG_ROLE", "Your account can't do that.");
  if (role === "staff") {
    if (!u.mfaVerified)
      throw new AppError("FORBIDDEN", "MFA_REQUIRED", "Enter your authenticator code first.");
    if (permission && !u.permissions.includes(permission)) {
      throw new AppError(
        "FORBIDDEN",
        "MISSING_PERMISSION",
        "You don't have permission to do that.",
      );
    }
  }
  return u;
}

export const notFound = (what = "That record") =>
  new AppError("NOT_FOUND", "NOT_FOUND", `${what} wasn't found, or you don't have access to it.`);
