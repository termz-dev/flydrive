import type { Metadata } from "next";
import Link from "next/link";
import { DRIVER_PAYOUT_TIMING } from "@/content/site";
import { PageHeader, Section } from "@/ui/blocks";
import { Photo } from "@/ui/Photo";
import { RoadPattern } from "@/ui/RoadPattern";

export const metadata: Metadata = {
  title: "Drive with Flydrive",
  description:
    "Professional drivers in Lagos and Ibadan: see every assignment in full before you accept. Declining never counts against you.",
  alternates: { canonical: "/drivers" },
};

export default function DriversPage() {
  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow="For professional drivers"
        title="Know the whole job before you say yes."
        lead="Flydrive offers you full assignments — dates, duties and the car — and you decide. Declining never counts against you."
        aside={
          <Photo name="olderDriver" sizes="(max-width: 960px) 100vw, 560px" priority>
            <div className="hero-overlay hero-overlay-dark">
              <ul className="ticks ticks-amber">
                <li>Full details before you accept</li>
                <li>A named handler on every booking</li>
                <li>Refusing unsafe work is never held against you</li>
              </ul>
            </div>
          </Photo>
        }
      >
        <div className="button-row">
          <Link href="/drivers/apply" className="button button-yellow button-arrow">
            Apply to drive
          </Link>
        </div>
      </PageHeader>

      <Section id="need" title="What you’ll need">
        <div className="grid-4">
          <div className="card card-outline">
            <strong>Valid ID</strong>
            <p>So we can verify your identity.</p>
          </div>
          <div className="card card-outline">
            <strong>Driver’s licence</strong>
            <p>Current and valid.</p>
          </div>
          <div className="card card-outline">
            <strong>A guarantor</strong>
            <p>Someone willing to stand for you.</p>
          </div>
          <div className="card card-outline">
            <strong>Background check</strong>
            <p>With your consent, reviewed by our team. The process is being finalised.</p>
          </div>
        </div>
      </Section>

      <Section id="joining" title="How joining works">
        <ol className="rule-steps">
          {[
            ["Apply online", "A few minutes: your details, experience and city."],
            ["Checks", "We verify your ID, licence and guarantor."],
            ["Set availability", "Tell us when you can’t work."],
            ["Receive offers", "Accept the ones that suit you."],
          ].map(([t, b], i) => (
            <li key={t}>
              <span className="card-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t}</h3>
              <p>{b}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="card card-lg card-split has-pattern">
          <RoadPattern layout="c" />
          <div>
            <h2>Pay</h2>
            <p style={{ marginTop: 12 }}>
              Driver pay rates are being finalised and will be agreed with you before your first
              assignment. Payout timing: {DRIVER_PAYOUT_TIMING ?? "to be confirmed before launch"}.
              You cover your own transport to the pickup point.
            </p>
          </div>
          <Link href="/drivers/apply" className="button button-arrow button-small">
            Start application
          </Link>
        </div>
      </Section>
    </>
  );
}
