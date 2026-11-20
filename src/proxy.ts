import { NextResponse, type NextRequest } from "next/server";
import { CORRELATION_HEADER, resolveCorrelationId } from "@/platform/correlation";

/** Attaches a correlation id to every request and response (docs/ERROR_HANDLING_RELIABILITY.md). */
export function proxy(request: NextRequest) {
  const correlationId = resolveCorrelationId(request.headers.get(CORRELATION_HEADER));
  const headers = new Headers(request.headers);
  headers.set(CORRELATION_HEADER, correlationId);
  // Lets server components build "?next=" sign-in redirects without client input.
  headers.set("x-pathname", request.nextUrl.pathname + request.nextUrl.search);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set(CORRELATION_HEADER, correlationId);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
