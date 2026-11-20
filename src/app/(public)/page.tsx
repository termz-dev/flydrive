import Link from "next/link";
import type { Metadata } from "next";
import { SERVICE_PACKAGES } from "@/modules/catalog/packages";
import { bookingsOpen } from "@/platform/config";
import { BookingWidget } from "@/ui/BookingWidget";
import { HeroMap } from "@/ui/HeroMap";
import { GuarantorIcon, IdIcon, LicenceIcon, ShieldIcon } from "@/ui/icons";
import { Photo } from "@/ui/Photo";
import { RoadPattern } from "@/ui/RoadPattern";

export const metadata: Metadata = {
  title: { absolute: "Flydrive — vetted professional drivers in Lagos & Ibadan" },
  description:
    "Flydrive arranges a vetted professional driver in Lagos and Ibadan — for your own car, or with a car we arrange — by the half-day, day, week or longer.",
  alternates: { canonical: "/" },
};

const HALF = "(max-width: 860px) 100vw, 640px";

export default function HomePage() {
  const open = bookingsOpen();
  const bookHref = open ? "/bookings/new" : "/contact";

  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="container home-hero-inner">
          <div className="home-hero-copy">
            <div className="intro">
              <span className="pill-label">
                {open ? "Now booking in Lagos & Ibadan" : "Launching in Lagos & Ibadan"}
              </span>
              <h1 id="hero-title">
                Your driver.
                <br />
                Your schedule.
              </h1>
              <p className="hero-lead">
                Vetted professional drivers by the half-day, day, week or longer — in your car, or
                with one we arrange.
              </p>
            </div>
            <BookingWidget open={open} />
          </div>
          <HeroMap />
        </div>
        <div className="trust-strip">
          <ul className="container" aria-label="How drivers are checked">
            <li>
              <IdIcon />
              Identity verified
            </li>
            <li>
              <LicenceIcon />
              Licence checked
            </li>
            <li>
              <GuarantorIcon />
              Guarantor on file
            </li>
            <li>
              <ShieldIcon />
              Background checks being finalised
            </li>
          </ul>
        </div>
      </section>

      <section className="section section-tint" aria-labelledby="ways-heading">
        <div className="container">
          <div className="section-head">
            <h2 id="ways-heading" className="h-section" style={{ maxWidth: 720 }}>
              Two ways to get where you’re going.
            </h2>
            <p className="aside">
              Bring your own car, or let us arrange one. Either way, the same vetted drivers.
            </p>
          </div>
          <div className="svc-grid">
            <article className="svc-card">
              <Photo name="driverAtWheel" sizes={HALF}>
                <span className="tag">I have a car</span>
              </Photo>
              <div className="svc-body">
                <h3>Driver for your car</h3>
                <div className="svc-facts">
                  <p>
                    Your vehicle,
                    <br />
                    our vetted driver
                  </p>
                  <p>
                    Half-day to monthly
                    <br />
                    Lagos &amp; Ibadan
                  </p>
                </div>
                <div className="svc-actions">
                  <Link href={bookHref} className="button button-arrow">
                    {open ? "Book a driver" : "Talk to us"}
                  </Link>
                  <Link href="/services" className="text-link">
                    See packages
                  </Link>
                </div>
              </div>
            </article>

            <article className="svc-card svc-bleed">
              <Photo name="chauffeurDoor" sizes={HALF}>
                <span className="tag tag-ink">I need a car too</span>
              </Photo>
              <div className="scrim" aria-hidden="true" />
              <div className="svc-body">
                <h3>
                  Car + driver,
                  <br />
                  ready when you land
                </h3>
                <p>A saloon, SUV or minivan with a vetted driver — for a day or your whole stay.</p>
                <Link href="/services/car-and-driver" className="button button-light button-arrow">
                  Explore car + driver
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-tight" aria-labelledby="packages-heading">
        <div className="container">
          <div className="pkg-panel has-pattern">
            <RoadPattern layout="a" />
            <div className="section-head">
              <div>
                <h2 id="packages-heading" className="h-sub">
                  Book by the time you need.
                </h2>
                <p>Not ride hailing — your driver stays with you.</p>
              </div>
              <Link href="/services" className="button button-secondary button-small">
                Compare packages
              </Link>
            </div>
            <div className="pkg-tiles">
              {SERVICE_PACKAGES.map((p) => (
                <Link
                  key={p.slug}
                  href={`/services/${p.slug}`}
                  className={`pkg-tile${p.slug === "custom" ? " pkg-tile-dark" : ""}`}
                >
                  <small>{p.short}</small>
                  <span>
                    {p.slug === "custom" ? "Custom" : p.slug === "monthly" ? "Monthly+" : p.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight" aria-labelledby="steps-heading">
        <div className="container split">
          <div className="split-copy">
            <h2 id="steps-heading" className="h-section">
              Booked in four steps. Confirmed only when it’s real.
            </h2>
            <ol className="row-steps">
              <li>
                <div>
                  <h3>Tell us what you need</h3>
                  <p>Dates, area, duties — and whether you need a car.</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>Choose your driver</h3>
                  <p>They see the whole assignment, then accept.</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>Pay — then we verify</h3>
                  <p>Nothing is confirmed until our team checks your payment.</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>Meet your driver</h3>
                  <p>You both record the car’s condition, and you’re off.</p>
                </div>
              </li>
            </ol>
            <Link href="/how-it-works" className="button button-arrow button-small">
              How it works
            </Link>
          </div>
          <div className="phone-panel has-pattern" aria-hidden="true">
            <RoadPattern layout="b" />
            <div className="phone">
              <div className="phone-screen">
                <p className="ref">Example booking</p>
                <p className="title">You’re confirmed for Saturday</p>
                <div className="phone-driver">
                  <span className="blur-avatar" />
                  <span>
                    <strong>Tunde</strong>
                    <br />
                    <span className="muted">Your driver · 9 years</span>
                  </span>
                </div>
                <ul className="dots">
                  <li>Driver accepted</li>
                  <li>Payment verified</li>
                  <li>Handler assigned</li>
                  <li className="todo">Pickup handover</li>
                </ul>
                <span className="phone-cta">Share meeting point</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight" aria-labelledby="safety-heading">
        <div className="container">
          <div className="dark-panel">
            <div className="dark-panel-copy">
              <h2 id="safety-heading" className="h-section">
                Safety isn’t a feature. It’s the job.
              </h2>
              <div className="ruled">
                <div>
                  <h3>Screened before any booking</h3>
                  <p>
                    Identity, licence and guarantor checks for every driver. Our background check
                    process is being finalised.
                  </p>
                </div>
                <div>
                  <h3>A named person on every booking</h3>
                  <p>Your handler is responsible from confirmation to return.</p>
                </div>
                <div>
                  <h3>A straight line to help</h3>
                  <p>Safety concerns go directly to a person, separate from ordinary support.</p>
                </div>
              </div>
              <Link
                href="/trust-and-safety"
                className="button button-light button-arrow button-small"
              >
                Trust &amp; safety
              </Link>
            </div>
            <Photo name="driverWindow" sizes={HALF} />
          </div>
        </div>
      </section>

      <section className="section section-tight" aria-label="Cities">
        <div className="container city-tiles">
          <Link href="/locations/lagos" className="city-tile">
            <svg
              className="road-pattern"
              viewBox="0 0 600 360"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <path d="M0 260 C 150 220, 300 300, 600 240 L600 360 L0 360 Z" fill="#162130" />
              <path
                d="M-20 140 C 200 100, 380 190, 640 120"
                stroke="#243142"
                strokeWidth="10"
                fill="none"
              />
              <path
                d="M380 -20 C 360 120, 420 200, 400 380"
                stroke="#243142"
                strokeWidth="10"
                fill="none"
              />
            </svg>
            <span className="kicker">Lagos</span>
            <span>
              <span className="big">Island to Mainland.</span>
              <span className="more">Drivers in Lagos</span>
            </span>
          </Link>
          <Link href="/locations/ibadan" className="city-tile city-tile-light">
            <RoadPattern layout="c" />
            <span className="kicker">Ibadan</span>
            <span>
              <span className="big">Across the city.</span>
              <span className="more">Drivers in Ibadan</span>
            </span>
          </Link>
        </div>
      </section>

      <section className="section section-tight" style={{ paddingBottom: 120 }} aria-label="More">
        <div className="container promo-grid">
          <article className="promo promo-amber">
            <Photo name="family" sizes={HALF} />
            <div className="promo-body">
              <h2>Coming home for December?</h2>
              <p>
                Book a car and driver for the whole family’s stay before you fly. We’ll have it
                ready.
              </p>
              <Link href="/for-visitors" className="button button-arrow button-small">
                Plan your visit
              </Link>
            </div>
          </article>
          <article className="promo">
            <Photo name="happyDriver" sizes={HALF} />
            <div className="promo-body">
              <h2>Drive with Flydrive.</h2>
              <p>
                See every assignment in full before you accept. Declining never counts against you.
              </p>
              <Link href="/drivers" className="button button-secondary button-small">
                Become a driver
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
