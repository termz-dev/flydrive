import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICE_PACKAGES, getPackage } from "@/modules/catalog/packages";
import { bookingsOpen } from "@/platform/config";
import { PageHeader, Section } from "@/ui/blocks";

type Params = { package: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return SERVICE_PACKAGES.map((p) => ({ package: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const pkg = getPackage((await params).package);
  if (!pkg) return { title: "Package not found" };
  return {
    title: `${pkg.name} driver`,
    description: `${pkg.summary} Flydrive, Lagos and Ibadan.`,
    alternates: { canonical: `/services/${pkg.slug}` },
  };
}

export default async function PackagePage({ params }: { params: Promise<Params> }) {
  const pkg = getPackage((await params).package);
  if (!pkg) notFound();
  const open = bookingsOpen();

  return (
    <>
      <PageHeader
        back={{ href: "/services", label: "All packages" }}
        eyebrow={pkg.short}
        title={pkg.name}
        lead={pkg.summary}
      >
        <div className="button-row">
          <Link
            href={open ? `/bookings/new?package=${pkg.slug}` : "/contact"}
            className="button button-arrow"
          >
            {open ? `Request ${pkg.name.toLowerCase()}` : "Talk to us"}
          </Link>
          <Link href="/services/car-and-driver" className="button button-secondary">
            Car + driver
          </Link>
        </div>
      </PageHeader>
      <Section>
        <div className="about-intro">
          <div className="stack">
            {pkg.description.map((para) => (
              <p key={para} className="lead" style={{ fontSize: "1.0625rem" }}>
                {para}
              </p>
            ))}
            <p className="muted">
              Available as a driver for your own car, or as{" "}
              <Link href="/services/car-and-driver">car + driver</Link>.
            </p>
          </div>
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="card">
              <strong>Good for</strong>
              <ul className="ticks" style={{ marginTop: 14 }}>
                {pkg.suitedTo.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="card card-amber">
              <strong>Being finalised</strong>
              <p>Confirmed and shown before you pay:</p>
              <ul className="ticks ticks-amber" style={{ marginTop: 10 }}>
                {pkg.beingFinalised.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
