import type { Metadata } from "next";
import { LegalPage } from "@/ui/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "Flydrive's terms of service. Awaiting legal approval.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      sections={[
        {
          id: "about",
          heading: "About these terms",
          covers: "Who the terms are between and when they apply.",
        },
        {
          id: "service",
          heading: "The service",
          covers:
            "What Flydrive arranges for driver-only and car + driver bookings, and what it does not.",
        },
        {
          id: "booking",
          heading: "Requests, acceptance and confirmation",
          covers:
            "How a request becomes a confirmed booking, including driver acceptance and payment verification.",
        },
        {
          id: "payment",
          heading: "Prices and payment",
          covers: "What is included in a price, when you pay, and what you pay for separately.",
        },
        {
          id: "changes",
          heading: "Changes, cancellations and refunds",
          covers:
            "Rescheduling, cancellation and refund terms for customers and what happens if a driver can't attend.",
        },
        {
          id: "vehicle",
          heading: "Vehicles and handover",
          covers:
            "Your vehicle's condition, authorisation, handover records and, for car + driver, the vehicle we arrange.",
        },
        {
          id: "safety",
          heading: "Safety and conduct",
          covers: "What we expect from customers and drivers, and how concerns are handled.",
        },
        {
          id: "liability",
          heading: "Liability",
          covers: "Responsibility for loss or damage, and the limits that apply.",
        },
      ]}
    />
  );
}
