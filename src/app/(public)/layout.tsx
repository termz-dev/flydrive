import type { ReactNode } from "react";
import { bookingsOpen } from "@/platform/config";
import { SiteFooter } from "@/ui/SiteFooter";
import { SiteHeader } from "@/ui/SiteHeader";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {bookingsOpen() ? (
        <div style={{ height: 12 }} />
      ) : (
        <div className="status-strip">
          <div className="container">
            <p>
              <span className="status-dot" aria-hidden="true" />
              <strong>Pilot in preparation:</strong> online booking for Lagos and Ibadan is not open
              yet.
            </p>
          </div>
        </div>
      )}
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
