"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Route-level error boundary. Shows a safe message and the opaque digest Next.js assigns,
 * which ties to the server log. Never shows the error message itself.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("route error", { digest: error.digest, name: error.name });
  }, [error]);

  return (
    <main id="main" className="container narrow portal-shell">
      <h1>Something went wrong</h1>
      <p className="lead">
        This page couldn&apos;t load. Nothing has been submitted or charged. Please try again.
      </p>
      {error.digest ? <p className="muted">Reference: {error.digest}</p> : null}
      <div className="button-row">
        <button type="button" className="button" onClick={reset}>
          Try again
        </button>
        <Link className="button button-secondary" href="/">
          Go home
        </Link>
      </div>
    </main>
  );
}
