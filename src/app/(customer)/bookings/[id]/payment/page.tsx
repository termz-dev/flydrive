import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Booking payment" };

export default function BookingpaymentPage() {
  return (
    <PortalPage
      title="Booking payment"
      purpose="Pay for a booking once your chosen driver has accepted."
    />
  );
}
