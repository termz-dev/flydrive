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
      city="Ibadan"
      notes={[
        "Whether you live in Ibadan or are visiting family there, Flydrive arranges a vetted driver for your car for the time you need.",
        "It suits routine driving, occasions and visits, as well as trips to and from Lagos.",
      ]}
    />
  );
}
