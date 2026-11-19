import Link from "next/link";
import type { Metadata } from "next";
import { SERVICE_PACKAGES } from "@/modules/catalog/packages";
import { CardGrid, LinkCard, Section, Steps } from "@/ui/blocks";

export const metadata: Metadata = {
  title: { absolute: "Flydrive — vetted professional drivers for your own car" },
  description:
    "Flydrive arranges a vetted professional driver for your own car, for a half-day, a day, a week or longer, in Lagos and Ibadan.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <section className="page-header hero">
        <div className="container narrow">
          <p className="eyebrow">Lagos · Ibadan · Pilot in preparation</p>
          <h1>A vetted professional driver for your own car</h1>
          <p className="lead">
            Flydrive arranges a screened driver to drive your vehicle for an agreed period — a
            half-day, a full day, a week or longer. You choose the driver, the driver accepts the
            job, and our operations team confirms the booking.
          </p>
          <p className="muted">
            This is not ride-hailing: the car is yours and the time is booked.
          </p>
          <div className="button-row">
            <Link className="button" href="/how-it-works">
              See how it works
            </Link>
            <Link className="button button-secondary" href="/services">
              Explore services
            </Link>
          </div>
        </div>
      </section>

      <Section title="Who Flydrive is for" id="who">
        <ul>
          <li>Car owners who would rather not drive in traffic, to events or on long trips.</li>
          <li>Households and professionals who need a dependable driver for a week or a month.</li>
          <li>People covering for a regular driver who is away.</li>
          <li>
            Visitors who have access to a car but no driver —{" "}
            <Link href="/for-visitors">read what we can and can&apos;t do for visitors</Link>.
          </li>
        </ul>
      </Section>

      <Section title="How a booking works" tone="tint" id="steps">
        <Steps
          items={[
            { title: "You request", body: <p>Tell us the dates, pickup point, duties and car.</p> },
            {
              title: "You choose a driver",
              body: <p>We show suitable drivers. You pick the one you prefer.</p>,
            },
            {
              title: "The driver accepts",
              body: (
                <p>The driver sees the full job before agreeing. Nothing is charged before this.</p>
              ),
            },
            {
              title: "You pay and we confirm",
              body: (
                <p>Once payment is received and checked by our team, your booking is confirmed.</p>
              ),
            },
          ]}
        />
        <p>
          <Link href="/how-it-works">Read the full process</Link>
        </p>
      </Section>

      <Section title="Services" id="services">
        <p>Choose a package that matches how long you need a driver.</p>
        <CardGrid>
          {SERVICE_PACKAGES.map((p) => (
            <LinkCard key={p.slug} href={`/services/${p.slug}`} title={p.name}>
              {p.summary}
            </LinkCard>
          ))}
        </CardGrid>
      </Section>

      <Section title="Built around trust" tone="tint" id="trust">
        <p>
          Drivers must pass identity, driver&apos;s licence and guarantor checks before they can be
          offered to customers. Before you pay, you see only limited profile details; more is shared
          once your booking is confirmed.
        </p>
        <p>
          <Link href="/trust-and-safety">How we approach trust and safety</Link>
        </p>
      </Section>
    </>
  );
}
