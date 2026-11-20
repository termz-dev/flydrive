import type { Metadata } from "next";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { ensurePendingMfaSecret } from "@/modules/identity/actions";
import { MfaForm } from "@/modules/identity/forms";
import { getSessionUser } from "@/modules/identity/session";
import { totpUri } from "@/modules/identity/totp";

export const metadata: Metadata = { title: "Set up two-step sign-in" };

export default async function MfaSetupPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "staff") redirect("/sign-in");
  if (user.mfaEnrolled) redirect("/ops-mfa/verify");
  const pending = await ensurePendingMfaSecret();
  if (!pending) redirect("/sign-in");
  const uri = totpUri(pending.secret, pending.email);
  const svg = await QRCode.toString(uri, { type: "svg", margin: 1, width: 200 });
  return (
    <>
      <h1>Set up two-step sign-in</h1>
      <p className="lead">
        Operations accounts need a code from an authenticator app (Google Authenticator, Microsoft
        Authenticator, 1Password…) every time you sign in.
      </p>
      <ol>
        <li>Scan this code with your authenticator app.</li>
        <li>Enter the 6-digit code it shows.</li>
      </ol>
      <div
        className="qr"
        aria-label="QR code for your authenticator app"
        role="img"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="field-hint">
        Can&apos;t scan? Enter this key manually: <span className="mono">{pending.secret}</span>
      </p>
      <MfaForm cta="Turn on and continue" />
    </>
  );
}
