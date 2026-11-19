import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/ui/SiteFooter";
import { SiteHeader } from "@/ui/SiteHeader";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="page-header">
          <div className="container narrow">
            <p className="eyebrow">Error 404</p>
            <h1>We couldn&apos;t find that page</h1>
            <p className="lead">The link may be out of date, or the page may have moved.</p>
            <div className="button-row">
              <Link className="button" href="/">
                Go to the home page
              </Link>
              <Link className="button button-secondary" href="/services">
                See services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
