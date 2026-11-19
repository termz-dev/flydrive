import type { Metadata } from "next";
import Link from "next/link";
import { getConfig } from "@/platform/config";
import { Notice, PageHeader, Section } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "Apply to drive",
  description: "How to apply to become a Flydrive driver in Lagos or Ibadan.",
  alternates: { canonical: "/drivers/apply" },
};

export default function DriverApplyPage() {
  const { NEXT_PUBLIC_CONTACT_EMAIL: email, NEXT_PUBLIC_CONTACT_PHONE: phone } = getConfig();
  const hasContact = Boolean(email || phone);

  return (
    <>
      <PageHeader
        eyebrow="For drivers"
        title="Apply to drive"
        lead="We're building our first group of drivers for the Lagos and Ibadan pilot."
      />
      <Section>
        <Notice title="Online applications aren't open yet" tone="pending">
          <p>
            The online application form is not available yet, so nothing can be submitted on this
            page.{" "}
            {hasContact
              ? "In the meantime, you can register your interest using the contact details below."
              : "Contact details for driver enquiries will be published here soon."}
          </p>
        </Notice>
        {hasContact ? (
          <ul>
            {email ? (
              <li>
                Email: <a href={`mailto:${email}?subject=Driver%20application`}>{email}</a>
              </li>
            ) : null}
            {phone ? (
              <li>
                Phone: <a href={`tel:${phone}`}>{phone}</a>
              </li>
            ) : null}
          </ul>
        ) : null}
        <h3>What we&apos;ll ask for</h3>
        <p>
          When applications open, we&apos;ll ask about your driving experience and the cars you can
          drive (manual, automatic or both), then guide you through identity, licence and guarantor
          checks. We&apos;ll explain how your information is used before collecting it.
        </p>
        <p>
          <Link href="/drivers">← About driving with Flydrive</Link>
        </p>
      </Section>
    </>
  );
}
