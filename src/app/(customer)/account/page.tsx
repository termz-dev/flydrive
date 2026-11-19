import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Your account" };

export default function YouraccountPage() {
  return (
    <PortalPage title="Your account" purpose="Your profile, your vehicles and your bookings." />
  );
}
