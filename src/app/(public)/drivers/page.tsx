import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section, Steps } from "@/ui/blocks";

export const metadata: Metadata = {
  title: "Drive with Flydrive",
  description:
    "Professional drivers in Lagos and Ibadan: how Flydrive assignments work, what checks are required, and how to apply.",
  alternates: { canonical: "/drivers" },
};

export default function DriversPage() {
  return (
    <>
      <PageHeader
        eyebrow="For drivers"
        title="Drive with Flydrive"
        lead="Flydrive matches professional drivers with car owners who need a driver for a set period — from a half-day to a month or more."
      >
        <div className="button-row">
          <Link className="button" href="/drivers/apply">
            How to apply
          </Link>
        </div>
      </PageHeader>
      <Section title="How assignments work" id="assignments">
        <Steps
          items={[
            {
              title: "A customer chooses you",
              body: <p>Customers see a short profile of suitable drivers and pick one.</p>,
            },
            {
              title: "You see the full job first",
              body: (
                <p>
                  Dates, duties, pickup, the car, passengers, schedule and any accommodation are
                  shown before you decide. You can accept or decline.
                </p>
              ),
            },
            {
              title: "The booking is confirmed",
              body: (
                <p>
                  After the customer pays and our team checks the payment, the booking is confirmed
                  and you have a named Flydrive contact.
                </p>
              ),
            },
          ]}
        />
      </Section>
      <Section title="What you'll need" tone="tint" id="requirements">
        <ul>
          <li>Proof of identity</li>
          <li>A valid driver&apos;s licence</li>
          <li>A guarantor</li>
        </ul>
        <p>
          Flydrive also intends to carry out background checks; the details will be explained to you
          before anything is collected.
        </p>
        <h3>Good to know</h3>
        <ul>
          <li>You pay your own transport to and from an assignment.</li>
          <li>The customer pays fuel, tolls, parking and washing.</li>
          <li>
            For overnight out-of-state trips, the customer provides somewhere to sleep and freshen
            up.
          </li>
          <li>
            Refusing unsafe work, or reporting a concern in good faith, is never held against you.
          </li>
          <li>
            Pay rates and payment timing are being finalised and will be shared before you start.
          </li>
        </ul>
      </Section>
    </>
  );
}
