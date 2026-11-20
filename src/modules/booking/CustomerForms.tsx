"use client";

import { ActionButton } from "@/ui/ActionButton";
import { ActionForm, Field, Select, SubmitButton, TextArea } from "@/ui/form";
import {
  customerCancelAction,
  customerHandoverAction,
  driverHandoverAction,
  meetingDetailsAction,
  openCaseAction,
  payAction,
  selectDriverAction,
} from "./actions";

export function SelectDriverButton({
  bookingId,
  driverId,
  name,
}: {
  bookingId: string;
  driverId: string;
  name: string;
}) {
  return (
    <ActionButton
      action={selectDriverAction}
      fields={{ bookingId, driverId }}
      label={`Choose ${name}`}
      pendingText="Sending offer…"
    />
  );
}

export function PayButton({ bookingId, amount }: { bookingId: string; amount: string }) {
  return (
    <ActionButton
      action={payAction}
      fields={{ bookingId }}
      label={`Pay ${amount} with Paystack`}
      pendingText="Opening Paystack…"
    />
  );
}

export function CancelBooking({ bookingId }: { bookingId: string }) {
  return (
    <ActionButton
      action={customerCancelAction}
      fields={{ bookingId }}
      label="Cancel this request"
      variant="danger"
      pendingText="Cancelling…"
    >
      {(e) => <Field label="Reason" name="reason" required={false} error={e.reason} />}
    </ActionButton>
  );
}

export function MeetingDetailsForm({
  bookingId,
  meetingPoint,
  contactPhone,
}: {
  bookingId: string;
  meetingPoint?: string | null;
  contactPhone?: string | null;
}) {
  return (
    <ActionForm action={meetingDetailsAction}>
      {(e) => (
        <>
          <input type="hidden" name="bookingId" value={bookingId} />
          <TextArea
            label="Meeting point"
            name="meetingPoint"
            rows={2}
            defaultValue={meetingPoint ?? ""}
            error={e.meetingPoint}
          />
          <Field
            label="Phone number the driver can call"
            name="contactPhone"
            type="tel"
            defaultValue={contactPhone ?? ""}
            error={e.contactPhone}
          />
          <div>
            <SubmitButton pendingText="Saving…">Save details</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}

export function HandoverForm({
  bookingId,
  stage,
  party,
}: {
  bookingId: string;
  stage: "pickup" | "return";
  party: "customer" | "driver";
}) {
  return (
    <ActionForm action={party === "customer" ? customerHandoverAction : driverHandoverAction}>
      {(e) => (
        <>
          <input type="hidden" name="bookingId" value={bookingId} />
          <input type="hidden" name="stage" value={stage} />
          <TextArea
            label={stage === "pickup" ? "Car's condition at pickup" : "Car's condition at return"}
            name="conditionNote"
            hint="Scratches, dents, warning lights, cleanliness — anything worth noting."
            error={e.conditionNote}
          />
          <Select
            label="Fuel level"
            name="fuelLevel"
            required={false}
            options={["", "Empty", "Quarter", "Half", "Three-quarters", "Full"].map((v) => ({
              value: v,
              label: v || "—",
            }))}
          />
          <label className="check">
            <input type="checkbox" name="disputed" /> I disagree with the other party&apos;s record
            or something&apos;s wrong
          </label>
          <div>
            <SubmitButton pendingText="Recording…">Record {stage}</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}

export function SupportForm({
  role,
  bookings,
}: {
  role: "customer" | "driver";
  bookings: { id: string; ref: string }[];
}) {
  return (
    <ActionForm action={openCaseAction} className="form-card">
      {(e) => (
        <>
          <input type="hidden" name="role" value={role} />
          <Select
            label="What kind of issue?"
            name="kind"
            options={[
              { value: "support", label: "A question or problem" },
              { value: "safety", label: "A safety concern" },
            ]}
          />
          <Select
            label="Booking"
            name="bookingId"
            required={false}
            options={[
              { value: "", label: "Not about a specific booking" },
              ...bookings.map((b) => ({ value: b.id, label: b.ref })),
            ]}
          />
          <TextArea label="What's happening?" name="message" error={e.message} />
          <p className="field-hint">If anyone is in immediate danger, call 112 first.</p>
          <div>
            <SubmitButton pendingText="Sending…">Send</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}
