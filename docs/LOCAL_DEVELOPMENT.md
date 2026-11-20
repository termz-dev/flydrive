# Running Flydrive locally (Windows)

You need **Node 22.12+** and **pnpm 10** (you have these), plus a PostgreSQL database.

## 1. Get a database — pick one

**A. Supabase (easiest, no install).** Create a free project for development (keep it separate from
production). In Supabase: **Connect → Connection string → Session pooler** (port 5432) — use that
for local work. Copy the URI and put your database password in it.

**B. PostgreSQL on Windows.** Install PostgreSQL 16 or 17 from postgresql.org (the EDB installer),
remember the password you set for `postgres`, then in a terminal:

```
psql -U postgres -c "create database flydrive"
psql -U postgres -c "create database flydrive_test"
```

Your URL is then `postgres://postgres:YOUR_PASSWORD@localhost:5432/flydrive`.

## 2. Create `.env.local`

Copy `.env.example` to `.env.local` and fill in at least:

```
DATABASE_URL=postgres://...            # from step 1
APP_ENCRYPTION_KEY=...                 # run: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXT_PUBLIC_BOOKINGS_OPEN=true         # lets you use sign-up, requests and applications locally
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Add `PAYSTACK_SECRET_KEY=sk_test_...` from the Paystack dashboard (Settings → API Keys, test mode)
when you want to try payments.

## 3. Install, create tables, add demo data, run

The database scripts read `.env.local` automatically.

```
pnpm install
pnpm db:migrate
$env:SEED_PASSWORD="demo-pass-123"; pnpm db:seed
pnpm dev
```

Open http://localhost:3000. Demo accounts (password `demo-pass-123`):

- `ops@flydrive.local` — operations. First sign-in asks you to scan a QR code with an
  authenticator app (Google Authenticator, Microsoft Authenticator, 1Password…).
- `customer@flydrive.local` — customer
- `tunde@`, `ngozi@`, `sola@`, `halima@flydrive.local` — eligible drivers

## 4. Try the full flow

1. As the customer: **Request a driver**.
2. As ops: **Bookings → your request**, enter a price, tick drivers, **Send shortlist**.
3. As the customer: **Choose** a driver.
4. As that driver: open the offer and **Accept**.
5. As the customer: **Pay** (needs a Paystack test key — use Paystack's test card).
   No key yet? Simulate a paid test charge:
   `pnpm exec tsx tests/e2e/simulate-charge.ts FD-XXXXXX` (refuses to run in production).
6. As ops: **Payments → booking → Payment checked — confirm booking**.
7. Customer adds the meeting point; both record pickup, then return.

Paystack webhooks can't reach `localhost`; the payment return page verifies the charge itself, so
local payments still work. Webhooks are exercised once deployed.

## Tests

```
pnpm lint; pnpm typecheck; pnpm test
$env:DATABASE_URL_TEST="postgres://.../flydrive_test"; pnpm test:db   # wipes that database
```
