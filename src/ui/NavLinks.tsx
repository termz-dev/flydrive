"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./site";

export function NavLinks({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="desktop-nav">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <li key={item.href}>
            <Link href={item.href} aria-current={active ? "page" : undefined}>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
