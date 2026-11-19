import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Driver detail" };

export default function DriverdetailPage() {
  return (
    <PortalPage title="Driver detail" purpose="One driver's checks, availability and history." />
  );
}
