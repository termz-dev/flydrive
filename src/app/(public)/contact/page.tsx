import type { Metadata } from "next";
import { getConfig } from "@/platform/config";
import { Notice, PageHeader, Section } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to contact Flydrive about driver bookings or driving with us.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { NEXT_PUBLIC_CONTACT_EMAIL: email, NEXT_PUBLIC_CONTACT_PHONE: phone } = getConfig();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        lead="Questions about booking a driver, or about driving with Flydrive."
      />
      <Section>
        {email || phone ? (
          <ul>
            {email ? (
              <li>
                Email: <a href={`mailto:${email}`}>{email}</a>
              </li>
            ) : null}
            {phone ? (
              <li>
                Phone: <a href={`tel:${phone}`}>{phone}</a>
              </li>
            ) : null}
          </ul>
        ) : (
          <Notice title="Contact details not yet published" tone="pending">
            <p>
              Flydrive&apos;s public contact details will appear here before the pilot opens. There
              is no contact form yet, so nothing can be sent from this page.
            </p>
          </Notice>
        )}
        <p className="muted">
          Please don&apos;t send identity documents, licence photos or payment details by email or
          message. We&apos;ll explain the secure way to share anything we need.
        </p>
      </Section>
    </>
  );
}
