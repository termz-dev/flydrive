import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Operations" };

export default function OperationsPage() {
  return <PortalPage title="Operations" purpose="Queues and work in progress." />;
}
