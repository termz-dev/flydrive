import Link from "next/link";
import { BookingNotOpen, PageHeader, Section } from "./blocks";

export function LocationPage({ city, notes }: { city: "Lagos" | "Ibadan"; notes: string[] }) {
  const other = city === "Lagos" ? "Ibadan" : "Lagos";
  return (
    <>
      <PageHeader
        eyebrow="Location"
        title={`Drivers for your car in ${city}`}
        lead={`${city} is one of Flydrive's two pilot cities. You provide the car; we arrange a vetted driver for the time you need.`}
      />
      <Section>
        {notes.map((n) => (
          <p key={n}>{n}</p>
        ))}
        <h3>Coverage</h3>
        <p>
          The exact service area within {city} is being confirmed with our operations team and will
          be checked when you request. We will tell you honestly if we can&apos;t cover your
          location.
        </p>
        <h3>
          Trips between {city} and {other}
        </h3>
        <p>
          Interstate trips are possible as custom requests. If the driver stays overnight out of
          state, you provide somewhere to sleep and freshen up; meals are not required.
        </p>
      </Section>
      <Section tone="tint">
        <BookingNotOpen />
        <p>
          <Link href="/services">See services</Link> ·{" "}
          <Link
            href={`/locations/${other.toLowerCase()}` as "/locations/lagos" | "/locations/ibadan"}
          >
            {other}
          </Link>
        </p>
      </Section>
    </>
  );
}
