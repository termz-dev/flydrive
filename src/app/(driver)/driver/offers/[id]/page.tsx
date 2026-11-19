import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Assignment offer" };

export default function AssignmentofferPage() {
  return (
    <PortalPage
      title="Assignment offer"
      purpose="Review a job in full before accepting or declining."
    />
  );
}
