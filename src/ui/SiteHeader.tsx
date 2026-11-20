import Link from "next/link";
import { Logo } from "./icons";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { PRIMARY_NAV, SITE_NAME } from "./site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} home`}>
          <Logo />
          {SITE_NAME}
        </Link>
        <nav aria-label="Main" className="desktop-only">
          <NavLinks items={PRIMARY_NAV} />
        </nav>
        {/* Booking isn't open, so the design's "Book now"/"Sign in" become Contact until it is. */}
        <Link
          href="/contact"
          className="button button-yellow button-arrow button-small desktop-only"
        >
          Contact us
        </Link>
        <MobileMenu items={PRIMARY_NAV} />
      </div>
    </header>
  );
}
