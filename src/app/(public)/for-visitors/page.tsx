import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHeader, Section } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "For visitors",
  description:
    "Visiting Lagos or Ibadan? Flydrive's pilot provides a vetted driver for a car you already have access to. We don't supply cars yet.",
  alternates: { canonical: "/for-visitors" },
};

export default function VisitorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="For visitors"
        title="Visiting Lagos or Ibadan?"
        lead="If you will have access to a car — your family's, a friend's or one you've arranged — Flydrive can arrange a vetted driver for it."
      />
      <Section>
        <Notice title="We don't provide cars during the pilot" tone="pending">
          <p>
            Flydrive&apos;s pilot is for customer-provided vehicles only. We cannot supply a car,
            and we can&apos;t promise a car-and-driver option at this stage.
          </p>
        </Notice>
        <h3>What you&apos;ll need</h3>
        <ul>
          <li>Access to a car you are authorised to use, and the owner&apos;s agreement.</li>
          <li>Your dates, pickup point and what you&apos;ll need the driver for.</li>
          <li>At least three days&apos; notice before your first day.</li>
        </ul>
        <h3>Good for</h3>
        <ul>
          <li>Family visits and occasions during the festive season.</li>
          <li>Business trips with several meetings.</li>
          <li>Travelling between Lagos and Ibadan (as a custom request).</li>
        </ul>
      </Section>
      <Section tone="tint">
        <p>
          <Link href="/services">See driver packages</Link> ·{" "}
          <Link href="/how-it-works">How it works</Link>
        </p>
      </Section>
    </>
  );
}
