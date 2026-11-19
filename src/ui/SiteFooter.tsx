import Link from "next/link";
import { FOOTER_NAV, SITE_NAME, SITE_TAGLINE } from "./site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">{SITE_NAME}</p>
          <p className="muted">{SITE_TAGLINE}</p>
        </div>
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
      <div className="container footer-base">
        <p className="muted">
          © {new Date().getFullYear()} {SITE_NAME}. Online booking is not open yet.
        </p>
      </div>
    </footer>
  );
}
