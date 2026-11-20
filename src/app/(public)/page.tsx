import Link from "next/link";
import type { Metadata } from "next";
import { SERVICE_PACKAGES } from "@/modules/catalog/packages";
import { Banner, CheckList, Section } from "@/ui/blocks";
import { Clock } from "@/ui/icons";
import { Media } from "@/ui/Media";
import { PackageList } from "@/ui/PackageList";
import { ProgressSteps } from "@/ui/ProgressSteps";

export const metadata: Metadata = {
  title: { absolute: "Flydrive — vetted professional drivers in Lagos & Ibadan" },
  description:
    "Flydrive arranges a vetted professional driver in Lagos and Ibadan — for your own car, or with a car we arrange — by the half-day, day, week or longer.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <section className="hero-frame" aria-labelledby="hero-title">
        <div className="hero-media">
          <Media slot="hero" priority />
        </div>
        <div className="hero-content">
          <p className="chip">Professional drivers · Lagos &amp; Ibadan</p>
          <h1 id="hero-title">Your car, our driver. Or both, arranged.</h1>
          <p className="lead">
            Book a vetted driver by the half-day, day, week or longer. You choose who drives, they
            accept the full job, and nothing is confirmed until your payment is verified.
          </p>
          <div className="button-row">
            <Link className="button button-yellow button-arrow" href="/contact">
              Talk to us
            </Link>
            <Link className="button" href="/services">
              Explore services →
            </Link>
          </div>
        </div>
      </section>

      <Section
        wide
        id="choose"
        eyebrow="Two ways to book"
        title="Bring your car, or let us bring one."
      >
        <div className="city-grid">
          <Link href="/services" className="city city-blue">
            <span className="city-sub">I have a car</span>
            <span className="city-name">Driver only</span>
            <span className="city-sub">
              A screened driver works your schedule, in your vehicle →
            </span>
          </Link>
          <Link href="/services/car-and-driver" className="city">
            <span className="city-sub">I need a car too</span>
            <span className="city-name">Car + driver</span>
            <span className="city-sub">
              A suitable car and a vetted driver together — for visits and events →
            </span>
          </Link>
        </div>
        <p className="muted" style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <Clock />
          <span>
            Standard notice is 3 days. Sooner? Our team checks availability by hand — short-notice
            requests are never confirmed automatically.
          </span>
        </p>
      </Section>

      <section className="panel-dark" aria-labelledby="packages-heading">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Packages</p>
              <h2 id="packages-heading">Booked by duration, not by trip.</h2>
            </div>
            <div style={{ maxWidth: 380 }}>
              <p>
                Flydrive isn&apos;t ride hailing. Every package is available driver-only or as car +
                driver.
              </p>
            </div>
          </div>
          <PackageList
            items={SERVICE_PACKAGES.map(({ slug, name, summary }) => ({ slug, name, summary }))}
            media={<Media slot="packages" sizes="(max-width: 900px) 100vw, 40vw" />}
          />
        </div>
      </section>

      <Section
        wide
        id="how"
        eyebrow="How it works"
        title="Every step is a real check, not a promise."
        link={{ href: "/how-it-works", label: "The full process" }}
      >
        <ProgressSteps
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

      <section className="section section-trust" aria-labelledby="trust-heading">
        <div className="container trust-grid">
          <div>
            <p className="eyebrow">Trust &amp; safety</p>
            <h2 id="trust-heading">Screened before they ever see a booking.</h2>
            <p className="lead">
              Identity, licence and guarantor checks for every driver, with background checks being
              finalised. A named Flydrive handler for every confirmed booking.
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

      <Section wide id="cities" eyebrow="Where we operate" title="Two cities, to start.">
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

      <div className="container" style={{ display: "grid", gap: 16 }}>
        <Banner
          tone="cream"
          title="Visiting Lagos or Ibadan?"
          body="Car + driver covers your whole stay — business trips, weddings, family visits. Tell us your dates and we'll plan it with you."
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
