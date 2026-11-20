import Link from "next/link";
import { bookingsOpen } from "@/platform/config";
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
        <Link href="/sign-in" className="header-signin desktop-only">
          Sign in
        </Link>
        {bookingsOpen() ? (
          <Link
            href="/bookings/new"
            className="button button-yellow button-arrow button-small desktop-only"
          >
            Book a driver
          </Link>
        ) : (
          <Link
            href="/contact"
            className="button button-yellow button-arrow button-small desktop-only"
          >
            Contact us
          </Link>
        )}
        <MobileMenu items={PRIMARY_NAV} />
      </div>
    </header>
  );
}
