import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MfaForm } from "@/modules/identity/forms";
import { getSessionUser } from "@/modules/identity/session";

export const metadata: Metadata = { title: "Enter your code" };

export default async function MfaVerifyPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "staff") redirect("/sign-in");
  if (!user.mfaEnrolled) redirect("/ops-mfa/setup");
  if (user.mfaVerified) redirect("/ops");
  return (
    <>
      <h1>Enter your code</h1>
      <p className="lead">
        Open your authenticator app and enter the 6-digit code for Flydrive Ops.
      </p>
      <MfaForm cta="Continue" />
    </>
  );
}
