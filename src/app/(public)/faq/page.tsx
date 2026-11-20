import type { Metadata } from "next";
import Link from "next/link";
import { CAR_AND_DRIVER_TERMS } from "@/content/site";
import { PageHeader, Section } from "@/ui/blocks";
import { FaqBrowser, type FaqTopic } from "@/ui/FaqBrowser";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Flydrive: booking, car + driver, payments and safety.",
  alternates: { canonical: "/faq" },
};

const TOPICS: readonly FaqTopic[] = [
  {
    key: "booking",
    label: "Booking",
    items: [
      {
        q: "How much notice do you need?",
        a: "Standard notice is 3 days. If you need someone sooner, submit anyway — our team checks availability by hand and lets you know. Short-notice requests are never confirmed automatically.",
      },
      {
        q: "Is this like ride hailing?",
        a: "No. You book a driver for a period — half-day, day, week or longer — and they work your schedule rather than a single trip.",
      },
      {
        q: "Can I choose my driver?",
        a: "Yes. You see suitable drivers who are free for your dates and pick one. They then see the full assignment and accept or decline.",
      },
      {
        q: "What can I see about a driver before paying?",
        a: "Their first name, a blurred photo, years of experience and training status (currently Pending for all drivers). More is shared once your booking is confirmed.",
      },
      {
        q: "Can I ask for a female driver?",
        a: "You can request one, and we'll try to match it. We can't guarantee it, and we'll tell you if no suitable driver is available.",
      },
      {
        q: "When is my booking confirmed?",
        a: "After your driver accepts, you pay in full, and our team verifies the payment. We tell you as soon as it is confirmed.",
      },
    ],
  },
  {
    key: "car",
    label: "Car + driver",
    items: [
      {
        q: "Can you provide the car as well?",
        a: "Yes. Choose car + driver and pick a vehicle class — saloon, SUV or minivan. We match a suitable car and confirm it with your booking.",
      },
      {
        q: "Can I pick the exact model?",
        a: "You choose the class. The specific car is confirmed with your booking.",
      },
      {
        q: "Who pays for fuel and tolls?",
        a: `On driver-only bookings, you do — fuel, tolls, parking and washing. For car + driver: ${CAR_AND_DRIVER_TERMS.fuel ?? "the policy is being finalised and will be shown clearly before you pay"}.`,
      },
      {
        q: "Is there a deposit?",
        a: `For car + driver: ${CAR_AND_DRIVER_TERMS.deposit ?? "the deposit policy is being finalised and will be shown clearly before you pay"}.`,
      },
    ],
  },
  {
    key: "pay",
    label: "Payments",
    items: [
      {
        q: "When do I pay?",
        a: "Only after your chosen driver has accepted. You pay the full amount, with every charge shown first.",
      },
      {
        q: "What does it cost?",
        a: "Prices for each package are being finalised and will be shown before you pay.",
      },
      {
        q: "What if my driver can't make it after I've paid?",
        a: "You choose: approve a replacement driver, or take a refund. We won't send a different driver without your agreement.",
      },
      {
        q: "Can I reschedule?",
        a: "Reschedule and cancellation terms are shown before payment and in your booking.",
      },
    ],
  },
  {
    key: "safety",
    label: "Safety",
    items: [
      {
        q: "How are drivers checked?",
        a: "Identity, driver's licence and a guarantor, reviewed by our team. Our background check process is being finalised.",
      },
      {
        q: "What if I have a safety concern during a booking?",
        a: "Use the safety option in your booking. It goes straight to a person, separately from ordinary support.",
      },
      {
        q: "Are bookings insured?",
        a: "We won't make any insurance claims until cover is in place under a signed contract. We'll update this answer when that changes.",
      },
      {
        q: "Is support available 24/7?",
        a: "No. Each confirmed booking has a named Flydrive contact; support hours will be published before the pilot opens.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader title="Questions, answered">
        <p className="lead">
          Can’t find what you need? <Link href="/contact">Contact us</Link>.
        </p>
      </PageHeader>
      <Section>
        <FaqBrowser topics={TOPICS} />
      </Section>
    </>
  );
}
