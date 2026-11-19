import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Incidents" };

export default function IncidentsPage() {
  return <PortalPage title="Incidents" purpose="Safety and support incidents." />;
}
