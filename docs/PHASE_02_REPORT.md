# Phase 2 Report — Foundation and Multi-Page Shell

**Date:** 2026-11-19 · **Prompt:** `prompts/02_FOUNDATION_AND_MULTIPAGE_SHELL.md` · **Decision record:** `docs/decisions/0001-stack-and-foundation.md`

## Delivered

- Next.js 16 App Router app, strict TypeScript 6.0 (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), typed routes, ESLint 10, Prettier, Vitest, pnpm lockfile, `.nvmrc` (26), `.env.example` (names only), GitHub Actions CI (lint, typecheck, format, unit, build, route smoke, gitleaks).
- Platform layer in `src/platform/`: Zod-validated config that reports invalid keys and never their values; typed error taxonomy and API error envelope; JSON logger that redacts sensitive keys, emails and phone numbers; correlation ids through `src/proxy.ts` on every request and response.
- `/api/health` (liveness) and `/api/ready` (config validity; returns 503 with the invalid key names).
- Shared public layout: skip link, a site-wide pilot status strip, a sticky header with desktop nav and an accessible mobile disclosure menu, a footer, and route-level and global error boundaries that show a reference code but no error detail. There's an accessible 404.
- **15 public routes plus 6 package pages**, each with its own content, title, description and canonical URL: `/`, `/services`, `/services/[package]` (half-day, full-day, weekly, monthly, weekend, custom; unknown slugs give 404), `/how-it-works`, `/trust-and-safety`, `/locations/lagos`, `/locations/ibadan`, `/for-visitors`, `/drivers`, `/drivers/apply`, `/about`, `/faq`, `/contact`, `/privacy`, `/terms`. Also `sitemap.xml` and `robots.txt`; robots disallows everything outside production.
- **Distinct route groups** `(customer)`, `(driver)` and `(ops)` with all 19 routes from ARCHITECTURE §3. Each has its own layout and is marked noindex. Each shows "Sign-in isn't available yet" and loads no data.
- Draft catalog `src/modules/catalog/packages.ts`. It has **no price or hours fields**, and a unit test fails if prices or hour counts appear.

## Honesty controls in copy

- No prices, hours, testimonials, counts, insurance, 24/7 support or GPS claims. FAQ and Trust pages state these explicitly as not yet in place.
- Training is shown as "Pending". The visitors page says the pilot doesn't supply cars.
- No form submits anywhere. The driver application and contact pages say no submission is possible. Contact details appear only if `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_CONTACT_PHONE` are set. Note: these are build-time values, so rebuild after changing them.
- Privacy and Terms pages say "awaiting legal approval".

## Verification (19 Nov 2026, Node 22.23.5 locally)

| Command | Result |
|---|---|
| `pnpm lint` | 0 problems |
| `pnpm typecheck` | pass |
| `pnpm format:check` | all files formatted |
| `pnpm test` | 2 files, 30 tests passed |
| `pnpm build` (from clean `.next`) | compiled; 36 static pages generated |
| `pnpm test:routes` | 20 public + 19 portal routes return 200, each with exactly one `<h1>`, a title, `lang`, and a correlation header; public titles unique, with descriptions; portals noindex; 2 unknown routes return 404; 20 internal links resolve; health and ready OK |
| `NEXT_PUBLIC_CONTACT_PHONE=0801 next start` → `/api/ready` | 503 `{"invalidKeys":["NEXT_PUBLIC_CONTACT_PHONE"]}`; `/api/health` 200 |
| Headless Chrome (390 px) | Mobile menu opens (`aria-expanded=true`); Escape closes it and returns focus to the toggle; navigating closes it; no console errors |

## Not verified

- CI has not run on GitHub (no remote repository yet).
- Node 26 not exercised locally (22 was used).
- No automated axe/Lighthouse audit or screen-reader pass; accessibility rests on semantic markup, a skip link, visible focus, labelled navs and `aria-current`. Add Playwright + axe in Phase 11.
- No deployment.

## OPEN decisions affecting this phase

Approved public copy (all copy here is a draft from the PRD and needs founder sign-off); public contact details; legal pages (counsel); exact Lagos/Ibadan service areas; package hours and prices.

## Disabled / manual paths

All booking, payment, sign-in, driver applications and contact forms. Portals render an unavailable state only.

## Security / privacy impact

No personal data is collected or stored. Security headers are set (`nosniff`, `DENY` framing, a referrer policy, a permissions policy that blocks geolocation, camera and microphone). Logs redact personal data patterns. A Content Security Policy is deferred, because it needs per-request nonces and dynamic rendering; revisit in Phase 13.

## Residual risks

- The copy has not been reviewed by the founders.
- The design is functional, not branded; replace it when a design system is supplied.

## Next

Phase 3 (database and migrations). It needs: acceptance of ADR 0001, a managed PostgreSQL/hosting choice (or local Docker Postgres for development), and the transition-table fixes from `docs/PACK_REVIEW.md` §B1–B3.
