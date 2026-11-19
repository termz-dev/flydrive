import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <PortalPage title="Support" purpose="Get help with a booking from your Flydrive contact." />
  );
}
