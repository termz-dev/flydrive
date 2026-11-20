# Phases 3–15 Report — the bookable product

**Date:** 2026-11-20 · **Decisions:** ADR 0006 (data, sign-in, payments, hosting)

## What works

**Customers**: sign up; request a driver (driver-only or car + driver; packages; dates in Lagos time;
duties, passengers, overnight accommodation, female-driver preference); short-notice requests are
flagged for ops; see a shortlist with limited profiles (first name, experience, transmissions,
training "Pending"); choose a driver; pay with Paystack once the driver accepts; see "checking
payment" until a person confirms; then see the driver's name and phone, add the meeting point and
contact number; record pickup and return; cancel free before paying; raise support or safety
cases; in-app updates.

**Drivers**: apply (account, profile, consent); see check status; block unavailable time; get
offers with the full job; accept (time held until the payment deadline) or decline (never held
against them); see confirmed assignments with meeting point and handler; record handovers; raise
concerns.

**Operations** (MFA required, per-permission): overview counts; bookings by status; set price and
shortlist drivers who are eligible, in the city, drive the transmission and are free (female
drivers listed first when preferred); choose the Flydrive car for car + driver; mark no driver
available; verify payment (amount must match) and confirm; reject a payment; cancel (paid
bookings flagged for manual refund); review identity/licence/guarantor/background checks with
expiry — eligibility updates automatically; suspend/reject/reinstate drivers; manage fleet cars;
resolve incidents (safety first); append-only audit log.

**System**: booking state machine with an explicit transition table; one-at-a-time updates;
driver/vehicle overlap prevented in the database (holds included); Paystack webhook with signature
check, de-duplication and server-side verification; expiry of unanswered offers and unpaid holds;
rate-limited sign-in, sign-up and MFA; the `NEXT_PUBLIC_BOOKINGS_OPEN` launch switch.

## Verification (20 Nov 2026)

| Check | Result |
|---|---|
| `pnpm lint`, `typecheck`, `format:check` | pass |
| `pnpm test` (unit) | 46 passed |
| `pnpm test:db` (real Postgres 16) | 14 passed — constraints, concurrency, full lifecycle, amount mismatch, expiries, vetting |
| `pnpm build` + `pnpm test:routes` (bookings closed, no DB) | 21 public + 22 portal/auth routes, 2 not-found, internal links |
| Browser journey (Chrome, bookings open, seeded Postgres) | 23 steps passed: sign-up with field errors, request, wrong password and wrong MFA code rejected, MFA enrolment, shortlist, limited profile before payment, selection, driver accept, cross-role access denied, honest "payment unavailable" without a key, verified charge, "checking payment" state, ops confirm, details revealed, meeting point, both handovers, completion, audit entry, mobile sign-in; no console errors |

**Not verified:** a live Paystack checkout and webhook (needs your test keys and a public URL —
do this on a Vercel preview); Supabase specifically (tested on local Postgres 16; same SQL);
Windows-native `pnpm install` of `@node-rs/argon2` (prebuilt binaries exist for Windows x64).

## Open / not built

Email & SMS (provider OPEN) · photo uploads at handover (storage OPEN) · phone sign-in for drivers
(planned for launch) · driver payouts and automated refunds (policy OPEN) · published prices ·
CSP header · automated accessibility audit · legal pages content.
