"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

export interface PackageListItem {
  slug: string;
  name: string;
  summary: string;
}

/**
 * Large numbered package list. Hover or focus highlights an item and shows its summary in the
 * caption beside the image; every row is a real link, so it works without JavaScript.
 */
export function PackageList({
  items,
  media,
}: {
  items: readonly PackageListItem[];
  media: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];
  return (
    <div className="number-layout">
      <div className="media-frame">
        {media}
        {current ? (
          <p className="media-caption" aria-live="polite">
            <strong>{current.name}</strong>
            {current.summary}
          </p>
        ) : null}
      </div>
      <ol className="number-list">
        {items.map((item, i) => (
          <li key={item.slug}>
            <Link
              href={`/services/${item.slug}` as `/services/${string}`}
              data-active={i === active}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <span className="name">{item.name}</span>
              <span className="go" aria-hidden="true">
                →
              </span>
              <span className="sub">{item.summary}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
