"use client";

import Link from "next/link";
import { useState } from "react";
import { SERVICE_PACKAGES } from "@/modules/catalog/packages";
import { VEHICLE_CLASSES } from "@/content/site";

/**
 * Home hero booking widget. A plain GET form: it pre-fills /bookings/new (sign-in first if needed),
 * so nothing is created or charged from here.
 */
export function BookingWidget({ open }: { open: boolean }) {
  const [service, setService] = useState<"own" | "car">("own");
  const own = service === "own";

  return (
    <div className="widget">
      <div className="seg" role="group" aria-label="Service">
        <button type="button" aria-pressed={own} onClick={() => setService("own")}>
          Driver for my car
        </button>
        <button type="button" aria-pressed={!own} onClick={() => setService("car")}>
          Car + driver
        </button>
      </div>
      {open ? (
        <form className="widget-body" action="/bookings/new" method="get">
          <input type="hidden" name="service" value={service} />
          <div className="widget-row">
            <label className="wfield">
              City
              <select name="city" defaultValue="lagos">
                <option value="lagos">Lagos</option>
                <option value="ibadan">Ibadan</option>
              </select>
            </label>
            <label className="wfield">
              Start date
              <input type="date" name="date" />
            </label>
          </div>
          <label className="wfield">
            Pickup area
            <input type="text" name="area" placeholder="e.g. Lekki Phase 1" maxLength={120} />
          </label>
          {own ? (
            <label className="wfield" key="pkg">
              Package
              <select name="package" defaultValue="full-day">
                {SERVICE_PACKAGES.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="wfield" key="class">
              Vehicle class
              <select name="class" defaultValue="suv">
                {VEHICLE_CLASSES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button type="submit" className="button button-arrow">
            Start your request
          </button>
          <p className="widget-note">
            Free to request. You only pay once your chosen driver accepts.
          </p>
        </form>
      ) : (
        <div className="widget-body">
          <p className="widget-note" style={{ fontSize: "0.9375rem", color: "var(--fd-muted)" }}>
            {own
              ? "Online booking for a driver in your own car opens with our pilot in Lagos and Ibadan."
              : "Online booking for car + driver opens with our pilot. Tell us your dates and we'll plan it with you."}
          </p>
          <Link href="/contact" className="button button-arrow">
            Talk to us
          </Link>
          <p className="widget-note">Nothing is booked or charged until online booking opens.</p>
        </div>
      )}
    </div>
  );
}
