"use client";

import { respondOfferAction } from "@/modules/booking/actions";
import { ActionButton } from "@/ui/ActionButton";
import { ActionForm, CheckboxGroup, Field, Select, SubmitButton, TextArea } from "@/ui/form";
import { addUnavailabilityAction, applyDriverAction, removeUnavailabilityAction } from "./actions";

export function ApplyForm() {
  return (
    <ActionForm action={applyDriverAction} className="form-card">
      {(e) => (
        <>
          <div className="form-grid">
            <Field label="Full name" name="fullName" autoComplete="name" error={e.fullName} />
            <Field
              label="First name customers see"
              name="firstName"
              autoComplete="given-name"
              error={e.firstName}
            />
            <Field label="Email" name="email" type="email" autoComplete="email" error={e.email} />
            <Field
              label="Phone number"
              name="phone"
              type="tel"
              autoComplete="tel"
              error={e.phone}
            />
          </div>
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            hint="At least 10 characters."
            error={e.password}
          />
          <div className="form-grid">
            <Field
              label="Years of professional driving"
              name="yearsExperience"
              type="number"
              min={0}
              max={60}
              inputMode="numeric"
              error={e.yearsExperience}
            />
            <Select
              label="Gender"
              name="gender"
              hint="Some customers ask for a female driver. You can choose not to say."
              options={[
                { value: "undisclosed", label: "Prefer not to say" },
                { value: "female", label: "Female" },
                { value: "male", label: "Male" },
              ]}
            />
          </div>
          <CheckboxGroup
            legend="Cars you can drive"
            name="transmissions"
            options={[
              { value: "automatic", label: "Automatic" },
              { value: "manual", label: "Manual" },
            ]}
            error={e.transmissions}
          />
          <CheckboxGroup
            legend="Where you can work"
            name="cities"
            options={[
              { value: "lagos", label: "Lagos" },
              { value: "ibadan", label: "Ibadan" },
            ]}
            error={e.cities}
          />
          <TextArea label="A little about you" name="bio" required={false} rows={3} />
          <label className="check">
            <input type="checkbox" name="consent" /> I agree that Flydrive may verify my identity,
            licence and guarantor, as described in the privacy notice.
          </label>
          {e.consent ? <p className="field-msg">{e.consent}</p> : null}
          <p className="field-hint">
            Don&apos;t upload documents here. Our team will contact you to check them securely.
          </p>
          <div>
            <SubmitButton pendingText="Sending application…">Apply</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}

export function OfferResponse({ offerId }: { offerId: string }) {
  return (
    <div className="two-col">
      <ActionButton
        action={respondOfferAction}
        fields={{ offerId, decision: "accept" }}
        label="Accept this job"
        pendingText="Accepting…"
      />
      <ActionButton
        action={respondOfferAction}
        fields={{ offerId, decision: "decline" }}
        label="Decline"
        variant="danger"
        pendingText="Declining…"
      >
        {() => <Field label="Reason (optional, private)" name="reason" required={false} />}
      </ActionButton>
    </div>
  );
}

export function AddUnavailability({ minStart }: { minStart: string }) {
  return (
    <ActionForm action={addUnavailabilityAction} className="form-card">
      {(e) => (
        <>
          <div className="form-grid">
            <Field
              label="From"
              name="startsAt"
              type="datetime-local"
              min={minStart}
              error={e.startsAt}
            />
            <Field
              label="Until"
              name="endsAt"
              type="datetime-local"
              min={minStart}
              error={e.endsAt}
            />
          </div>
          <div>
            <SubmitButton pendingText="Saving…">Block this time</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}

export function RemoveUnavailability({ blockId }: { blockId: string }) {
  return (
    <ActionButton
      action={removeUnavailabilityAction}
      fields={{ blockId }}
      label="Remove"
      variant="danger"
      pendingText="Removing…"
    />
  );
}
