import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Availability" };

export default function AvailabilityPage() {
  return <PortalPage title="Availability" purpose="Tell us when you are available to drive." />;
}
