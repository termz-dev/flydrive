import { z } from "zod";
import { AppError } from "./errors";
import { createLogger } from "./logger";

/** Result shape every server action returns to its form. */
export type ActionState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "ok"; message?: string };

export const idle: ActionState = { status: "idle" };

const log = createLogger((process.env.LOG_LEVEL as "info") ?? "info");

/** Converts any thrown error into a safe ActionState. Re-throws Next.js redirects. */
export function toActionError(err: unknown, module: string): ActionState {
  if (
    err &&
    typeof err === "object" &&
    "digest" in err &&
    String((err as { digest: unknown }).digest).startsWith("NEXT_")
  ) {
    throw err;
  }
  if (err instanceof z.ZodError) {
    const fieldErrors: Record<string, string> = {};
    for (const i of err.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }
  if (err instanceof AppError) {
    const fe = err.options.fieldErrors?.length
      ? Object.fromEntries(err.options.fieldErrors.map((f) => [f.field, f.message]))
      : undefined;
    return fe
      ? // The summary points to the fields; the specific text sits under each field.
        { status: "error", message: "Please check the highlighted fields.", fieldErrors: fe }
      : { status: "error", message: err.safeMessage };
  }
  log.error("action failed", { module, error: err instanceof Error ? err : String(err) });
  return {
    status: "error",
    message: "Something went wrong on our side. Nothing was saved. Please try again.",
  };
}

export function formObject(fd: FormData): Record<string, string> {
  const o: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string") o[k] = v;
  return o;
}
