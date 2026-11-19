import type { Metadata } from "next";
import Link from "next/link";
import { BookingNotOpen, PageHeader, Section, Steps } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How a Flydrive booking works: request, choose a driver, driver accepts, pay, operations confirms, and separate pickup and return checks.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="From request to handover, step by step"
        lead="Each step is separate on purpose. Choosing a driver isn't a booking, and paying isn't a confirmation until our team has checked it."
      />
      <Section>
        <Steps
          variant="stacked"
          items={[
            {
              title: "Request a driver",
              body: (
                <p>
                  Tell us the package, dates and times, pickup point, what the driver will be doing,
                  who will travel, and any accommodation for overnight trips. Tell us about your car
                  and its transmission — or, for car + driver, the vehicle class you need. Bookings
                  need three days&apos; notice.
                </p>
              ),
            },
            {
              title: "Choose from suitable drivers",
              body: (
                <p>
                  We show drivers who meet the request and are free at that time. Before payment you
                  see their first name, a blurred photo, years of experience and training status.
                  Choosing a driver does not book them yet.
                </p>
              ),
            },
            {
              title: "The driver accepts or declines",
              body: (
                <p>
                  Your chosen driver sees the full job and decides. If they decline, you go back to
                  the other options. Nothing has been charged, and we never swap in a driver you
                  didn&apos;t choose.
                </p>
              ),
            },
            {
              title: "Pay in full",
              body: (
                <p>
                  Payment is taken only after the driver has accepted. A payment that is pending or
                  unclear is not treated as paid.
                </p>
              ),
            },
            {
              title: "Operations confirms",
              body: (
                <p>
                  Our team checks the payment record and confirms the booking. You then see more of
                  the driver&apos;s profile, get a named Flydrive contact, and share the meeting
                  point and a phone number the driver can call.
                </p>
              ),
            },
            {
              title: "Pickup and return checks",
              body: (
                <p>
                  At pickup and return, you and the driver each confirm the car&apos;s condition,
                  with notes and optional photos. If you disagree, your Flydrive contact steps in.
                </p>
              ),
            },
          ]}
        />
      </Section>
      <Section title="Short-notice requests" tone="tint" id="short-notice">
        <p>
          Requests for less than three days ahead go to our operations team, who check whether a
          suitable driver is really available. They are never confirmed automatically.
        </p>
      </Section>
      <Section title="If something changes" id="changes">
        <p>
          If a paid, confirmed driver becomes unavailable, you choose what happens: accept a
          suitable replacement driver, or ask for a refund. We will not substitute a driver without
          your agreement.
        </p>
        <p>
          Rescheduling, cancellation and refund terms are being finalised and will be shown before
          you pay.
        </p>
        <BookingNotOpen />
        <p>
          <Link href="/faq">Read the FAQ</Link>
        </p>
      </Section>
    </>
  );
}
