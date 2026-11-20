"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

export function PortalNav({ items }: { items: { href: Route; label: string }[] }) {
  const path = usePathname();
  return (
    <nav aria-label="Portal" className="portal-nav">
      <ul>
        {items.map((i) => {
          const current =
            path === i.href ||
            (i.href !== "/ops" && i.href !== "/driver" && path.startsWith(i.href + "/"));
          return (
            <li key={i.href}>
              <Link href={i.href} aria-current={current ? "page" : undefined}>
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
