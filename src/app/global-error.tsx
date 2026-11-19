"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="en-NG">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <h1>Flydrive is temporarily unavailable</h1>
        <p>Nothing has been submitted or charged. Please try again in a few minutes.</p>
        {error.digest ? <p>Reference: {error.digest}</p> : null}
      </body>
    </html>
  );
}
