import type { Metadata } from "next";
import { LocationPage } from "@/ui/LocationPage";

export const metadata: Metadata = {
  title: "Drivers in Ibadan",
  description: "Arrange a vetted professional driver for your own car in Ibadan with Flydrive.",
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
