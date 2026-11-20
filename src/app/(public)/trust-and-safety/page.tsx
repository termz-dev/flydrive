import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/ui/blocks";
import { GuarantorIcon, IdIcon, LicenceIcon, ShieldIcon } from "@/ui/icons";
import { Photo } from "@/ui/Photo";

export const metadata: Metadata = {
  title: "Trust & safety",
  description:
    "How Flydrive screens drivers, what you see before and after paying, how the car's condition is recorded, and how safety concerns are handled.",
  alternates: { canonical: "/trust-and-safety" },
};

export default function TrustPage() {
  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow="Trust & safety"
        title="Who we let drive, and how we look after you."
        lead="Every driver is screened before they can receive a booking. Every confirmed booking has a named person at Flydrive responsible for it."
        aside={<Photo name="driverWindow" sizes="(max-width: 960px) 100vw, 560px" priority />}
      />

      <Section id="screening" title="Driver screening">
        <div className="grid-4">
          <div className="card card-outline">
            <span className="card-icon">
              <IdIcon />
            </span>
            <h3>Identity</h3>
            <p>Verified before a driver can be offered any work.</p>
          </div>
          <div className="card card-outline">
            <span className="card-icon">
              <LicenceIcon />
            </span>
            <h3>Driver’s licence</h3>
            <p>A valid licence on file, rechecked when it expires.</p>
          </div>
          <div className="card card-outline">
            <span className="card-icon">
              <GuarantorIcon />
            </span>
            <h3>Guarantor</h3>
            <p>A named guarantor for every driver.</p>
          </div>
          <div className="card card-outline">
            <span className="card-icon">
              <ShieldIcon />
            </span>
            <h3>Background check</h3>
            <p>Process being finalised. Reviewed by our team; raw results are never shared.</p>
          </div>
        </div>
        <div className="notice notice-pending" role="note" style={{ marginTop: 16 }}>
          <p>
            <strong>Flydrive training: Pending.</strong> Our road-rules assessment hasn’t started
            yet, so every driver profile shows “Pending” until it does.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid-2 grid-2-wide">
          <div className="card card-lg">
            <h2>What you see about your driver</h2>
            <div className="grid-2" style={{ gap: 24 }}>
              <div>
                <strong>Before you pay</strong>
                <ul className="ticks" style={{ marginTop: 12 }}>
                  <li>First name</li>
                  <li>Blurred photo</li>
                  <li>Years of experience</li>
                  <li>Training status</li>
                </ul>
              </div>
              <div>
                <strong>After confirmation</strong>
                <ul className="ticks" style={{ marginTop: 12 }}>
                  <li>Full name</li>
                  <li>A phone number for the booking</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card card-lg card-outline">
            <h2>The car</h2>
            <p>
              At pickup and return, you and the driver each confirm the car’s condition with notes.
              For car + driver bookings, the vehicle is matched and checked by our team before it
              reaches you.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="card card-lg card-danger card-split">
          <div>
            <h2>During a booking</h2>
            <p style={{ marginTop: 12 }}>
              Your handler is your first contact. Safety concerns go straight to a person and are
              handled separately from ordinary changes. Drivers who report a concern or refuse
              unsafe work are never penalised for it.
            </p>
          </div>
          <Link href="/contact" className="button button-arrow button-small">
            Contact us
          </Link>
        </div>
      </Section>
    </>
  );
}
