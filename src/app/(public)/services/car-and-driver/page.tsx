import type { Metadata } from "next";
import Link from "next/link";
import { CAR_AND_DRIVER_TERMS, VEHICLE_CLASSES } from "@/content/site";
import { bookingsOpen } from "@/platform/config";
import { PageHeader, Section } from "@/ui/blocks";
import { MinivanArt, SaloonArt, SuvArt } from "@/ui/icons";
import { Photo } from "@/ui/Photo";
import { RoadPattern } from "@/ui/RoadPattern";

export const metadata: Metadata = {
  title: "Car + driver",
  description:
    "No car? Flydrive arranges a suitable vehicle and a vetted professional driver together in Lagos and Ibadan — for a day, a week or your whole stay.",
  alternates: { canonical: "/services/car-and-driver" },
};

/**
 * Car + driver is approved as a service (ADR 0002). Capacities, deposit, fuel policy, pricing and
 * damage/cover terms are still OPEN and come from src/content/site.ts.
 */
const ART = { saloon: SaloonArt, suv: SuvArt, minivan: MinivanArt } as const;

export default function CarAndDriverPage() {
  const open = bookingsOpen();
  return (
    <>
      <PageHeader
        tone="amber"
        back={{ href: "/services", label: "All services" }}
        title="No car? We’ll bring the car and the driver."
        lead="One booking, one handler: a suitable vehicle and a vetted professional driver for a day, a week or your whole stay."
        aside={
          <Photo name="chauffeurSuv" sizes="(max-width: 960px) 100vw, 560px" priority>
            <div className="hero-overlay">
              <p className="ov-label">Every car + driver booking includes</p>
              <ul className="ticks ticks-2">
                <li>Car in your chosen class</li>
                <li>A driver you choose</li>
                <li>Condition recorded</li>
                <li>A named handler</li>
              </ul>
            </div>
          </Photo>
        }
      >
        <div className="button-row">
          <Link
            href={open ? "/bookings/new?service=car" : "/contact"}
            className="button button-arrow"
          >
            {open ? "Book car + driver" : "Ask about car + driver"}
          </Link>
          <Link href="/contact" className="button button-outline">
            Ask for a quote
          </Link>
        </div>
      </PageHeader>

      <Section id="classes" eyebrow="Vehicle classes" title="Choose the size, we match the car.">
        <div className="grid-3">
          {VEHICLE_CLASSES.map((c) => {
            const Art = ART[c.key];
            return (
              <div key={c.key} className="class-card">
                <div className="art">
                  <Art />
                </div>
                <div className="body">
                  <h3>{c.name}</h3>
                  <p>
                    {c.passengers ? `Up to ${c.passengers} passengers. ` : ""}
                    {c.use}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="fine">
          The specific make and model is confirmed with your booking. Passenger capacities will be
          shown once the fleet is confirmed.
        </p>
      </Section>

      <Section id="how" title="How car + driver works">
        <ol className="grid-5 list-reset">
          {[
            ["Tell us your trip", "Dates, pickup point, passengers, luggage and vehicle class."],
            ["We match a car", "Our team checks a suitable vehicle is free for your dates."],
            ["Choose your driver", "Pick from vetted drivers; they accept the full assignment."],
            ["Pay & confirm", "See the full price, pay, and we confirm once verified."],
            ["Meet & go", "Your driver arrives with the car; you both record its condition."],
          ].map(([t, b], i) => (
            <li key={t} className="card">
              <span className="card-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t}</h3>
              <p>{b}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid-2 grid-2-wide">
          <div className="card card-lg card-dark has-pattern">
            <RoadPattern layout="a" tone="dark" />
            <h2>Made for</h2>
            <ul className="ticks ticks-amber ticks-2">
              <li>Visitors &amp; returnees</li>
              <li>Business trips</li>
              <li>Weddings &amp; owambe</li>
              <li>Family visits</li>
              <li>Conferences</li>
              <li>Interstate travel</li>
            </ul>
          </div>
          <div className="card card-lg card-outline">
            <h2>Before you book</h2>
            <ul className="ticks ticks-amber">
              <li>
                Fuel, tolls and parking:{" "}
                {CAR_AND_DRIVER_TERMS.fuel ?? "policy being finalised, shown before you pay"}
              </li>
              <li>
                Security deposit:{" "}
                {CAR_AND_DRIVER_TERMS.deposit ?? "policy being finalised, shown before you pay"}
              </li>
              <li>Damage and cover terms are shown before payment</li>
            </ul>
            <p style={{ marginTop: 20 }}>
              <Link href="/faq" className="text-link">
                Read the FAQ
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
