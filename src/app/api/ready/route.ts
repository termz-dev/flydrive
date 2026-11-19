import { headers } from "next/headers";
import { ConfigError, getConfig } from "@/platform/config";
import { CORRELATION_HEADER } from "@/platform/correlation";
import { createLogger } from "@/platform/logger";

/**
 * Readiness: configuration is valid. Later phases add database and enabled-provider checks.
 * Reports only which keys are invalid, never their values.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const correlationId = (await headers()).get(CORRELATION_HEADER) ?? "none";
  try {
    const config = getConfig();
    return Response.json(
      {
        status: "ready",
        env: config.APP_ENV,
        checks: { config: "ok", database: "not_configured" },
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (err) {
    const invalid = err instanceof ConfigError ? err.invalidKeys : ["unknown"];
    createLogger("error").error("readiness check failed", {
      correlationId,
      module: "platform",
      route: "/api/ready",
      code: "CONFIG_INVALID",
      invalidKeys: invalid,
    });
    if (!(err instanceof ConfigError)) throw err;
    return Response.json(
      { status: "not_ready", checks: { config: "invalid" }, invalidKeys: invalid, correlationId },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}
