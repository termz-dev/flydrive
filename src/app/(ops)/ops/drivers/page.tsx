import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Drivers" };

export default function DriversPage() {
  return <PortalPage title="Drivers" purpose="Driver records and check reviews." />;
}
