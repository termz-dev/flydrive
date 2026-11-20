"use client";

import { useState } from "react";
import { SERVICE_PACKAGES } from "@/modules/catalog/packages";
import { ActionForm, Field, Select, SubmitButton, TextArea } from "@/ui/form";
import { requestBookingAction } from "./actions";

export function RequestForm({
  defaultPackage,
  minStart,
}: {
  defaultPackage?: string | undefined;
  minStart: string;
}) {
  const [source, setSource] = useState<"customer" | "flydrive">("customer");
  const [overnight, setOvernight] = useState(false);
  return (
    <ActionForm action={requestBookingAction} className="form-card">
      {(e) => (
        <>
          <fieldset className="form-section">
            <legend>The booking</legend>
            <div className="form-grid">
              <Select
                label="Package"
                name="pkg"
                defaultValue={defaultPackage ?? "full-day"}
                options={SERVICE_PACKAGES.map((p) => ({ value: p.slug, label: p.name }))}
                error={e.pkg}
              />
              <Select
                label="City"
                name="city"
                options={[
                  { value: "lagos", label: "Lagos" },
                  { value: "ibadan", label: "Ibadan" },
                ]}
                error={e.city}
              />
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>The car</legend>
            <div className="option-cards" role="radiogroup" aria-label="Who provides the car">
              <label className="option-card">
                <input
                  type="radio"
                  name="vehicleSource"
                  value="customer"
                  checked={source === "customer"}
                  onChange={() => setSource("customer")}
                />
                <strong>I&apos;ll provide my car</strong>
                <span>A vetted driver drives your vehicle.</span>
              </label>
              <label className="option-card">
                <input
                  type="radio"
                  name="vehicleSource"
                  value="flydrive"
                  checked={source === "flydrive"}
                  onChange={() => setSource("flydrive")}
                />
                <strong>I need a car too</strong>
                <span>We arrange the car and the driver.</span>
              </label>
            </div>
            {source === "customer" ? (
              <div className="form-grid">
                <Field label="Make" name="make" placeholder="Toyota" error={e.make} />
                <Field label="Model" name="model" placeholder="Camry" error={e.model} />
                <Select
                  label="Transmission"
                  name="transmission"
                  options={[
                    { value: "automatic", label: "Automatic" },
                    { value: "manual", label: "Manual" },
                  ]}
                  error={e.transmission}
                />
                <Field
                  label="Colour"
                  name="colour"
                  required={false}
                  placeholder="Silver"
                  error={e.colour}
                />
              </div>
            ) : (
              <Select
                label="Vehicle class"
                name="vehicleClass"
                hint="We confirm the exact car with your booking."
                options={[
                  { value: "saloon", label: "Saloon" },
                  { value: "suv", label: "SUV" },
                  { value: "minivan", label: "Minivan" },
                ]}
                error={e.vehicleClass}
              />
            )}
          </fieldset>

          <fieldset className="form-section">
            <legend>When and where</legend>
            <div className="form-grid">
              <Field
                label="Start"
                name="startsAt"
                type="datetime-local"
                min={minStart}
                hint="Lagos time"
                error={e.startsAt}
              />
              <Field
                label="End"
                name="endsAt"
                type="datetime-local"
                min={minStart}
                hint="Lagos time"
                error={e.endsAt}
              />
            </div>
            <Field
              label="Pickup area"
              name="pickupArea"
              placeholder="Lekki Phase 1"
              hint="An area is enough for now. You'll share the exact meeting point once the booking is confirmed."
              error={e.pickupArea}
            />
          </fieldset>

          <fieldset className="form-section">
            <legend>The job</legend>
            <TextArea
              label="What will the driver be doing?"
              name="duties"
              hint="Itinerary, stops, school runs, events — anything that helps the driver decide."
              error={e.duties}
            />
            <div className="form-grid">
              <Field
                label="Passengers"
                name="passengers"
                type="number"
                min={1}
                max={20}
                defaultValue={1}
                inputMode="numeric"
                error={e.passengers}
              />
            </div>
            <div className="toggle-row">
              <label className="check">
                <input
                  type="checkbox"
                  name="overnightOutOfState"
                  checked={overnight}
                  onChange={(ev) => setOvernight(ev.target.checked)}
                />
                Includes an overnight stay outside the state
              </label>
              {overnight ? (
                <TextArea
                  label="Driver's accommodation"
                  name="accommodationNote"
                  rows={2}
                  hint="Where the driver will sleep and freshen up. Meals aren't required."
                  error={e.accommodationNote}
                />
              ) : null}
              <label className="check">
                <input type="checkbox" name="prefersFemaleDriver" />
                I&apos;d prefer a female driver — we&apos;ll try, but can&apos;t guarantee it
              </label>
            </div>
            <TextArea
              label="Anything else?"
              name="notes"
              required={false}
              rows={3}
              error={e.notes}
            />
          </fieldset>

          <div className="form-actions">
            <p className="field-hint">
              Nothing is charged now. You&apos;ll choose a driver, they accept the full job, then
              you pay and our team confirms.
            </p>
            <SubmitButton pendingText="Sending request…">Send request</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}
