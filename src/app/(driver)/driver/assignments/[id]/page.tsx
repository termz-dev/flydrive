import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Assignment" };

export default function AssignmentPage() {
  return (
    <PortalPage
      title="Assignment"
      purpose="Details, contact and handover for a confirmed assignment."
    />
  );
}
