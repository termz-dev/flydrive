import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICE_PACKAGES, getPackage } from "@/modules/catalog/packages";
import { BookingNotOpen, PageHeader, Section } from "@/ui/blocks";

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

  return (
    <>
      <PageHeader eyebrow="Service package" title={pkg.name} lead={pkg.summary} />
      <Section>
        {pkg.description.map((para) => (
          <p key={para}>{para}</p>
        ))}
        <p>
          Available driver-only for your own car, or as{" "}
          <Link href="/services/car-and-driver">car + driver</Link>.
        </p>
        <h3>Good for</h3>
        <ul className="tag-list">
          {pkg.suitedTo.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Section>
      <Section title="Still being finalised" tone="tint" id="finalising">
        <p>These details will be confirmed and shown to you before you pay:</p>
        <ul>
          {pkg.beingFinalised.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="muted">
          On driver-only bookings, fuel, tolls, parking and washing are paid by the customer.
        </p>
      </Section>
      <Section>
        <BookingNotOpen />
        <p>
          <Link href="/services">← All packages</Link>
        </p>
      </Section>
    </>
  );
}
