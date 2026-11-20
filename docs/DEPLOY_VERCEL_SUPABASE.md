# Deploying to Vercel + Supabase

## 1. Supabase (production database)

1. Create a project (region: choose the closest available to Nigeria, e.g. EU West/Frankfurt,
   and record the choice — data-residency is an OPEN legal question).
2. **Connect → Connection string**:
   - **Transaction pooler** URI (port **6543**) → this is `DATABASE_URL` on Vercel.
   - **Session pooler / direct** URI (port 5432) → use it once from your PC to run migrations.
3. From your PC: `$env:DATABASE_URL="<session/direct URI>"; pnpm db:migrate`
   (`btree_gist` is created by the migration; Supabase allows it.)
4. **Don't run `pnpm db:seed` against production.** Create real staff instead:
   `pnpm staff:create --email you@flydrive.ng --name "Your Name" --permissions all`
   It prints a one-time password; sign in and set up the authenticator.

Row Level Security: the app connects as the database owner and enforces access in code. Don't
expose the Supabase anon key or auto-generated REST API to the browser. In Supabase → Settings →
API you can disable the Data API for the `public` schema.

## 2. Vercel

1. Import the GitHub repo. Framework: Next.js. Node version: 22.x or 24.x (Vercel's options;
   `.nvmrc` says 26 for local/CI — pick the newest Vercel offers).
2. Environment variables (Production):

| Name | Value |
|---|---|
| `APP_ENV` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain` |
| `NEXT_PUBLIC_BOOKINGS_OPEN` | `false` until launch, then `true` (redeploy after changing) |
| `DATABASE_URL` | Supabase **transaction pooler** URI (6543) |
| `APP_ENCRYPTION_KEY` | 32 random bytes, base64 (different from local) |
| `PAYSTACK_SECRET_KEY` | `sk_live_...` (or `sk_test_...` on a preview deployment) |
| `CRON_SECRET` | random 32+ characters |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_PHONE` | when approved |

3. Deploy. Check `https://your-domain/api/health` → `{"status":"ok"}` and `/api/ready` → `ready`.

## 3. Paystack

- Settings → API Keys & Webhooks → **Webhook URL**: `https://your-domain/api/webhooks/paystack`
- Use test keys on a preview deployment first and run the full flow with Paystack's test card.

## 4. Scheduled jobs

`vercel.json` runs `/api/cron/tick` once a day (Vercel Hobby only allows daily cron). Offers and
payment windows are also expired whenever someone opens a portal page. On Vercel Pro you can
change the schedule to `*/10 * * * *` for tighter timing.

## 5. Before opening bookings

- Legal: privacy notice and terms published; NDPA review done.
- Ops: support hours, refund and cancellation policy, payment deadline and offer expiry agreed
  (defaults are in `src/modules/booking/service.ts`).
- At least one staff account with each permission, MFA set up.
- Drivers vetted in **Ops → Drivers**; fleet cars added in **Ops → Fleet** for car + driver.
- Then set `NEXT_PUBLIC_BOOKINGS_OPEN=true` and redeploy.
