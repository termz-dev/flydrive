import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Driver onboarding" };

export default function DriveronboardingPage() {
  return (
    <PortalPage
      title="Driver onboarding"
      purpose="Your identity, licence and guarantor check status."
    />
  );
}
