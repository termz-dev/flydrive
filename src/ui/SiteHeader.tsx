import Link from "next/link";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { PRIMARY_NAV, SITE_NAME } from "./site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} home`}>
          <span className="brand-mark" aria-hidden="true">
            F
          </span>
          {SITE_NAME}
        </Link>
        <nav aria-label="Main" className="desktop-only">
          <NavLinks items={PRIMARY_NAV} />
        </nav>
        <Link href="/contact" className="button button-small desktop-only">
          Contact
        </Link>
        <MobileMenu items={PRIMARY_NAV} />
      </div>
    </header>
  );
}
