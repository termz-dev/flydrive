import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Driver home" };

export default function DriverhomePage() {
  return <PortalPage title="Driver home" purpose="Your offers, assignments and check status." />;
}
