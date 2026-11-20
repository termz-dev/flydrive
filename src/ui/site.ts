import type { Route } from "next";

export interface NavItem {
  href: Route;
  label: string;
  /** Extra path prefixes that should mark this item as current (e.g. both city pages). */
  match?: readonly string[];
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { href: "/services", label: "Services" },
  { href: "/services/car-and-driver", label: "Car + driver" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/trust-and-safety", label: "Trust & safety" },
  { href: "/drivers", label: "Drive with us" },
];

export const FOOTER_NAV: readonly { heading: string; items: readonly NavItem[] }[] = [
  {
    heading: "Service",
    items: [
      { href: "/services", label: "All packages" },
      { href: "/services/car-and-driver", label: "Car + driver" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/for-visitors", label: "For visitors" },
    ],
  },
  {
    heading: "Locations",
    items: [
      { href: "/locations/lagos", label: "Lagos" },
      { href: "/locations/ibadan", label: "Ibadan" },
    ],
  },
  {
    heading: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/trust-and-safety", label: "Trust & safety" },
      { href: "/drivers", label: "Drive with us" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

/** Every public route required by PRD §4, plus car + driver (ADR 0002). Package detail pages come from the catalogue. */
export const PUBLIC_ROUTES = [
  "/",
  "/services",
  "/services/car-and-driver",
  "/how-it-works",
  "/trust-and-safety",
  "/locations/lagos",
  "/locations/ibadan",
  "/for-visitors",
  "/drivers",
  "/drivers/apply",
  "/about",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export const SITE_NAME = "Flydrive";
export const SITE_TAGLINE =
  "Vetted professional drivers in Lagos and Ibadan — for your own car, or with a car we arrange.";

/**
 * Whether a nav item is the current section. "/services" must not light up on
 * "/services/car-and-driver", which has its own nav item.
 */
export function isCurrent(pathname: string, item: NavItem): boolean {
  if (pathname === item.href) return true;
  if (item.match?.some((m) => pathname === m || pathname.startsWith(m + "/"))) return true;
  if (item.href === "/services") {
    return pathname.startsWith("/services/") && pathname !== "/services/car-and-driver";
  }
  return item.href !== "/" && pathname.startsWith(item.href + "/");
}
