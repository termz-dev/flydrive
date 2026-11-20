import Link from "next/link";
import { bookingsOpen } from "@/platform/config";
import { FOOTER_NAV, SITE_NAME, SITE_TAGLINE } from "./site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <p className="footer-brand">{SITE_NAME}</p>
          <p>{SITE_TAGLINE}</p>
          <Link href="/contact" className="button button-yellow button-arrow button-small">
            Contact us
          </Link>
        </div>
        <div className="footer-cols">
          {FOOTER_NAV.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="footer-heading">{group.heading}</h2>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="container footer-base">
        <p>© 2026 {SITE_NAME}</p>
        <p>
          {bookingsOpen()
            ? "Support hours will be published on the contact page."
            : "Online booking is not open yet. Support hours will be published before launch."}
        </p>
      </div>
    </footer>
  );
}
