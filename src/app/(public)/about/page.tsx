import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "About",
  description:
    "Flydrive arranges trusted, vetted professional drivers in Lagos and Ibadan — for your own car, or with a car we arrange.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Flydrive"
        title="Trusted drivers, arranged properly"
        lead="Finding a driver you can trust with your car, your family and your time usually depends on who you know. Flydrive is trying to make it depend on checks, clear terms and accountable support instead."
      />
      <Section title="What we do" id="what">
        <p>
          Flydrive coordinates the parts that are hard to do alone: screening drivers, matching a
          suitable driver to your request, arranging a car when you need one, making sure the driver
          agrees to the full job, taking payment, confirming the booking, and recording the handover
          of your car.
        </p>
      </Section>
      <Section title="How we work" tone="tint" id="principles">
        <ul>
          <li>
            <strong>Your choice, their agreement.</strong> You pick the driver; the driver accepts
            the job. Neither is assumed.
          </li>
          <li>
            <strong>Confirmed means confirmed.</strong> A booking is confirmed only after payment is
            checked by our team.
          </li>
          <li>
            <strong>No silent swaps.</strong> If plans change, you decide between a replacement and
            a refund.
          </li>
          <li>
            <strong>Honest about what&apos;s ready.</strong> We don&apos;t advertise prices,
            insurance or support hours until they&apos;re in place.
          </li>
        </ul>
      </Section>
      <Section title="Where we are now" id="now">
        <p>
          Flydrive is preparing a small pilot in Lagos and Ibadan. Online booking is not open yet.
        </p>
        <p>
          <Link href="/contact">Get in touch</Link>
        </p>
      </Section>
    </>
  );
}
