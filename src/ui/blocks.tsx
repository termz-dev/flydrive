import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { bookingsOpen } from "@/platform/config";
import { ArrowLeft } from "./icons";

export function PageHeader({
  eyebrow,
  title,
  lead,
  tone = "tint",
  back,
  aside,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  tone?: "tint" | "plain" | "dark" | "amber" | "cream";
  back?: { href: Route; label: string };
  /** Right-hand column, usually a photo. */
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const copy = (
    <div>
      {back ? (
        <Link href={back.href} className="back-crumb">
          <ArrowLeft />
          {back.label}
        </Link>
      ) : null}
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {lead ? <p className="lead">{lead}</p> : null}
      {children}
    </div>
  );
  return (
    <section className={`page-hero page-hero-${tone}`}>
      <div className="container">
        {aside ? (
          <div className="page-hero-grid">
            {copy}
            {aside}
          </div>
        ) : (
          copy
        )}
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
  narrow = false,
  id,
}: {
  title?: string;
  eyebrow?: string;
  intro?: string;
  link?: { href: Route; label: string };
  children: ReactNode;
  tone?: "plain" | "tint";
  narrow?: boolean;
  id?: string;
}) {
  const headingId = title && id ? `${id}-heading` : undefined;
  const hasHead = Boolean(title || eyebrow || link);
  return (
    <section
      className={`section${tone === "tint" ? " section-tint" : ""}`}
      aria-labelledby={headingId}
    >
      <div className={`container${narrow ? " narrow" : ""}`}>
        {hasHead ? (
          <div className="section-head">
            <div>
              {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
              {title ? (
                <h2 id={headingId} className="h-sub">
                  {title}
                </h2>
              ) : null}
              {intro ? <p>{intro}</p> : null}
            </div>
            {link ? (
              <Link className="button button-secondary button-small" href={link.href}>
                {link.label}
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
  if (bookingsOpen()) {
    return (
      <Notice title="Ready when you are">
        <p>
          Request a driver online — you choose who drives, and nothing is charged until your driver
          accepts.
        </p>
        <p>
          <Link href="/bookings/new">Request a driver</Link> ·{" "}
          <Link href="/sign-up">Create an account</Link>
        </p>
      </Notice>
    );
  }
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
