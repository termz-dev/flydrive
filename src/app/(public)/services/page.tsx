import type { Metadata } from "next";
import Link from "next/link";
import { SERVICE_PACKAGES } from "@/modules/catalog/packages";
import { BookingNotOpen, CardGrid, LinkCard, PageHeader, Section } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Flydrive driver packages: half-day, full-day, weekly, monthly or longer, weekend, and custom requests — for your own car in Lagos and Ibadan.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Driver packages for your own car"
        lead="Every package puts a vetted driver behind the wheel of your vehicle for an agreed period. Pick the length of time that fits."
      />
      <Section>
        <CardGrid>
          {SERVICE_PACKAGES.map((p) => (
            <LinkCard key={p.slug} href={`/services/${p.slug}`} title={p.name}>
              {p.summary}
            </LinkCard>
          ))}
        </CardGrid>
      </Section>
      <Section title="What every package includes" tone="tint" id="included">
        <ul>
          <li>A driver who has passed Flydrive&apos;s required checks.</li>
          <li>Your choice of driver from suitable candidates, where more than one is available.</li>
          <li>The driver sees the full job before accepting — no surprises on either side.</li>
          <li>A named Flydrive contact once your booking is confirmed.</li>
          <li>Separate pickup and return condition checks for your car.</li>
        </ul>
        <h3>Costs you cover during the booking</h3>
        <p>
          Fuel, tolls, parking and car washing are paid by you. The driver covers their own
          transport to and from the assignment. If an overnight trip takes the driver out of state,
          you provide somewhere to sleep and freshen up; meals are not required.
        </p>
      </Section>
      <Section title="Pricing and hours" id="pricing">
        <p>
          Exact hours and prices for each package are being finalised and will be shown before you
          pay. We don&apos;t publish estimates we can&apos;t stand behind.
        </p>
        <p>
          Bookings need <strong>three days&apos; notice</strong>. Shorter-notice requests are passed
          to our operations team to check availability; they are never confirmed automatically.
        </p>
        <BookingNotOpen />
        <p>
          <Link href="/how-it-works">How booking works</Link>
        </p>
      </Section>
    </>
  );
}
