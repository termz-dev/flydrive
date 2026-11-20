import type { Metadata } from "next";
import Image from "next/image";
import { TEAM } from "@/content/site";
import { bookingsOpen } from "@/platform/config";
import { PageHeader, Section } from "@/ui/blocks";
import { Photo } from "@/ui/Photo";
import { RoadPattern } from "@/ui/RoadPattern";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Flydrive exists and how we work: checked drivers, choice on both sides and a named person on every booking.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        tone="plain"
        eyebrow="About Flydrive"
        title="Finding a driver you can trust shouldn’t depend on who you know."
      />
      <Section>
        <div className="about-intro">
          <div>
            <p className="lead" style={{ fontSize: "1.0625rem" }}>
              In Lagos and Ibadan, most people find drivers through word of mouth. It works until it
              doesn’t — and when it fails, there’s no one to call.
            </p>
            <p className="lead" style={{ fontSize: "1.0625rem" }}>
              Flydrive screens drivers properly, lets you choose who drives you, and stays
              responsible for the booking from start to finish. If you need a car as well, we
              arrange that too.
            </p>
            {bookingsOpen() ? null : (
              <p className="muted">
                We’re preparing a small pilot in Lagos and Ibadan. Online booking isn’t open yet.
              </p>
            )}
          </div>
          <div className="card card-lg card-dark has-pattern">
            <RoadPattern layout="b" tone="dark" />
            <h2 style={{ color: "var(--fd-amber)" }}>Our promise</h2>
            <p>
              We tell you exactly where your booking stands. We don’t confirm what we haven’t
              checked.
            </p>
          </div>
        </div>
        <Photo name="team" sizes="(max-width: 1400px) 100vw, 1320px" className="photo-wide">
          <span className="tag tag-plain">Built in Lagos, for Lagos and Ibadan</span>
        </Photo>
      </Section>

      <Section id="how" tone="tint" title="How we work">
        <div className="grid-3">
          <div className="card card-white">
            <h3>Checked, not claimed</h3>
            <p>Every status you see is backed by a real check — from driver vetting to payment.</p>
          </div>
          <div className="card card-white">
            <h3>Choice on both sides</h3>
            <p>You choose your driver. Your driver chooses to accept. No silent swaps.</p>
          </div>
          <div className="card card-white">
            <h3>A person, not a queue</h3>
            <p>Every confirmed booking has a named handler at Flydrive.</p>
          </div>
        </div>
      </Section>

      {TEAM.length > 0 ? (
        <Section id="team" title="The team">
          <div className="grid-3">
            {TEAM.map((m) => (
              <figure key={m.name} style={{ margin: 0 }}>
                <div className="photo" style={{ aspectRatio: "1", borderRadius: 22 }}>
                  <Image src={m.photo} alt={m.name} fill sizes="400px" />
                </div>
                <figcaption style={{ marginTop: 14 }}>
                  <strong>{m.name}</strong>
                  <br />
                  <span className="small muted">{m.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
