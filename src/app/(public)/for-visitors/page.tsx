import type { Metadata } from "next";
import Link from "next/link";
import { BookingNotOpen, CardGrid, LinkCard, PageHeader, Section } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "For visitors",
  description:
    "Visiting Lagos or Ibadan? Book car + driver for your whole stay, or a vetted driver for a car you already have access to.",
  alternates: { canonical: "/for-visitors" },
};

export default function VisitorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="For visitors"
        title="Visiting Lagos or Ibadan?"
        lead="Business trips, weddings, family visits: we can arrange a car and a vetted driver together, or just a driver for a car you already have access to."
        tone="amber"
      />
      <Section>
        <h2>Two ways to get around</h2>
        <CardGrid>
          <LinkCard href="/services/car-and-driver" title="Car + driver">
            No car? We arrange a suitable vehicle and a vetted driver, matched to your dates and
            group size.
          </LinkCard>
          <LinkCard href="/services" title="Driver for a car you have">
            If family or friends are lending you a car, we arrange a vetted driver for it — with the
            owner&apos;s agreement.
          </LinkCard>
        </CardGrid>
        <h3>What to have ready</h3>
        <ul>
          <li>Your dates, pickup point and what you&apos;ll need the driver for.</li>
          <li>For car + driver: how many passengers and how much luggage.</li>
          <li>For a borrowed car: the owner&apos;s agreement.</li>
          <li>At least three days&apos; notice before your first day.</li>
        </ul>
        <h3>Good for</h3>
        <ul>
          <li>Family visits and occasions during the festive season.</li>
          <li>Business trips with several meetings.</li>
          <li>Travelling between Lagos and Ibadan (as a custom request).</li>
        </ul>
      </Section>
      <Section tone="tint">
        <BookingNotOpen />
        <p>
          <Link href="/services">See driver packages</Link> ·{" "}
          <Link href="/how-it-works">How it works</Link>
        </p>
      </Section>
    </>
  );
}
