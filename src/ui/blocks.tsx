import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { Tick } from "./icons";

export function PageHeader({
  eyebrow,
  title,
  lead,
  tone = "navy",
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  tone?: "navy" | "amber";
  children?: ReactNode;
}) {
  return (
    <section className={`page-header${tone === "amber" ? " page-header-amber" : ""}`}>
      <div className="container">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function Section({
  title,
  eyebrow,
  intro,
  link,
  children,
  tone = "plain",
  wide = false,
  id,
}: {
  title?: string;
  eyebrow?: string;
  intro?: string;
  link?: { href: Route; label: string };
  children: ReactNode;
  tone?: "plain" | "tint";
  wide?: boolean;
  id?: string;
}) {
  const headingId = title && id ? `${id}-heading` : undefined;
  const hasHead = Boolean(title || eyebrow || link);
  return (
    <section className={`section section-${tone}`} aria-labelledby={headingId}>
      <div className={`container${wide ? "" : " narrow"}`}>
        {hasHead ? (
          <div className="section-head">
            <div>
              {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
              {title ? <h2 id={headingId}>{title}</h2> : null}
              {intro ? <p>{intro}</p> : null}
            </div>
            {link ? (
              <Link className="section-link" href={link.href}>
                {link.label} →
              </Link>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/** Truthful status notice. Use instead of any control that would imply a live capability. */
export function Notice({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: ReactNode;
  tone?: "info" | "pending";
}) {
  return (
    <div className={`notice notice-${tone}`} role="note">
      <p className="notice-title">{title}</p>
      <div>{children}</div>
    </div>
  );
}

export function BookingNotOpen() {
  return (
    <Notice title="Online booking isn't open yet" tone="pending">
      <p>
        Flydrive is preparing for its pilot in Lagos and Ibadan. You can&apos;t request or pay for a
        booking on this website yet, and nothing you read here is a confirmed booking.
      </p>
      <p>
        <Link href="/contact">See how to get in touch</Link>
      </p>
    </Notice>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="card-grid">{children}</div>;
}

export function LinkCard<T extends string>({
  href,
  title,
  children,
  dashed = false,
}: {
  href: Route<T>;
  title: string;
  children: ReactNode;
  dashed?: boolean;
}) {
  return (
    <Link href={href} className={`card card-link${dashed ? " card-dashed" : ""}`}>
      <h3>{title}</h3>
      <div className="muted">{children}</div>
      <span className="card-more" aria-hidden="true">
        Learn more →
      </span>
    </Link>
  );
}

export function Steps({
  items,
  variant = "rule",
}: {
  items: readonly { title: string; body: ReactNode }[];
  variant?: "rule" | "boxed" | "stacked";
}) {
  const cls =
    variant === "boxed"
      ? "steps steps-boxed"
      : variant === "stacked"
        ? "steps steps-stacked"
        : "steps";
  return (
    <ol className={cls}>
      {items.map((s) => (
        <li key={s.title}>
          <h3>{s.title}</h3>
          <div>{s.body}</div>
        </li>
      ))}
    </ol>
  );
}

export function CheckList({
  items,
  plain = false,
}: {
  items: readonly { label: string; note?: string }[];
  plain?: boolean;
}) {
  return (
    <ul className={`check-list${plain ? " check-list-plain" : ""}`}>
      {items.map((i) => (
        <li key={i.label}>
          <Tick />
          <span>
            {i.label}
            {i.note ? <small>{i.note}</small> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Banner({
  title,
  body,
  tone,
  action,
}: {
  title: string;
  body: ReactNode;
  tone: "cream" | "grey" | "navy";
  action?: { href: Route; label: string; style?: "primary" | "secondary" };
}) {
  const btn = action?.style === "secondary" ? "button button-secondary" : "button button-arrow";
  return (
    <div className={`banner banner-${tone}`}>
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      {action ? (
        <Link className={btn} href={action.href}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function PendingLegal({ document }: { document: string }) {
  return (
    <Notice title={`${document} awaiting legal approval`} tone="pending">
      <p>
        This page will publish Flydrive&apos;s {document.toLowerCase()} once it has been approved by
        counsel. Until then, no booking can be made through this website.
      </p>
    </Notice>
  );
}
