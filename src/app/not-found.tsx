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
        <div className="container lost">
          <div>
            <p className="code">404</p>
            <h1>Wrong turn.</h1>
            <p>We couldn’t find that page. It may have moved, or the link may be wrong.</p>
            <div className="button-row">
              <Link className="button button-arrow" href="/">
                Go to home
              </Link>
              <Link className="button button-secondary" href="/services">
                See services
              </Link>
              <Link className="button button-secondary" href="/contact">
                Contact us
              </Link>
            </div>
          </div>
          <svg width="360" height="220" viewBox="0 0 360 220" fill="none" aria-hidden="true">
            <path
              d="M20 200 C 90 200, 110 120, 170 90 S 280 20, 330 70"
              stroke="#E4E7EC"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <path
              d="M20 200 C 90 200, 110 120, 170 90 S 280 20, 330 70"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeDasharray="10 12"
              strokeLinecap="round"
            />
            <circle cx="330" cy="70" r="12" fill="#F5B53D" />
            <path
              d="M330 63v14M323 70h14"
              stroke="#0B0F14"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
