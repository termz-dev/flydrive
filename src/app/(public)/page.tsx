import Link from "next/link";
import type { Metadata } from "next";
import { SERVICE_PACKAGES } from "@/modules/catalog/packages";
import { bookingsOpen } from "@/platform/config";
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
          <p className="chip">Professional drivers in Lagos and Ibadan</p>
          <h1 id="hero-title">Your car, our driver. Or both, arranged.</h1>
          <p className="lead">
            Book a vetted driver by the half-day, day, week or longer. You choose who drives, they
            accept the full job, and nothing is confirmed until your payment is verified.
          </p>
          <div className="button-row">
            {bookingsOpen() ? (
              <Link className="button button-yellow button-arrow" href="/bookings/new">
                Book a driver
              </Link>
            ) : (
              <Link className="button button-yellow button-arrow" href="/contact">
                Talk to us
              </Link>
            )}
            <Link className="button button-secondary" href="/services">
              Explore services
            </Link>
          </div>
        </div>
      </section>

      <Section wide id="choose" title="Bring your car, or let us bring one.">
        <div className="choice-tiles">
          <Link href="/services" className="choice-tile">
            <span className="choice-kicker">I have a car</span>
            <span className="choice-title">Driver only</span>
            <span className="choice-body">
              A screened driver works your schedule, in your own vehicle.
            </span>
            <span className="choice-link">See packages</span>
          </Link>
          <Link href="/services/car-and-driver" className="choice-tile choice-tile-dark">
            <span className="choice-kicker">I need a car too</span>
            <span className="choice-title">Car + driver</span>
            <span className="choice-body">
              A suitable car and a vetted driver together, for visits, events and business trips.
            </span>
            <span className="choice-link">How car + driver works</span>
          </Link>
        </div>
        <p className="notice-line">
          <Clock />
          <span>
            Standard notice is 3 days. Need someone sooner? Our team checks availability by hand,
            and short-notice requests are never confirmed automatically.
          </span>
        </p>
      </Section>

      <section className="panel-dark" aria-labelledby="packages-heading">
        <div className="container">
          <div className="section-head">
            <div>
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
        title="Every step is a real check, not a promise."
        intro="Choosing a driver isn't a booking, and paying isn't a confirmation until our team has checked it."
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
            <h2 id="trust-heading">Screened before they ever see a booking.</h2>
            <p className="lead">
              Identity, licence and guarantor checks for every driver, with background checks being
              finalised. A named Flydrive handler for every confirmed booking.
            </p>
            <Link href="/trust-and-safety" className="section-link">
              How we vet drivers
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

      <Section wide id="cities" title="Two cities, to start.">
        <div className="city-grid">
          <Link href="/locations/lagos" className="city">
            <span className="city-name">Lagos</span>
            <span className="city-sub">Island, Mainland and beyond</span>
          </Link>
          <Link href="/locations/ibadan" className="city city-blue">
            <span className="city-name">Ibadan</span>
            <span className="city-sub">Across the city</span>
          </Link>
        </div>
      </Section>

      <div className="container banner-stack">
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
