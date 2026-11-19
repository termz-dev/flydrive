import type { Metadata } from "next";
import Link from "next/link";
import { SERVICE_PACKAGES } from "@/modules/catalog/packages";
import { Banner, BookingNotOpen, CardGrid, LinkCard, PageHeader, Section } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Flydrive packages: half-day, full-day, weekly, monthly or longer, weekend and custom — driver-only for your own car, or car + driver, in Lagos and Ibadan.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Driver packages for your own car"
        lead="Booked by duration, not by trip. Every package is available driver-only, for your own car, or as car + driver."
      />
      <Section wide>
        <CardGrid>
          {SERVICE_PACKAGES.map((p) => (
            <LinkCard
              key={p.slug}
              href={`/services/${p.slug}`}
              title={p.name}
              dashed={p.slug === "custom"}
            >
              {p.summary}
            </LinkCard>
          ))}
        </CardGrid>
        <div style={{ marginTop: 24 }}>
          <Banner
            tone="cream"
            title="No car? Add one."
            body="Any package can be booked as car + driver: we arrange a suitable vehicle and a vetted driver together."
            action={{ href: "/services/car-and-driver", label: "How car + driver works" }}
          />
        </div>
      </Section>
      <Section title="What every package includes" tone="tint" id="included">
        <ul>
          <li>A driver who has passed Flydrive&apos;s required checks.</li>
          <li>Your choice of driver from suitable candidates, where more than one is available.</li>
          <li>The driver sees the full job before accepting — no surprises on either side.</li>
          <li>A named Flydrive contact once your booking is confirmed.</li>
          <li>Separate pickup and return condition checks for the car.</li>
        </ul>
        <h3>Costs you cover on driver-only bookings</h3>
        <p>
          Fuel, tolls, parking and car washing are paid by you. The driver covers their own
          transport to and from the assignment. If an overnight trip takes the driver out of state,
          you provide somewhere to sleep and freshen up; meals are not required.
        </p>
        <p>
          For car + driver bookings, the fuel, toll, parking and deposit policy is being finalised
          and will be shown before you pay.
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
