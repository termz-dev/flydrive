"use client";

import { ActionButton } from "@/ui/ActionButton";
import { ActionForm, Field, Select, SubmitButton, TextArea } from "@/ui/form";
import {
  addFleetVehicleAction,
  confirmAction,
  driverStatusAction,
  noCandidateAction,
  opsCancelAction,
  publishAction,
  rejectPaymentAction,
  resolveCaseAction,
  reviewCheckAction,
} from "./actions";

export function PublishForm({
  bookingId,
  drivers,
  fleet,
  needsFleet,
  quoteNaira,
}: {
  bookingId: string;
  drivers: { id: string; label: string }[];
  fleet: { id: string; label: string }[];
  needsFleet: boolean;
  quoteNaira?: string | undefined;
}) {
  return (
    <ActionForm action={publishAction}>
      {(e) => (
        <>
          <input type="hidden" name="bookingId" value={bookingId} />
          <Field
            label="Agreed price (₦)"
            name="quote"
            inputMode="numeric"
            defaultValue={quoteNaira ?? ""}
            hint="Prices aren't published yet, so set the amount for this booking."
            error={e.quote}
          />
          {needsFleet ? (
            <Select
              label="Flydrive car"
              name="fleetVehicleId"
              options={[
                { value: "", label: "Choose a car" },
                ...fleet.map((f) => ({ value: f.id, label: f.label })),
              ]}
              error={e.fleetVehicleId}
            />
          ) : null}
          <fieldset className="field">
            <legend>Shortlist drivers (eligible and free for these dates)</legend>
            {drivers.length === 0 ? (
              <p className="empty">No eligible driver is free for this window.</p>
            ) : (
              <div className="stack" style={{ gap: 8 }}>
                {drivers.map((d) => (
                  <label key={d.id} className="check">
                    <input type="checkbox" name="driverIds" value={d.id} /> {d.label}
                  </label>
                ))}
              </div>
            )}
          </fieldset>
          <div>
            <SubmitButton pendingText="Sending…">Send shortlist to customer</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}

export function NoCandidateForm({ bookingId }: { bookingId: string }) {
  return (
    <ActionButton
      action={noCandidateAction}
      fields={{ bookingId }}
      label="Tell customer no driver is available"
      variant="danger"
    >
      {(e) => <Field label="Reason (shown in the timeline)" name="reason" error={e.reason} />}
    </ActionButton>
  );
}

export function ConfirmButtons({ bookingId }: { bookingId: string }) {
  return (
    <div className="two-col">
      <ActionButton
        action={confirmAction}
        fields={{ bookingId }}
        label="Payment checked — confirm booking"
        pendingText="Confirming…"
      />
      <ActionButton
        action={rejectPaymentAction}
        fields={{ bookingId }}
        label="Payment doesn't check out"
        variant="danger"
      >
        {(e) => <Field label="What's wrong?" name="reason" error={e.reason} />}
      </ActionButton>
    </div>
  );
}

export function OpsCancel({ bookingId }: { bookingId: string }) {
  return (
    <ActionButton
      action={opsCancelAction}
      fields={{ bookingId }}
      label="Cancel booking"
      variant="danger"
      pendingText="Cancelling…"
    >
      {(e) => <Field label="Reason" name="reason" error={e.reason} />}
    </ActionButton>
  );
}

export function CheckReview({ checkId, status }: { checkId: string; status: string }) {
  return (
    <ActionForm action={reviewCheckAction}>
      {(e) => (
        <>
          <input type="hidden" name="checkId" value={checkId} />
          <div className="form-grid">
            <Select
              label="Result"
              name="status"
              defaultValue={status === "expired" ? "pending" : status}
              options={[
                { value: "pending", label: "Pending" },
                { value: "passed", label: "Passed" },
                { value: "failed", label: "Not passed" },
              ]}
            />
            <Field label="Valid until" name="expiresOn" type="date" required={false} />
          </div>
          <Field
            label="What you checked"
            name="note"
            hint="e.g. 'Licence sighted, matches name, valid'. Never record ID numbers."
            error={e.note}
          />
          <div>
            <SubmitButton pendingText="Saving…">Save</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}

export function DriverStatusForm({ driverId }: { driverId: string }) {
  return (
    <ActionForm action={driverStatusAction}>
      {(e) => (
        <>
          <input type="hidden" name="driverId" value={driverId} />
          <Select
            label="Change status"
            name="status"
            options={[
              { value: "suspended", label: "Suspend (can't be offered jobs)" },
              { value: "rejected", label: "Reject application" },
              { value: "under_review", label: "Reinstate (re-check eligibility)" },
            ]}
          />
          <Field label="Reason" name="reason" error={e.reason} />
          <div>
            <SubmitButton pendingText="Saving…">Update status</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}

export function FleetForm() {
  return (
    <ActionForm action={addFleetVehicleAction} className="form-card">
      {(e) => (
        <>
          <Field
            label="Vehicle"
            name="label"
            placeholder="Toyota Camry 2019 (silver)"
            error={e.label}
          />
          <div className="form-grid">
            <Select
              label="Class"
              name="vehicleClass"
              options={[
                { value: "saloon", label: "Saloon" },
                { value: "suv", label: "SUV" },
                { value: "minivan", label: "Minivan" },
              ]}
            />
            <Select
              label="Transmission"
              name="transmission"
              options={[
                { value: "automatic", label: "Automatic" },
                { value: "manual", label: "Manual" },
              ]}
            />
            <Select
              label="City"
              name="city"
              options={[
                { value: "lagos", label: "Lagos" },
                { value: "ibadan", label: "Ibadan" },
              ]}
            />
            <Field label="Seats" name="seats" type="number" required={false} min={1} max={20} />
          </div>
          <div>
            <SubmitButton pendingText="Adding…">Add vehicle</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}

export function ResolveCase({ caseId }: { caseId: string }) {
  return (
    <ActionForm action={resolveCaseAction}>
      {(e) => (
        <>
          <input type="hidden" name="caseId" value={caseId} />
          <TextArea
            label="Resolution (visible to the person who raised it)"
            name="resolution"
            rows={2}
            error={e.resolution}
          />
          <div>
            <SubmitButton pendingText="Saving…">Resolve</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}
