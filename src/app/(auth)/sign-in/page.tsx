import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/modules/identity/forms";
import { bookingsOpen } from "@/platform/config";
import { isDbConfigured } from "@/platform/db";
import { Notice } from "@/ui/blocks";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  return (
    <>
      <h1>Sign in</h1>
      <p className="lead">Customers, drivers and Flydrive staff all sign in here.</p>
      {sp.signed_out ? (
        <p className="form-success" role="status">
          You&apos;ve signed out.
        </p>
      ) : null}
      {sp.wrong_role ? (
        <Notice title="That page is for a different kind of account" tone="pending">
          <p>Sign in with the account that page belongs to.</p>
        </Notice>
      ) : null}
      {isDbConfigured() ? (
        <SignInForm next={next} />
      ) : (
        <Notice title="Sign-in isn't available yet" tone="pending">
          <p>Accounts haven&apos;t been switched on for this site.</p>
        </Notice>
      )}
      <p className="auth-foot">
        {bookingsOpen() ? (
          <>
            New to Flydrive? <Link href="/sign-up">Create an account</Link> ·{" "}
            <Link href="/drivers/apply">Apply to drive</Link>
          </>
        ) : (
          <>Customer and driver sign-up opens with the pilot.</>
        )}
      </p>
    </>
  );
}
