import Link from "next/link";
import type { Metadata } from "next";
import { SERVICE_PACKAGES } from "@/modules/catalog/packages";
import { Banner, CardGrid, CheckList, LinkCard, Section, Steps } from "@/ui/blocks";
import { CarIcon, Clock, PersonIcon } from "@/ui/icons";

export const metadata: Metadata = {
  title: { absolute: "Flydrive — vetted professional drivers in Lagos & Ibadan" },
  description:
    "Flydrive arranges a vetted professional driver in Lagos and Ibadan — for your own car, or with a car we arrange — by the half-day, day, week or longer.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow" style={{ color: "var(--amber)" }}>
            Lagos · Ibadan
          </p>
          <h1>A vetted professional driver — in your car, or in one we arrange.</h1>
          <p className="lead">
            Book by the half-day, day, week or longer. We screen every driver, you choose who you
            want, and nothing is confirmed until your payment is verified.
          </p>
          <div className="choice-grid">
            <Link href="/services" className="choice">
              <span className="choice-icon">
                <PersonIcon />
              </span>
              <span className="choice-kicker">I have a car</span>
              <span className="choice-title">Driver for your car</span>
              <span className="choice-body">
                A screened driver works your schedule in your own vehicle.
              </span>
              <span className="choice-more">See packages →</span>
            </Link>
            <Link href="/services/car-and-driver" className="choice choice-amber">
              <span className="choice-icon">
                <CarIcon />
              </span>
              <span className="choice-kicker">I need a car too</span>
              <span className="choice-title">Car + driver</span>
              <span className="choice-body">
                We arrange a suitable car and a vetted driver together — ideal for visitors and
                events.
              </span>
              <span className="choice-more">How car + driver works →</span>
            </Link>
          </div>
          <p className="hero-note">
            <Clock />
            <span>
              Standard notice is 3 days. Need someone sooner? Our team checks availability by hand —
              we never auto-confirm a short-notice request.
            </span>
          </p>
        </div>
      </section>

      <Section
        wide
        id="packages"
        eyebrow="Packages"
        title="Booked by duration, not by trip."
        intro="Flydrive isn't ride hailing. Every package is available as driver-only or car + driver."
        link={{ href: "/services", label: "Compare all packages" }}
      >
        <CardGrid>
          {SERVICE_PACKAGES.map((p) => (
            <LinkCard
              key={p.slug}
              href={`/services/${p.slug}`}
              title={p.name}
              dashed={p.slug === "custom"}
            >
              {p.summary}
            </LinkCard>
          ))}
        </CardGrid>
      </Section>

      <Section
        wide
        id="how"
        eyebrow="How it works"
        title="Every step is a real check, not a promise."
        link={{ href: "/how-it-works", label: "The full process" }}
      >
        <Steps
          items={[
            {
              title: "Tell us what you need",
              body: <p>Dates, area, duties — and whether you need a car.</p>,
            },
            {
              title: "Choose your driver",
              body: <p>They see the full assignment and accept or decline.</p>,
            },
            {
              title: "Pay, then we confirm",
              body: <p>We verify your payment before anything is confirmed.</p>,
            },
            {
              title: "Handover & go",
              body: <p>The car&apos;s condition is recorded by both sides.</p>,
            },
          ]}
        />
      </Section>

      <section className="section section-tint" aria-labelledby="trust-heading">
        <div className="container two-col" style={{ alignItems: "center", gap: "56px" }}>
          <div>
            <p className="eyebrow">Trust &amp; safety</p>
            <h2 id="trust-heading">Screened before they ever see a booking.</h2>
            <p className="lead" style={{ fontSize: "1.0625rem" }}>
              Identity, licence and guarantor checks for every driver. A named Flydrive handler for
              every confirmed booking.
            </p>
            <Link href="/trust-and-safety" className="section-link">
              How we vet drivers →
            </Link>
          </div>
          <CheckList
            items={[
              { label: "Identity verified" },
              { label: "Licence checked" },
              { label: "Guarantor on file" },
              { label: "Background check", note: "Process being finalised" },
            ]}
          />
        </div>
      </section>

      <Section wide id="cities" title="Where we operate">
        <div className="city-grid">
          <Link href="/locations/lagos" className="city">
            <span className="city-name">Lagos</span>
            <span className="city-sub">Island, Mainland and beyond →</span>
          </Link>
          <Link href="/locations/ibadan" className="city city-blue">
            <span className="city-name">Ibadan</span>
            <span className="city-sub">Across the city →</span>
          </Link>
        </div>
      </Section>

      <div className="container" style={{ display: "grid", gap: 24, paddingBottom: 96 }}>
        <Banner
          tone="cream"
          title="Visiting Lagos or Ibadan?"
          body="Car + driver covers your whole stay — business trips, weddings, family visits. Tell us your dates and we'll plan the rest with you."
          action={{ href: "/for-visitors", label: "Plan your visit" }}
        />
        <Banner
          tone="grey"
          title="Are you a professional driver?"
          body="See every assignment in full before you accept. Declining never counts against you."
          action={{ href: "/drivers", label: "Drive with Flydrive", style: "secondary" }}
        />
      </div>
    </>
  );
}
