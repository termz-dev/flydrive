import Link from "next/link";
import type { ReactNode } from "react";
import { Notice } from "./blocks";
import { Logo } from "./icons";

export type Portal = "customer" | "driver" | "operations";

const COPY: Record<Portal, { label: string; who: string }> = {
  customer: { label: "Customer account", who: "customers" },
  driver: { label: "Driver portal", who: "Flydrive drivers" },
  operations: { label: "Operations", who: "authorised Flydrive staff" },
};

/**
 * Shell for authenticated route groups. Sign-in is not implemented (identity provider is OPEN),
 * so every portal page renders an honest unavailable state and no data. Pages may describe
 * their purpose but must not load or echo any resource. Authorization arrives in Phase 4.
 */
export function PortalShell({ portal, children }: { portal: Portal; children: ReactNode }) {
  const { label, who } = COPY[portal];
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand">
            <Logo />
            Flydrive
          </Link>
          <span className="portal-badge">{label}</span>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="container narrow portal-shell">
        {children}
        <Notice title="Sign-in isn't available yet" tone="pending">
          <p>
            This area is for {who}. Accounts haven&apos;t been switched on, so there is nothing to
            show here and no action can be taken.
          </p>
          <p>
            <Link href="/">Return to the Flydrive website</Link>
          </p>
        </Notice>
      </main>
    </>
  );
}

export function PortalPage({ title, purpose }: { title: string; purpose: string }) {
  return (
    <>
      <h1>{title}</h1>
      <p className="lead">{purpose}</p>
    </>
  );
}
