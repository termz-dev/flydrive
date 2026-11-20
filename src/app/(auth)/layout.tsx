import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/ui/SiteFooter";
import { SiteHeader } from "@/ui/SiteHeader";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="auth-page">
        <div className="auth-card">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
