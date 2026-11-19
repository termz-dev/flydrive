import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Bookings" };

export default function BookingsPage() {
  return <PortalPage title="Bookings" purpose="Booking requests and their states." />;
}
