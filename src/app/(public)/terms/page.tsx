import type { Metadata } from "next";
import { PageHeader, PendingLegal, Section } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "Terms",
  description: "Flydrive's customer and driver terms. Awaiting legal approval.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of service" />
      <Section>
        <PendingLegal document="Terms of service" />
        <p>
          Booking, payment, rescheduling, cancellation and refund terms will be shown here and
          before any payment is taken.
        </p>
      </Section>
    </>
  );
}
