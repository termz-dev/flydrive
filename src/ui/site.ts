import type { Route } from "next";

export interface NavItem {
  href: Route;
  label: string;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/trust-and-safety", label: "Trust & safety" },
  { href: "/for-visitors", label: "Visitors" },
  { href: "/drivers", label: "For drivers" },
  { href: "/faq", label: "FAQ" },
];

export const FOOTER_NAV: readonly { heading: string; items: readonly NavItem[] }[] = [
  {
    heading: "Service",
    items: [
      { href: "/services", label: "Services" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/trust-and-safety", label: "Trust & safety" },
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
      { href: "/drivers", label: "Drive with Flydrive" },
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

/** Every public route required by PRD §4 (package detail pages are generated from the catalogue). */
export const PUBLIC_ROUTES = [
  "/",
  "/services",
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
export const SITE_TAGLINE = "Vetted professional drivers for your own car in Lagos and Ibadan.";
