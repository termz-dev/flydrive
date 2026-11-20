import type { Metadata } from "next";
import Link from "next/link";
import { PAYMENT_METHODS } from "@/content/site";
import { bookingsOpen } from "@/platform/config";
import { PageHeader, Section } from "@/ui/blocks";
import { ArrowRight } from "@/ui/icons";
import { Photo } from "@/ui/Photo";
import { RoadPattern } from "@/ui/RoadPattern";

export const metadata: Metadata = {
  title: "For visitors and returnees",
  description:
    "Visiting Lagos or Ibadan? Book a car and a vetted driver for your whole stay, arranged before you fly.",
  alternates: { canonical: "/for-visitors" },
};

export default function VisitorsPage() {
  const open = bookingsOpen();
  return (
    <>
      <PageHeader
        tone="cream"
        eyebrow="For visitors & returnees"
        title="Land, get in, get on with your trip."
        lead="Coming home for December, a wedding or business? Book a car and a vetted driver for your whole stay in Lagos or Ibadan — arranged before you fly."
        aside={
          <Photo name="traveller" sizes="(max-width: 960px) 100vw, 560px" priority>
            <div className="hero-overlay hero-overlay-small" aria-hidden="true">
              <p className="ov-label">Example stay</p>
              <strong>18 – 28 Dec · Lagos</strong>
              <span>Car + driver · SUV · Ikoyi pickup</span>
            </div>
          </Photo>
        }
      >
        <div className="button-row">
          <Link
            href={open ? "/bookings/new?service=car" : "/contact"}
            className="button button-arrow"
          >
            {open ? "Plan my stay" : "Talk to us"}
          </Link>
          <Link href="/services/car-and-driver" className="button button-outline">
            About car + driver
          </Link>
        </div>
      </PageHeader>

      <Section id="ways" title="Two ways to get around">
        <div className="grid-2">
          <Link href="/services/car-and-driver" className="route-card route-card-dark">
            <div>
              <strong>Car + driver</strong>
              <span>No car here? We arrange both. Most visitors choose this.</span>
            </div>
            <span className="arrow">
              <ArrowRight />
            </span>
          </Link>
          <Link href="/services" className="route-card">
            <div>
              <strong>Driver for a family car</strong>
              <span>Using a relative’s car? Book a driver for it with the owner’s agreement.</span>
            </div>
            <span className="arrow">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </Section>

      <Section>
        <div className="grid-2" style={{ alignItems: "start" }}>
          <div>
            <h2 className="h-sub">Book before you travel</h2>
            <p className="section-intro">
              December is busy. Give us at least 3 days’ notice — earlier is better. Inside 3 days,
              our team checks availability by hand.
            </p>
          </div>
          <div className="card card-lg">
            <h3>What we’ll ask you</h3>
            <ul className="ticks ticks-2" style={{ marginTop: 16 }}>
              <li>Arrival and departure dates</li>
              <li>Where you’re staying</li>
              <li>Passengers and luggage</li>
              <li>Any trips out of town</li>
              <li>A phone number that works here</li>
              <li>Payment: {PAYMENT_METHODS ?? "methods shown before you pay"}</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="cta-band has-pattern">
          <RoadPattern layout="b" tone="dark" />
          <div>
            <h2>Have a question before booking?</h2>
            <p>We’ll help you pick the right package for your trip.</p>
          </div>
          <Link href="/contact" className="button button-yellow button-arrow button-small">
            Talk to us
          </Link>
        </div>
      </Section>
    </>
  );
}
