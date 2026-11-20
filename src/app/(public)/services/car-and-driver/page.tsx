import type { Metadata } from "next";
import Link from "next/link";
import { BookingNotOpen, CheckList, Section, Steps } from "@/ui/blocks";
import { MinivanArt, SaloonArt, SuvArt } from "@/ui/icons";

export const metadata: Metadata = {
  title: "Car + driver",
  description:
    "No car? Flydrive arranges a suitable vehicle and a vetted professional driver together in Lagos and Ibadan — for a day, a week or your whole stay.",
  alternates: { canonical: "/services/car-and-driver" },
};

/**
 * Car + driver is approved as a service (ADR 0002). Vehicle capacities, deposit, fuel policy,
 * pricing and damage/cover terms are still OPEN, so they are stated as being finalised.
 */
const CLASSES = [
  { name: "Saloon", use: "City meetings and errands.", Art: SaloonArt },
  { name: "SUV", use: "Comfort, luggage and longer trips.", Art: SuvArt },
  { name: "Minivan", use: "Families, groups and events.", Art: MinivanArt },
] as const;

export default function CarAndDriverPage() {
  return (
    <>
      <section className="page-header page-header-amber">
        <div className="container two-col" style={{ alignItems: "center", gap: 48 }}>
          <div>
            <p>
              <Link href="/services">← All services</Link>
            </p>
            <h1>No car? We&apos;ll bring the car and the driver.</h1>
            <p className="lead">
              One booking, one handler: a suitable vehicle and a vetted professional driver for a
              day, a week or your whole stay.
            </p>
            <div className="button-row">
              <Link className="button button-yellow button-arrow" href="/contact">
                Ask about car + driver
              </Link>
              <Link className="button button-secondary" href="/how-it-works">
                How booking works
              </Link>
            </div>
          </div>
          <div className="card" style={{ borderRadius: 24, padding: 32, border: 0 }}>
            <p className="eyebrow" style={{ color: "var(--muted)" }}>
              Every car + driver booking includes
            </p>
            <CheckList
              plain
              items={[
                { label: "A vehicle in the class you choose" },
                { label: "A screened driver you choose and who accepts" },
                { label: "Condition recorded at pickup and return" },
                { label: "A named Flydrive handler" },
              ]}
            />
          </div>
        </div>
      </section>

      <Section
        wide
        id="classes"
        eyebrow="Vehicle classes"
        title="Choose the size, we match the car."
      >
        <div className="vehicle-grid">
          {CLASSES.map(({ name, use, Art }) => (
            <article key={name} className="vehicle">
              <div className="vehicle-art">
                <Art />
              </div>
              <div className="vehicle-body">
                <h3>{name}</h3>
                <p>{use}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="muted" style={{ marginTop: 16, fontSize: "0.875rem" }}>
          The specific make and model is confirmed with your booking. Passenger capacities will be
          shown once the fleet is confirmed.
        </p>
      </Section>

      <Section wide id="how" title="How car + driver works">
        <Steps
          variant="boxed"
          items={[
            {
              title: "Tell us your trip",
              body: <p>Dates, pickup point, passengers, luggage and vehicle class.</p>,
            },
            {
              title: "We match a car",
              body: <p>Our team checks a suitable vehicle is free for your dates.</p>,
            },
            {
              title: "Choose your driver",
              body: <p>Pick from vetted drivers; they accept the full assignment.</p>,
            },
            {
              title: "Pay & confirm",
              body: <p>See the full price, pay, and we confirm once payment is verified.</p>,
            },
            {
              title: "Meet & go",
              body: <p>Your driver arrives with the car; you both record its condition.</p>,
            },
          ]}
        />
      </Section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container two-col">
          <div className="banner banner-navy" style={{ alignItems: "flex-start" }}>
            <div>
              <h2>Made for</h2>
              <ul className="tag-list" style={{ marginTop: 16 }}>
                {[
                  "Visitors & returnees",
                  "Business trips",
                  "Weddings & owambe",
                  "Family visits",
                  "Conferences",
                  "Interstate travel",
                ].map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card" style={{ borderRadius: 20, padding: 40 }}>
            <h2 style={{ fontSize: "1.5rem" }}>Before you book</h2>
            <ul style={{ color: "var(--ink-soft)", lineHeight: 1.8 }}>
              <li>Fuel, tolls and parking: policy being finalised</li>
              <li>Security deposit: policy being finalised</li>
              <li>Pricing, damage and cover terms are shown before you pay</li>
            </ul>
            <Link href="/faq" className="section-link">
              Read the FAQ →
            </Link>
          </div>
        </div>
      </section>

      <Section>
        <BookingNotOpen />
      </Section>
    </>
  );
}
