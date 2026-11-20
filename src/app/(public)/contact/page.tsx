import type { Metadata } from "next";
import Link from "next/link";
import { SUPPORT_HOURS } from "@/content/site";
import { getConfig } from "@/platform/config";
import { HoursIcon, MailIcon, PhoneIcon } from "@/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to contact Flydrive about a booking, a custom quote, car + driver or driving with us.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { NEXT_PUBLIC_CONTACT_EMAIL: email, NEXT_PUBLIC_CONTACT_PHONE: phone } = getConfig();

  return (
    <section className="section section-tint" style={{ paddingTop: 56 }}>
      <div className="container form-layout">
        <div className="form-layout-aside">
          <h1>Talk to us</h1>
          <p className="lead">
            Questions about a booking, a custom quote or car + driver for your trip — we’ll get back
            to you.
          </p>
          <div className="contact-item">
            <PhoneIcon />
            <div>
              <strong>Phone / WhatsApp</strong>
              {phone ? (
                <a href={`tel:${phone}`}>{phone}</a>
              ) : (
                <span>To be published before launch</span>
              )}
            </div>
          </div>
          <div className="contact-item">
            <MailIcon />
            <div>
              <strong>Email</strong>
              {email ? (
                <a href={`mailto:${email}`}>{email}</a>
              ) : (
                <span>To be published before launch</span>
              )}
            </div>
          </div>
          <div className="contact-item">
            <HoursIcon />
            <div>
              <strong>Hours</strong>
              <span>{SUPPORT_HOURS ?? "To be published before launch"}</span>
            </div>
          </div>
          <div className="card card-danger" style={{ padding: 18 }}>
            <p style={{ margin: 0, fontSize: "0.875rem" }}>
              In an active booking with a safety concern? Use the safety option in your booking — it
              reaches a person directly.
            </p>
          </div>
        </div>

        <div className="panel-card">
          <h2>Already booked with us?</h2>
          <p className="muted">
            Sign in and open <strong>Support</strong> to message our team about an existing booking.
            Your message is attached to the booking, so your handler sees the full context.
          </p>
          <div className="button-row" style={{ marginTop: 20 }}>
            <Link href="/sign-in?next=/support" className="button button-arrow button-small">
              Sign in to Support
            </Link>
            <Link href="/faq" className="button button-secondary button-small">
              Read the FAQ
            </Link>
          </div>
          <hr style={{ margin: "32px 0" }} />
          <h3 style={{ fontSize: "1.125rem" }}>Before you write</h3>
          <ul className="ticks" style={{ marginTop: 14 }}>
            <li>Tell us your dates, city and whether you need a car.</li>
            <li>For a custom quote, describe the trip and how many people are travelling.</li>
            <li>
              Please don’t send identity documents, licence photos or payment details by email or
              message. We’ll explain the secure way to share anything we need.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
