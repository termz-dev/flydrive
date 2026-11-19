import type { Metadata } from "next";
import { PageHeader, PendingLegal, Section } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Flydrive's privacy notice. Awaiting legal approval.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy notice" />
      <Section>
        <PendingLegal document="Privacy notice" />
        <p>
          This website doesn&apos;t currently collect personal information through forms, and it
          doesn&apos;t use advertising or tracking cookies.
        </p>
      </Section>
    </>
  );
}
