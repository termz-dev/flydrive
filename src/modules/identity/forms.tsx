"use client";

import Link from "next/link";
import { ActionForm, Field, SubmitButton } from "@/ui/form";
import { signIn, signUpCustomer, verifyMfa } from "./actions";

export function SignInForm({ next }: { next?: string | undefined }) {
  return (
    <ActionForm action={signIn} className="form-card">
      {(e) => (
        <>
          {next ? <input type="hidden" name="next" value={next} /> : null}
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            error={e.email}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            error={e.password}
          />
          <SubmitButton pendingText="Signing in…">Sign in</SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function SignUpForm() {
  return (
    <ActionForm action={signUpCustomer} className="form-card">
      {(e) => (
        <>
          <Field label="Full name" name="fullName" autoComplete="name" error={e.fullName} />
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            error={e.email}
          />
          <Field
            label="Phone number"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            hint="Your Flydrive handler uses this to reach you about bookings."
            error={e.phone}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            hint="At least 10 characters."
            error={e.password}
          />
          <p className="field-hint">
            By creating an account you agree to the <Link href="/terms">terms</Link> and{" "}
            <Link href="/privacy">privacy notice</Link>.
          </p>
          <SubmitButton pendingText="Creating account…">Create account</SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function MfaForm({ cta }: { cta: string }) {
  return (
    <ActionForm action={verifyMfa} className="form-card">
      {(e) => (
        <>
          <Field
            label="6-digit code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            error={e.code}
          />
          <SubmitButton pendingText="Checking…">{cta}</SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
