import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHeader, Section } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "Trust & safety",
  description:
    "How Flydrive approaches driver checks, privacy of driver details, vehicle handover records and safety concerns.",
  alternates: { canonical: "/trust-and-safety" },
};

export default function TrustPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trust & safety"
        title="What we check, and what we don't claim"
        lead="We would rather tell you exactly what is in place than overpromise."
      />
      <Section title="Driver checks" id="checks">
        <p>Before a driver can be offered to any customer, they must have:</p>
        <ul>
          <li>a verified identity,</li>
          <li>a valid driver&apos;s licence, and</li>
          <li>a guarantor.</li>
        </ul>
        <p>
          Flydrive also intends to carry out background checks. The sources and process are being
          finalised with legal advice, and we will describe them here once they are in place.
        </p>
        <p>
          A driver whose check is pending, expired or unavailable cannot be offered. We don&apos;t
          publish the details of anyone&apos;s check results.
        </p>
      </Section>
      <Section title="Training" tone="tint" id="training">
        <p>
          A Flydrive driving assessment is planned but has not started. During the pilot, every
          driver&apos;s training status shows as <strong>Pending</strong>.
        </p>
      </Section>
      <Section title="Your car" id="vehicle">
        <p>
          You and the driver each record the car&apos;s condition at pickup and return, with notes
          and optional photos. Records are stored privately. If the car or passengers change, we
          review the booking again before it continues.
        </p>
      </Section>
      <Section title="Safety concerns" tone="tint" id="safety">
        <p>
          Every confirmed booking has a named Flydrive contact. Safety concerns are handled
          separately from routine changes and take priority.
        </p>
        <p>
          A driver who refuses unsafe work, or anyone who reports a concern in good faith, will not
          be penalised for it.
        </p>
        <Notice title="What we don't claim" tone="pending">
          <ul>
            <li>We don&apos;t offer 24/7 emergency response.</li>
            <li>We don&apos;t state any insurance cover until a contract is in place.</li>
            <li>We don&apos;t track drivers by GPS during the pilot.</li>
          </ul>
        </Notice>
        <p>
          <Link href="/privacy">How we handle personal data</Link>
        </p>
      </Section>
    </>
  );
}
