import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { signOut } from "@/modules/identity/actions";
import { Logo } from "./icons";
import { PortalNav } from "./PortalNav";

export type Portal = "customer" | "driver" | "operations";

const NAV: Record<Portal, { label: string; items: { href: Route; label: string }[] }> = {
  customer: {
    label: "Customer",
    items: [
      { href: "/account", label: "My bookings" },
      { href: "/bookings/new", label: "Request a driver" },
      { href: "/support", label: "Support" },
    ],
  },
  driver: {
    label: "Driver",
    items: [
      { href: "/driver", label: "Home" },
      { href: "/driver/availability", label: "Availability" },
      { href: "/driver/onboarding", label: "My checks" },
    ],
  },
  operations: {
    label: "Operations",
    items: [
      { href: "/ops", label: "Overview" },
      { href: "/ops/bookings", label: "Bookings" },
      { href: "/ops/payments", label: "Payments" },
      { href: "/ops/drivers", label: "Drivers" },
      { href: "/ops/fleet", label: "Fleet" },
      { href: "/ops/incidents", label: "Incidents" },
      { href: "/ops/audit", label: "Audit" },
    ],
  },
};

export function PortalShell({
  portal,
  userName,
  children,
}: {
  portal: Portal;
  userName: string;
  children: ReactNode;
}) {
  const nav = NAV[portal];
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="portal-header">
        <div className="container portal-header-inner">
          <Link href="/" className="brand">
            <Logo />
            Flydrive
          </Link>
          <span className="portal-badge">{nav.label}</span>
          <PortalNav items={nav.items} />
          <div className="portal-user">
            <span className="muted">{userName}</span>
            <form action={signOut}>
              <button type="submit" className="link-button">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="container portal-main">
        {children}
      </main>
    </>
  );
}
