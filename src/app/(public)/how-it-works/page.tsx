import type { Metadata } from "next";
import Link from "next/link";
import { bookingsOpen } from "@/platform/config";
import { PageHeader, Section } from "@/ui/blocks";
import { RoadPattern } from "@/ui/RoadPattern";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How booking a Flydrive driver works: request, our checks, choosing your driver, acceptance, payment, confirmation and handover.",
  alternates: { canonical: "/how-it-works" },
};

const STEPS: { title: string; body: string; tone?: "amber" | "green" }[] = [
  {
    title: "Request",
    body: "Choose driver-only or car + driver, a package, your dates, pickup area and duties. For driver-only, add your car; for car + driver, pick a vehicle class.",
  },
  {
    title: "We check",
    body: "We confirm the details and, for car + driver, that a suitable vehicle is free. Inside 3 days’ notice, our team checks availability by hand.",
  },
  {
    title: "Choose your driver",
    body: "See vetted drivers who are free: first name, blurred photo, years of experience and training status.",
  },
  {
    title: "Driver accepts",
    body: "Your driver sees the whole assignment first. If they decline, you choose again at no cost. We never swap drivers without asking.",
  },
  { title: "Pay in full", body: "Every charge and term is shown before you pay.", tone: "amber" },
  {
    title: "Confirmed",
    body: "We verify your payment, confirm the booking and name your handler. You then share the exact meeting point and a phone number.",
    tone: "green",
  },
  {
    title: "Handover",
    body: "At pickup and return, you and the driver each record the car’s condition, with notes. Any disagreement goes to your handler.",
    tone: "green",
  },
];

export default function HowItWorksPage() {
  const open = bookingsOpen();
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="From request to handover, you always know where you stand."
      />
      <Section>
        <div className="timeline-layout">
          <ol className="num-steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className={`n${s.tone ? ` n-${s.tone}` : ""}`} aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h2>{s.title}</h2>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <aside className="aside-stack" aria-labelledby="changes-heading">
            <h2 id="changes-heading">If something changes</h2>
            <div className="card card-outline">
              <strong>Your driver declines</strong>
              <p>Choose another driver. You haven’t paid anything yet.</p>
            </div>
            <div className="card card-outline">
              <strong>Your driver can’t make it after you’ve paid</strong>
              <p>You choose: approve a replacement or take a refund.</p>
            </div>
            <div className="card card-outline">
              <strong>You need to reschedule</strong>
              <p>Terms are shown before payment and in your booking.</p>
            </div>
            <div className="card card-danger">
              <strong>A safety concern</strong>
              <p>
                Use the safety option in your booking. It goes straight to a person, separately from
                ordinary support.
              </p>
            </div>
          </aside>
        </div>
      </Section>
      <Section>
        <div className="cta-band has-pattern">
          <RoadPattern layout="a" tone="dark" />
          <h2>Ready when you are.</h2>
          <div className="button-row">
            <Link
              href={open ? "/bookings/new" : "/contact"}
              className="button button-yellow button-arrow button-small"
            >
              {open ? "Start a booking" : "Talk to us"}
            </Link>
            <Link href="/faq" className="button button-ghost-light button-small">
              Read the FAQ
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
