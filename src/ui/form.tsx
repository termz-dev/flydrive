"use client";

import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  useId,
  type FormEvent,
  type ReactNode,
} from "react";
import { useFormStatus } from "react-dom";

const PendingContext = createContext(false);
import type { ActionState } from "@/platform/action";

type Action = (state: ActionState, fd: FormData) => Promise<ActionState>;

/**
 * Form wired to a server action. Shows a summary message and passes field errors down via
 * render-prop so each Field can show its own error with aria-describedby.
 */
export function ActionForm({
  action,
  children,
  className,
}: {
  action: Action;
  children: (errors: Record<string, string>) => ReactNode;
  className?: string | undefined;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {
    status: "idle",
  });
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  // Submitting through onSubmit (instead of only the action prop) stops React from clearing what
  // the person typed when the server returns an error. The action prop stays as a no-JS fallback.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  };
  return (
    <PendingContext.Provider value={pending}>
      <form
        action={formAction}
        onSubmit={onSubmit}
        className={`form ${className ?? ""}`}
        noValidate
      >
        {state.status === "error" ? (
          <p className="form-alert" role="alert">
            {state.message}
          </p>
        ) : null}
        {state.status === "ok" && state.message ? (
          <p className="form-success" role="status">
            {state.message}
          </p>
        ) : null}
        {children(errors)}
      </form>
    </PendingContext.Provider>
  );
}

export function Field({
  label,
  name,
  error,
  hint,
  type = "text",
  required = true,
  defaultValue,
  autoComplete,
  inputMode,
  min,
  max,
  step,
  placeholder,
}: {
  label: string;
  name: string;
  error?: string | undefined;
  hint?: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  min?: string | number;
  max?: string | number;
  step?: string | number;
  placeholder?: string;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  return (
    <div className={`field${error ? " field-error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required ? null : <span className="optional"> (optional)</span>}
      </label>
      {hint ? (
        <p className="field-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        inputMode={inputMode}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errId].filter(Boolean).join(" ") || undefined}
      />
      {error ? (
        <p className="field-msg" id={errId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({
  label,
  name,
  error,
  hint,
  required = true,
  rows = 4,
  defaultValue,
}: {
  label: string;
  name: string;
  error?: string | undefined;
  hint?: string;
  required?: boolean;
  rows?: number;
  defaultValue?: string;
}) {
  const id = useId();
  const errId = error ? `${id}-err` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={`field${error ? " field-error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required ? null : <span className="optional"> (optional)</span>}
      </label>
      {hint ? (
        <p className="field-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errId].filter(Boolean).join(" ") || undefined}
      />
      {error ? (
        <p className="field-msg" id={errId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Select({
  label,
  name,
  options,
  error,
  hint,
  required = true,
  defaultValue,
}: {
  label: string;
  name: string;
  options: readonly { value: string; label: string }[];
  error?: string | undefined;
  hint?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  const id = useId();
  const errId = error ? `${id}-err` : undefined;
  return (
    <div className={`field${error ? " field-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {hint ? <p className="field-hint">{hint}</p> : null}
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={errId}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="field-msg" id={errId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CheckboxGroup({
  legend,
  name,
  options,
  error,
  defaultValues = [],
}: {
  legend: string;
  name: string;
  options: readonly { value: string; label: string }[];
  error?: string | undefined;
  defaultValues?: readonly string[];
}) {
  return (
    <fieldset className={`field${error ? " field-error" : ""}`}>
      <legend>{legend}</legend>
      <div className="choice-row">
        {options.map((o) => (
          <label key={o.value} className="check">
            <input
              type="checkbox"
              name={name}
              value={o.value}
              defaultChecked={defaultValues.includes(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
      {error ? <p className="field-msg">{error}</p> : null}
    </fieldset>
  );
}

export function SubmitButton({
  children,
  pendingText = "Working…",
}: {
  children: ReactNode;
  pendingText?: string;
}) {
  const ctxPending = useContext(PendingContext);
  const { pending: formPending } = useFormStatus();
  const pending = ctxPending || formPending;
  return (
    <button type="submit" className="button button-yellow" disabled={pending} aria-busy={pending}>
      {pending ? pendingText : children}
    </button>
  );
}
