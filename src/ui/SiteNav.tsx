"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { CarIcon, Chevron, Logo, MenuIcon, PersonIcon } from "./icons";
import {
  NAV_DRIVE,
  NAV_LINKS,
  NAV_LOCATIONS,
  NAV_SERVICES,
  NAV_VISITORS,
  SITE_NAME,
  isCurrent,
  type NavGroup,
} from "./site";

type Open = "services" | "locations" | "menu" | null;

/**
 * Site header (design/source/SiteHeader.dc.html). Dark on the home page, light elsewhere.
 * Dropdowns are disclosure buttons (aria-expanded) that close on Escape, outside click and
 * navigation. Under 1100px the nav collapses to "Book now" plus a menu button.
 */
export function SiteNav({ bookingsOpen }: { bookingsOpen: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Open>(null);
  const [lastPath, setLastPath] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const menuId = useId();
  const servicesId = useId();
  const locationsId = useId();

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const btn = headerRef.current?.querySelector<HTMLButtonElement>(`[data-toggle="${open}"]`);
      setOpen(null);
      btn?.focus();
    };
    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const dark = pathname === "/";
  const toggle = (name: Exclude<Open, null>) => () => setOpen((o) => (o === name ? null : name));
  const groupActive = (g: NavGroup) => g.items.some((i) => isCurrent(pathname, i));
  const current = (item: Parameters<typeof isCurrent>[1]) =>
    isCurrent(pathname, item) ? ("page" as const) : undefined;

  const cta = bookingsOpen
    ? { href: "/bookings/new" as const, label: "Book now" }
    : { href: "/contact" as const, label: "Contact us" };

  return (
    <header ref={headerRef} className={`site-header${dark ? " is-dark" : ""}`}>
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} home`}>
          <Logo size={34} />
          <span>{SITE_NAME}</span>
        </Link>

        <nav aria-label="Main" className="nav-main">
          <div>
            <button
              type="button"
              className={`nav-link${groupActive(NAV_SERVICES) ? " is-active" : ""}`}
              aria-expanded={open === "services"}
              aria-controls={servicesId}
              data-toggle="services"
              onClick={toggle("services")}
            >
              {NAV_SERVICES.label}
              <Chevron />
            </button>
            <div
              id={servicesId}
              className="drop-panel drop-panel-wide"
              hidden={open !== "services"}
            >
              {NAV_SERVICES.items.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="drop-item"
                  aria-current={current(item)}
                >
                  <span className={`drop-icon${i === 1 ? " drop-icon-amber" : ""}`}>
                    {i === 0 ? <PersonIcon /> : <CarIcon />}
                  </span>
                  <span>
                    {item.label}
                    <small>{item.note}</small>
                  </span>
                </Link>
              ))}
              <Link href="/services" className="drop-foot">
                Compare all packages
              </Link>
            </div>
          </div>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              aria-current={current(item)}
            >
              {item.label}
            </Link>
          ))}
          <div>
            <button
              type="button"
              className={`nav-link${groupActive(NAV_LOCATIONS) ? " is-active" : ""}`}
              aria-expanded={open === "locations"}
              aria-controls={locationsId}
              data-toggle="locations"
              onClick={toggle("locations")}
            >
              {NAV_LOCATIONS.label}
              <Chevron />
            </button>
            <div id={locationsId} className="drop-panel" hidden={open !== "locations"}>
              {NAV_LOCATIONS.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="drop-item"
                  aria-current={current(item)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href={NAV_VISITORS.href} className="nav-link" aria-current={current(NAV_VISITORS)}>
            {NAV_VISITORS.label}
          </Link>
        </nav>

        <div className="header-actions">
          <Link
            href={NAV_DRIVE.href}
            className="header-link header-link-quiet"
            aria-current={current(NAV_DRIVE)}
          >
            {NAV_DRIVE.label}
          </Link>
          <span className="header-divider" aria-hidden="true" />
          <Link href="/sign-in" className="header-link">
            Sign in
          </Link>
          <Link href={cta.href} className="button button-yellow button-arrow button-small">
            {cta.label}
          </Link>
        </div>

        <div className="header-compact">
          <Link href={cta.href} className="button button-yellow button-arrow button-small">
            {cta.label}
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Menu"
            aria-expanded={open === "menu"}
            aria-controls={menuId}
            data-toggle="menu"
            onClick={toggle("menu")}
          >
            <MenuIcon open={open === "menu"} />
          </button>
        </div>
      </div>

      <nav id={menuId} aria-label="Mobile" className="mobile-panel" hidden={open !== "menu"}>
        <ul>
          <li className="mp-label">Services</li>
          {NAV_SERVICES.items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} aria-current={current(item)}>
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mp-label">Explore</li>
          {[...NAV_LINKS, ...NAV_LOCATIONS.items, NAV_VISITORS, NAV_DRIVE].map((item) => (
            <li key={item.href}>
              <Link href={item.href} aria-current={current(item)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mp-actions">
          <Link href="/sign-in" className="button button-secondary">
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}
