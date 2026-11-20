import type { Metadata } from "next";
import type { ReactNode } from "react";
import { sweepIfDue } from "@/modules/booking/jobs";
import { requireRole } from "@/modules/identity/session";
import { getDb } from "@/platform/db";
import { PortalShell } from "@/ui/PortalShell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await requireRole("staff");
  await sweepIfDue(getDb());
  return (
    <PortalShell portal="operations" userName={user.fullName}>
      {children}
    </PortalShell>
  );
}
