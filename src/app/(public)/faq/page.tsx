import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageHeader, Section } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Flydrive: car + driver, notice period, choosing a driver, payment, costs during the booking and safety.",
  alternates: { canonical: "/faq" },
};

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "Do you provide the car?",
    a: "You choose. Book a driver for a car you own or are authorised to use, or book car + driver and we arrange a suitable vehicle too.",
  },
  {
    q: "What cars are available for car + driver?",
    a: "You choose a class — saloon, SUV or minivan — and we match a suitable car. The exact make and model is confirmed with your booking.",
  },
  {
    q: "Is this like ride-hailing?",
    a: "No. You book a driver for a period of time — a half-day, a day, a week or longer — in your own car or one we arrange.",
  },
  {
    q: "How much notice do you need?",
    a: "Three days. Requests with less notice are checked by our operations team for availability and are never confirmed automatically.",
  },
  {
    q: "Can I choose my driver?",
    a: "Yes. We show suitable drivers and you choose. The driver then sees the full job and accepts or declines.",
  },
  {
    q: "What can I see about a driver before paying?",
    a: "Their first name, a blurred photo, years of experience and training status (currently Pending for all drivers). More details are shared after your booking is confirmed.",
  },
  {
    q: "When do I pay?",
    a: "In full, after your chosen driver has accepted the job. Your booking is confirmed once our team has checked the payment.",
  },
  {
    q: "What does it cost?",
    a: "Prices for each package are being finalised and will be shown before you pay.",
  },
  {
    q: "Who pays for fuel and tolls?",
    a: "On driver-only bookings, you do — fuel, tolls, parking and washing. The driver pays their own transport to and from the job. For car + driver, the fuel, toll and deposit policy is being finalised and will be shown before you pay.",
  },
  {
    q: "What if my driver can't make it after I've paid?",
    a: "You choose between a suitable replacement driver and a refund. We won't send a different driver without your agreement.",
  },
  {
    q: "Can I ask for a female driver?",
    a: "You can request one, and we'll try to match it. We can't guarantee it, and we'll tell you if no suitable driver is available.",
  },
  {
    q: "Are bookings insured?",
    a: "We won't make any insurance claims until cover is in place under a signed contract. We'll update this answer when that changes.",
  },
  {
    q: "Is support available 24/7?",
    a: "No. Each confirmed booking has a named Flydrive contact; support hours will be published before the pilot opens.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader eyebrow="FAQ" title="Frequently asked questions" />
      <Section>
        <dl className="faq">
          {FAQS.map((f) => (
            <div key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
        <p style={{ marginTop: "2rem" }}>
          Still have a question? <Link href="/contact">Contact us</Link>.
        </p>
      </Section>
    </>
  );
}
