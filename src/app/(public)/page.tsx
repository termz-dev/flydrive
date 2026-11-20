import Link from "next/link";
import type { Metadata } from "next";
import { SERVICE_PACKAGES } from "@/modules/catalog/packages";
import { Banner, Section } from "@/ui/blocks";
import { Clock } from "@/ui/icons";
import { Media } from "@/ui/Media";
import { PackageList } from "@/ui/PackageList";

export const metadata: Metadata = {
  title: { absolute: "Flydrive — vetted professional drivers in Lagos & Ibadan" },
  description:
    "Flydrive arranges a vetted professional driver in Lagos and Ibadan — for your own car, or with a car we arrange — by the half-day, day, week or longer.",
  alternates: { canonical: "/" },
};

/** Facts we can state today. No customer counts, ratings or reviews until they exist. */
const FACTS = [
  { label: "Cities", value: "2" },
  { label: "Notice for a standard booking", value: "3 days" },
  { label: "Checks before a driver is offered", value: "3" },
  { label: "Ways to book: driver only, or car + driver", value: "2" },
  { label: "Short-notice requests auto-confirmed", value: "0" },
] as const;

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
        <ol className="steps">
          <li>
            <h3>Tell us what you need</h3>
            <p>Dates, area, duties — and whether you need a car.</p>
          </li>
          <li>
            <h3>Choose your driver</h3>
            <p>They see the full assignment and accept or decline.</p>
          </li>
          <li>
            <h3>Pay, then we confirm</h3>
            <p>We verify your payment before anything is confirmed.</p>
          </li>
          <li>
            <h3>Handover &amp; go</h3>
            <p>The car&apos;s condition is recorded by both sides.</p>
          </li>
        </ol>
      </Section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="why-heading">
        <div className="container why-grid">
          <div className="why-copy">
            <p className="eyebrow">Why Flydrive</p>
            <h2 id="why-heading">Vetted on purpose. Confirmed for real.</h2>
            <p className="lead">
              Every driver passes identity, licence and guarantor checks before they can be offered
              to anyone. You see who you&apos;re choosing, and a named Flydrive handler looks after
              every confirmed booking.
            </p>
            <div>
              <Link className="button button-arrow" href="/trust-and-safety">
                How we vet drivers
              </Link>
            </div>
          </div>
          <div className="media-frame">
            <Media slot="why" sizes="(max-width: 1000px) 100vw, 30vw" />
          </div>
          <div className="facts">
            <dl>
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="facts-note">
              Choosing a driver isn&apos;t a booking, and paying isn&apos;t a confirmation — until
              our team checks it.
            </p>
          </div>
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
