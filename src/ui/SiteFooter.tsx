import Link from "next/link";
import { bookingsOpen } from "@/platform/config";
import { SUPPORT_HOURS } from "@/content/site";
import { FOOTER_NAV, SITE_NAME, SITE_TAGLINE } from "./site";

export function SiteFooter() {
  const open = bookingsOpen();
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <span className="wordmark">{SITE_NAME}</span>
          <p>{SITE_TAGLINE}</p>
          <Link
            href={open ? "/bookings/new" : "/contact"}
            className="button button-yellow button-arrow button-small"
          >
            {open ? "Book now" : "Contact us"}
          </Link>
        </div>
        <nav aria-label="Footer" className="footer-nav">
          {FOOTER_NAV.map((group) => (
            <div key={group.heading}>
              <h2>{group.heading}</h2>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {SITE_NAME}
        </span>
        <span>Support hours: {SUPPORT_HOURS ?? "to be published before launch"}</span>
      </div>
    </footer>
  );
}
