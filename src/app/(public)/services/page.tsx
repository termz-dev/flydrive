import type { Metadata } from "next";
import Link from "next/link";
import { SERVICE_PACKAGES } from "@/modules/catalog/packages";
import { bookingsOpen } from "@/platform/config";
import { PageHeader, Section } from "@/ui/blocks";
import { RoadPattern } from "@/ui/RoadPattern";

export const metadata: Metadata = {
  title: "Services and packages",
  description:
    "Book a vetted driver for your own car, or car + driver, in Lagos and Ibadan: half-day, full-day, weekly, monthly, weekend or custom.",
  alternates: { canonical: "/services" },
};

const BEST_FOR: Record<string, string> = {
  "half-day": "Errands, appointments",
  "full-day": "Meetings, events, visits",
  weekly: "Routines, temporary gaps",
  monthly: "Families, executives",
  weekend: "Weddings, getaways",
  custom: "Interstate, unusual needs",
};

export default function ServicesPage() {
  const open = bookingsOpen();
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Two ways to book. Six ways to schedule."
        lead="Pick whether you need a car, then choose how long you need your driver. Prices are shown in full before you pay."
      />

      <Section>
        <div className="grid-2">
          <div className="opt-card has-pattern">
            <RoadPattern layout="a" />
            <span className="card-kicker">Option 1</span>
            <h2>Driver for your car</h2>
            <p>
              You provide the vehicle; we provide a screened, professional driver who works your
              schedule.
            </p>
            <ul className="ticks">
              <li>Your car is added once, then reused</li>
              <li>Manual or automatic — just tell us</li>
              <li>You cover fuel, tolls, parking and washing</li>
            </ul>
            <Link
              href={open ? "/bookings/new" : "/contact"}
              className="button button-arrow button-small"
            >
              {open ? "Book a driver" : "Talk to us"}
            </Link>
          </div>
          <div className="opt-card card-amber has-pattern">
            <RoadPattern layout="c" tone="amber" />
            <span className="card-kicker">Option 2</span>
            <h2>Car + driver</h2>
            <p>
              No car? We arrange a suitable vehicle and a vetted driver together, for as long as you
              need.
            </p>
            <ul className="ticks">
              <li>Choose a vehicle class: saloon, SUV or minivan</li>
              <li>Vehicle condition recorded at pickup and return</li>
              <li>Popular with visitors, weddings and events</li>
            </ul>
            <Link
              href="/services/car-and-driver"
              className="button button-yellow button-arrow button-small"
            >
              Explore car + driver
            </Link>
          </div>
        </div>
      </Section>

      <Section
        id="packages"
        title="Packages"
        intro="Every package works with either option. Standard notice is 3 days."
      >
        <div className="pkg-table-wrap">
          <table className="pkg-table">
            <thead>
              <tr>
                <th scope="col">Package</th>
                <th scope="col">Best for</th>
                <th scope="col">Driver for your car</th>
                <th scope="col">Car + driver</th>
              </tr>
            </thead>
            <tbody>
              {SERVICE_PACKAGES.map((p) => (
                <tr key={p.slug}>
                  <td>
                    <Link href={`/services/${p.slug}`}>{p.name}</Link>
                    <small>{p.short}</small>
                  </td>
                  <td>{BEST_FOR[p.slug]}</td>
                  <td className="tbc">{p.slug === "custom" ? "Quoted" : "Rate to be confirmed"}</td>
                  <td className="tbc">
                    {p.slug === "custom" ? "Quoted" : "Rate to be confirmed, plus vehicle"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="fine">
          Rates and hours are being finalised. You&apos;ll always see the full price before you pay.
        </p>
      </Section>

      <Section id="good-to-know" title="Good to know">
        <div className="grid-4">
          <div className="card">
            <strong>Short notice</strong>
            <p>Inside 3 days, our team checks availability by hand before you choose.</p>
          </div>
          <div className="card">
            <strong>Running costs</strong>
            <p>
              On driver-only bookings, fuel, tolls, parking and washing are paid by you. Car +
              driver terms are shown before you pay.
            </p>
          </div>
          <div className="card">
            <strong>Overnight trips</strong>
            <p>Out of state, provide somewhere for your driver to sleep and freshen up.</p>
          </div>
          <div className="card">
            <strong>Changes</strong>
            <p>Reschedule and cancellation terms are shown before payment.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
