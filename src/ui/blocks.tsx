import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-header">
      <div className="container narrow">
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
  children,
  tone = "plain",
  id,
}: {
  title?: string;
  children: ReactNode;
  tone?: "plain" | "tint";
  id?: string;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section className={`section section-${tone}`} aria-labelledby={headingId}>
      <div className="container narrow">
        {title ? <h2 id={headingId}>{title}</h2> : null}
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
        driver on this website yet, and nothing you read here is a confirmed booking.
      </p>
      <p>
        <Link href="/contact">See how to get in touch</Link>.
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
}: {
  href: Route<T>;
  title: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="card card-link">
      <h3>{title}</h3>
      <div className="muted">{children}</div>
      <span className="card-more" aria-hidden="true">
        Learn more →
      </span>
    </Link>
  );
}

export function Steps({ items }: { items: readonly { title: string; body: ReactNode }[] }) {
  return (
    <ol className="steps">
      {items.map((s) => (
        <li key={s.title}>
          <h3>{s.title}</h3>
          <div>{s.body}</div>
        </li>
      ))}
    </ol>
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
