import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Booking detail" };

export default function BookingdetailPage() {
  return (
    <PortalPage title="Booking detail" purpose="One booking's timeline, candidates and actions." />
  );
}
