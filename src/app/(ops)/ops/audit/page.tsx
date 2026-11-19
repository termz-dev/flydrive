import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Audit log" };

export default function AuditlogPage() {
  return <PortalPage title="Audit log" purpose="Record of staff actions." />;
}
