import type { Metadata } from "next";
import { PortalPage } from "@/ui/PortalShell";

export const metadata: Metadata = { title: "Vehicle handover" };

export default function VehiclehandoverPage() {
  return (
    <PortalPage
      title="Vehicle handover"
      purpose="Confirm your car's condition at pickup and return."
    />
  );
}
