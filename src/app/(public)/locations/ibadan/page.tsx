import type { Metadata } from "next";
import { LocationPage } from "@/ui/LocationPage";

export const metadata: Metadata = {
  title: "Drivers in Ibadan",
  description:
    "Book a vetted professional driver in Ibadan with Flydrive — for your own car, or car + driver.",
  alternates: { canonical: "/locations/ibadan" },
};

export default function IbadanPage() {
  return (
    <LocationPage
      city="ibadan"
      lead="Vetted drivers across the city and for trips on to Lagos and beyond — in your car or with one we arrange."
      uses={[
        {
          title: "Business days",
          body: "Meetings, site visits and government offices. Full-day or weekly.",
        },
        {
          title: "Events & owambe",
          body: "Arrive and leave relaxed. Weekend or full-day, car + driver if you need one.",
        },
        {
          title: "Family routines",
          body: "School runs and errands with a consistent driver, weekly or monthly.",
        },
        {
          title: "Lagos – Ibadan trips",
          body: "Same-day or overnight runs between the two cities, quoted as a custom request.",
        },
      ]}
    />
  );
}
