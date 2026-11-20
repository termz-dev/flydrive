import type { Metadata } from "next";
import Link from "next/link";
import { ApplyForm } from "@/modules/drivers/DriverForms";
import { bookingsOpen, getConfig } from "@/platform/config";
import { Notice } from "@/ui/blocks";
import { ArrowLeft } from "@/ui/icons";

export const metadata: Metadata = {
  title: "Apply to drive",
  description: "Apply to become a Flydrive driver in Lagos or Ibadan.",
  alternates: { canonical: "/drivers/apply" },
};

export default function DriverApplyPage() {
  const { NEXT_PUBLIC_CONTACT_EMAIL: email, NEXT_PUBLIC_CONTACT_PHONE: phone } = getConfig();
  const open = bookingsOpen();

  return (
    <section className="section section-tint" style={{ paddingTop: 56 }}>
      <div className="container form-layout">
        <div className="form-layout-aside">
          <Link href="/drivers" className="back-crumb" style={{ marginBottom: 0 }}>
            <ArrowLeft />
            Drive with Flydrive
          </Link>
          <h1>Apply to drive</h1>
          <p className="lead">
            Tell us about yourself and create your driver account. We’ll contact you about next
            steps — ID, licence and guarantor checks come later.
          </p>
          <div className="contact-item">
            <span className="small muted">
              We only use these details to assess your application. See our{" "}
              <Link href="/privacy">privacy notice</Link>.
            </span>
          </div>
          {open ? (
            <p className="small muted">
              Already applied? <Link href="/sign-in">Sign in</Link>
            </p>
          ) : null}
        </div>
        <div>
          {open ? (
            <ApplyForm />
          ) : (
            <div className="panel-card">
              <Notice title="Online applications aren't open yet" tone="pending">
                <p>
                  The application form opens with our pilot, so nothing can be submitted on this
                  page yet.{" "}
                  {email || phone
                    ? "In the meantime, you can register your interest:"
                    : "Contact details for driver enquiries will be published here soon."}
                </p>
              </Notice>
              {email || phone ? (
                <ul className="ticks">
                  {email ? (
                    <li>
                      <a href={`mailto:${email}?subject=Driver%20application`}>{email}</a>
                    </li>
                  ) : null}
                  {phone ? (
                    <li>
                      <a href={`tel:${phone}`}>{phone}</a>
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
