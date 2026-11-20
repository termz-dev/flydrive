import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/modules/identity/forms";
import { bookingsOpen } from "@/platform/config";
import { BookingNotOpen } from "@/ui/blocks";

export const metadata: Metadata = { title: "Create an account" };

export default function SignUpPage() {
  return (
    <>
      <h1>Create an account</h1>
      <p className="lead">
        You&apos;ll use it to request drivers, choose who drives and follow each booking.
      </p>
      {bookingsOpen() ? <SignUpForm /> : <BookingNotOpen />}
      <p className="auth-foot">
        Already have an account? <Link href="/sign-in">Sign in</Link> · Are you a driver?{" "}
        <Link href="/drivers/apply">Apply here</Link>
      </p>
    </>
  );
}
