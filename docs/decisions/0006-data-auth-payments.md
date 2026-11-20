# ADR 0006 — Database, sign-in, payments and hosting

- **Status:** Accepted
- **Owner:** Tree (Tree Augmented)
- **Date:** 2026-11-20

## Decisions

| Area | Decision | Notes |
|---|---|---|
| Hosting | Vercel (app) + Supabase (PostgreSQL) | Owner choice. Local Postgres for development. |
| DB access | Drizzle ORM + `postgres` (postgres.js), `prepare: false` | Works with Supabase's transaction pooler (port 6543) from serverless functions. |
| Migrations | `drizzle/*.sql`, applied with `pnpm db:migrate` | `0001_constraints.sql` adds `btree_gist` exclusion constraints and append-only triggers. |
| Sign-in | Email + password for everyone now | Owner choice. `users.phone` is unique so phone + password sign-in for drivers can be added at launch without a migration of data. |
| Passwords | argon2id (`@node-rs/argon2`, 19 MiB, t=2) | Timing equalised for unknown accounts. |
| Sessions | Random 256-bit token in an httpOnly, SameSite=Lax cookie; only its SHA-256 is stored | 14 days for customers/drivers, 12 hours for staff. |
| Staff MFA | TOTP (authenticator app), secret AES-256-GCM encrypted with `APP_ENCRYPTION_KEY`; replay blocked by last-used step | Required before any ops page or action. |
| Permissions | Per staff member: bookings.manage, drivers.review, payments.verify, bookings.confirm, incidents.manage, audit.read, staff.admin | Confirming a booking needs payments.verify **and** bookings.confirm. |
| Rate limits | Postgres-backed fixed windows (sign-in per IP and per account, sign-up, MFA) | Works across Vercel instances. |
| Payments | Paystack: initialize → hosted checkout → callback page and webhook both call `transaction/verify`; amounts never trusted from the browser or webhook body | Owner choice. Webhook signature HMAC-SHA512 verified on the raw body; events stored once (`webhook_events`). |
| Confirmation | A person verifies every payment (amount must equal the quote) before a booking is confirmed | Matches PRD §6.7. |
| Pricing | Ops sets the price per booking (`quote_kobo`) | Rates are still OPEN; no published prices. |
| Driver time | Accepting an offer creates a **hold** until the payment deadline; confirmation turns it into an assignment; overlap prevented by an exclusion constraint | Fixes PACK_REVIEW B1. |
| Deadlines | Offer reply: 12 h (or 1 h before start). Payment: 24 h after acceptance (or 2 h before start) | Conservative defaults in `src/modules/booking/service.ts`; still OPEN for Finance/Ops. |
| Jobs | `/api/cron/tick` (daily on Vercel Hobby) + `sweepIfDue()` on portal page loads, at most once a minute | Vercel Hobby only allows daily cron; Pro allows per-minute. Actions also refuse expired offers/windows themselves. |
| API style | Server Actions for the UI; Route Handlers only for webhooks, cron and health | Deviation from the `/api/v1` REST sketch in `docs/API_CONTRACTS.md`; the same validation, authorization and state rules apply. Next.js checks the Origin of every Server Action. |
| Notifications | In-app only | Email/SMS provider is OPEN; the `outbox` table is ready for it. |
| Launch switch | `NEXT_PUBLIC_BOOKINGS_OPEN` (build-time) | `false`: public site says booking isn't open and sign-up/requests/applications are refused server-side. Sign-in always works for staff. |

## Not built yet (deliberately)

Photo uploads at handover (storage vendor OPEN), email/SMS delivery, driver payouts, automated refunds, phone sign-in for drivers, a Content Security Policy, an automated accessibility audit.
