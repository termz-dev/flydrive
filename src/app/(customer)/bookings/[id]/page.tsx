import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Booking" };

export default function BookingPage() {
  return <PortalPage title="Booking" purpose="The status and timeline of one of your bookings." />;
}
