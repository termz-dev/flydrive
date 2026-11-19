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
      city="Lagos"
      notes={[
        "Lagos traffic, long commutes and busy event calendars are exactly why many car owners prefer not to drive themselves.",
        "Flydrive is built for daily errands, work days, weddings and weekends, and longer arrangements for households and professionals.",
      ]}
    />
  );
}
