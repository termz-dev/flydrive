import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { fleetVehicles } from "@/db/schema";
import { requireRole } from "@/modules/identity/session";
import { FleetForm } from "@/modules/ops/OpsForms";
import { getDb } from "@/platform/db";

export const metadata: Metadata = { title: "Fleet" };

export default async function OpsFleet() {
  await requireRole("staff", { permission: "bookings.manage" });
  const rows = await getDb().select().from(fleetVehicles).orderBy(asc(fleetVehicles.label));
  return (
    <div className="cols">
      <section className="panel table-wrap">
        <h1 style={{ fontSize: "1.8rem" }}>Fleet for car + driver</h1>
        <p className="muted">
          Cars Flydrive can provide. Supplier terms, deposits and cover are still being finalised
          (ADR 0002).
        </p>
        {rows.length === 0 ? (
          <p className="empty">No cars yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Vehicle</th>
                <th scope="col">Class</th>
                <th scope="col">Transmission</th>
                <th scope="col">City</th>
                <th scope="col">Seats</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.id}>
                  <td>{v.label}</td>
                  <td>{v.vehicleClass}</td>
                  <td>{v.transmission}</td>
                  <td>{v.city}</td>
                  <td>{v.seats ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <div>
        <h2>Add a car</h2>
        <FleetForm />
      </div>
    </div>
  );
}
