import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PortalShell } from "@/ui/PortalShell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Layout({ children }: { children: ReactNode }) {
  return <PortalShell portal="operations">{children}</PortalShell>;
}
