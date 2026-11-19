import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return <PortalPage title="Payments" purpose="Payment evidence awaiting review." />;
}
