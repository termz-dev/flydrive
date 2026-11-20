import type { Metadata } from "next";
import { LocationPage } from "@/ui/LocationPage";

export const metadata: Metadata = {
  title: "Drivers in Lagos",
  description:
    "Book a vetted professional driver in Lagos with Flydrive — for your own car, or car + driver.",
  alternates: { canonical: "/locations/lagos" },
};

export default function LagosPage() {
  return (
    <LocationPage
      city="lagos"
      lead="Vetted drivers who know the Island, the Mainland and the traffic in between — in your car or with one we arrange."
      uses={[
        {
          title: "Business days",
          body: "Back-to-back meetings without parking stress. Full-day or weekly.",
        },
        {
          title: "Events & owambe",
          body: "Arrive and leave relaxed. Weekend or full-day, car + driver if you need one.",
        },
        {
          title: "Family routines",
          body: "School runs and errands with a consistent driver, weekly or monthly.",
        },
        { title: "Visiting", body: "In town for a few days? Book a car and driver for your stay." },
      ]}
    />
  );
}
