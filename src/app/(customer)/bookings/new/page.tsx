import type { Metadata } from "next";
import { RequestForm } from "@/modules/booking/RequestForm";
import { requireRole } from "@/modules/identity/session";
import { toLagosInput } from "@/modules/shared/parse";
import { bookingsOpen } from "@/platform/config";
import { BookingNotOpen } from "@/ui/blocks";

export const metadata: Metadata = { title: "Request a driver" };

export default async function NewBookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireRole("customer");
  const sp = await searchParams;
  return (
    <div style={{ maxWidth: 760 }}>
      <h1>Request a driver</h1>
      <p className="lead">
        Tell us what you need. You&apos;ll choose your driver before anything is charged.
      </p>
      {bookingsOpen() ? (
        <RequestForm
          prefill={{
            pkg: sp.package,
            city: sp.city,
            service: sp.service,
            vehicleClass: sp.class,
            start: sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : undefined,
            area: sp.area?.slice(0, 120),
          }}
          minStart={toLagosInput(new Date())}
        />
      ) : (
        <BookingNotOpen />
      )}
    </div>
  );
}
