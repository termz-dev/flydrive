import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Request a driver" };

export default function RequestadriverPage() {
  return <PortalPage title="Request a driver" purpose="Request a driver for your own car." />;
}
