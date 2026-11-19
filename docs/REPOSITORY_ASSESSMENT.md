# Repository Assessment — Phase 1

**Date:** 19 November 2026 · **Author:** implementation agent (Claude) · **Status:** for review by Tree / founders before Phase 2

## 0. Scope and assumption

No application repository was supplied with this pack — only the 32 planning files in the Flydrive Implementation Pack. This assessment therefore treats Flydrive as a **greenfield build**. If an existing repo, prototype or hosting account exists, re-run Phase 1 against it before Phase 2; nothing below should be scaffolded over working code.

Nothing was changed, scaffolded or installed. No secrets or environment files were present.

**Files read:** `README.md`, `AGENTS.md`, `CLAUDE.md`, `PRD.md`, `ARCHITECTURE.md`, all of `docs/` (incl. `OPEN_QUESTIONS.md`, `DOMAIN_MODEL_AND_SCHEMA.md`, `API_CONTRACTS.md`, `SECURITY_PRIVACY.md`, `ERROR_HANDLING_RELIABILITY.md`, `VERIFICATION_AND_TEST_PLAN.md`, `DEPLOYMENT_AND_OPERATIONS.md`, `SOURCE_TRACEABILITY.md`, `IMPLEMENTATION_ROADMAP.md`, `decisions/ADR_TEMPLATE.md`) and `prompts/00`–`15`.

**Checks performed:**

| Check | Command / source | Result |
|---|---|---|
| Repo contents | `find . -type f` on extracted pack | 32 Markdown files; no `package.json`, lockfile, source, migrations, CI, Dockerfile or `.env.example` |
| Git state | — | Not a git repository |
| Current package versions | `npm view <pkg> version` (19 Nov 2026) | next 16.4.6 · react 19.3.1 · typescript 7.0.2 · drizzle-orm 0.45.4 · drizzle-kit 0.31.11 · zod 4.6.7 · pg 8.23.1 · vitest 5.1.1 · @playwright/test 1.65.1 · eslint 10.15.0 |
| Next.js engine floor | `npm view next engines` | `node >=20.9.0` |
| Node LTS status | nodejs/Release schedule | Node 26 entered Active LTS on 28 Oct 2026 (EOL Apr 2029); Node 24 is now Maintenance LTS (EOL Apr 2028) |
| Source PRDs | — | `Flydrive_PRD.md.docx` and `Driver Outsourcing Platform for Lagos.docx` are cited but **not in the pack**; traceability to original wording cannot be verified |

## 1. Current state

| Area | State |
|---|---|
| Runtime / package manager | None. Proposed: Node 26 LTS, pnpm |
| Apps / routes | None |
| Modules / domain code | None |
| Database / migrations | None |
| Auth | None; identity provider OPEN |
| Provider adapters | None; payment, screening, notification, storage, hosting all OPEN |
| Tests / CI | None |
| Deploy | None; vendor/region OPEN |
| Env examples | None |
| Agent instructions | `AGENTS.md`, `CLAUDE.md`, `prompts/00` — coherent and strict; keep as repo root files |

**Reusable:** the planning docs. **Broken:** nothing. **Empty:** everything else.

## 2. Proposed stack (recorded choices, pending ADR 0001)

| Layer | Proposal | Notes / risk |
|---|---|---|
| Runtime | Node **26.x LTS**, pinned via `.nvmrc` + `engines` + CI | 24.x acceptable if host lacks 26 |
| Web | Next.js **16.x** App Router, React 19 | Route Handlers for `/api/v1`; Server Actions only for plain UI mutations with same validation/auth |
| Language | TypeScript strict | TS **7.0** (native compiler) is new; confirm Next 16 + typescript-eslint support at scaffold. If not, pin latest 5.x/6.x and record in ADR |
| Validation | Zod 4 | Shared schemas at HTTP, env, webhook, job and upload boundaries |
| DB | Managed PostgreSQL (17 or 18) | `btree_gist` extension for driver-overlap exclusion constraints; no PostGIS |
| Data access | Drizzle ORM + drizzle-kit, checked-in SQL migrations | Raw SQL for locking and exclusion constraints |
| Worker | Same codebase, separate `worker` entrypoint polling outbox/inbox | No Redis/queue in pilot |
| Tests | Vitest (unit/integration with ephemeral Postgres via Testcontainers or CI service), Playwright (e2e) | |
| Lint/format | ESLint 10 flat config + Prettier | |

## 3. Route map (proposed; nothing exists)

| Group | Routes | Auth |
|---|---|---|
| `(public)` | `/`, `/services`, `/services/[package]`, `/how-it-works`, `/trust-and-safety`, `/locations/lagos`, `/locations/ibadan`, `/for-visitors`, `/drivers`, `/drivers/apply`, `/about`, `/faq`, `/contact`, `/privacy`, `/terms`, `not-found` | none |
| `(customer)` | `/account`, `/bookings/new`, `/bookings/[id]`, `/bookings/[id]/payment`, `/bookings/[id]/handover`, `/support` | customer role, object-scoped |
| `(driver)` | `/driver`, `/driver/onboarding`, `/driver/availability`, `/driver/offers/[id]`, `/driver/assignments/[id]` | driver role, object-scoped |
| `(ops)` | `/ops`, `/ops/bookings`, `/ops/bookings/[id]`, `/ops/drivers`, `/ops/drivers/[id]`, `/ops/payments`, `/ops/incidents`, `/ops/audit` | staff + granular permission, MFA |
| API | `/api/v1/...` per `docs/API_CONTRACTS.md`, `/api/webhooks/payments/[provider]`, `/api/health`, `/api/ready` | per endpoint |

## 4. Proposed directory tree (do not scaffold until Phase 2)

```text
flydrive/
├─ AGENTS.md  CLAUDE.md  README.md  PRD.md  ARCHITECTURE.md
├─ docs/                      # this pack + REPOSITORY_ASSESSMENT.md + decisions/
├─ prompts/
├─ .nvmrc  package.json  pnpm-lock.yaml  tsconfig.json  eslint.config.mjs
├─ .env.example               # names + descriptions only
├─ .github/workflows/ci.yml   # lint, typecheck, unit, db, e2e, secret scan
├─ drizzle/                   # generated + hand-written SQL migrations
├─ src/
│  ├─ app/
│  │  ├─ (public)/…           # 15 public routes + layout
│  │  ├─ (customer)/…         # layout enforces session + role
│  │  ├─ (driver)/…
│  │  ├─ (ops)/…
│  │  ├─ api/v1/…             # thin Route Handlers → application services
│  │  ├─ api/webhooks/…
│  │  ├─ not-found.tsx  error.tsx  global-error.tsx
│  ├─ modules/                # one folder per ARCHITECTURE §4 module
│  │  ├─ identity/            # domain/ application/ infra/ contracts.ts
│  │  ├─ customer-vehicle/
│  │  ├─ driver-verification/
│  │  ├─ catalog/
│  │  ├─ booking/
│  │  ├─ matching/
│  │  ├─ payments/
│  │  ├─ handover/
│  │  ├─ operations/
│  │  ├─ notifications/
│  │  └─ audit-reporting/
│  ├─ platform/               # db client, tx helper, errors, logger, correlation, config (zod env), authz primitives, idempotency, outbox
│  ├─ adapters/               # one interface per provider; "not-configured" implementation returns typed Unavailable
│  ├─ ui/                     # design-system components, nav, footer, form primitives, state components
│  └─ worker/index.ts         # outbox + inbox processors
└─ tests/
   ├─ unit/  db/  api/  e2e/
   └─ fixtures/               # synthetic only; test fakes never imported from src/
```

Dependency rule: `app → modules/*/application → modules/*/domain`; `infra` and `adapters` implement interfaces declared in `application`; modules talk to each other only through `contracts.ts`. Enforce with an ESLint import-boundary rule.

## 5. PRD → files traceability

| PRD § | Requirement | Planned location | Blocking OPEN items |
|---|---|---|---|
| §4 | Multi-page public site | `src/app/(public)/*`, `src/ui/*` | Legal page copy (counsel) |
| §5 | Packages, 3-day notice, intake | `modules/catalog`, `modules/booking`, `app/(customer)/bookings/new` | Hours, rates, weekend cutoff, monthly definition |
| §6.1–2 | Request + urgent ops review | `modules/booking` (`urgent_ops_review`), `app/(ops)/ops/bookings` | Ops coverage hours |
| §6.3 | Candidate list, limited profile | `modules/matching`, profile mapper in `modules/driver-verification/contracts.ts` | Blurred-photo method |
| §6.4–5 | Selection ≠ assignment; accept/decline | `modules/matching` (offers), `app/(driver)/driver/offers/[id]` | Offer expiry; notification channel |
| §6.6–7 | Payment after accept; ops verify; confirm | `modules/payments`, `adapters/payment`, `app/api/webhooks`, `app/(ops)/ops/payments` | Provider, payment deadline, evidence standard |
| §6.8 | Post-confirmation meeting point/phone | `modules/booking`, `app/(customer)/bookings/[id]` | Required fields, deadline |
| §6.9 | Handover confirmations + photos | `modules/handover`, `adapters/storage` | Storage vendor, retention, multi-day cadence |
| §6.10 | Replacement or refund | `modules/operations`, `modules/payments` | Refund policy |
| §7 | Driver checks, guarantor, training pending | `modules/driver-verification`, `app/(driver)/driver/onboarding`, `app/(ops)/ops/drivers` | Screening source, lawful basis, appeal, retention |
| §7 | Safety escalation, strikes (human) | `modules/operations` (incidents) | Staffing, escalation SOP |
| §8 | Ledger, payouts, reschedule/termination | `modules/payments` (`financial_entries`) | Payout trigger/provider; all change terms |
| §9 | Ops dashboard + audit | `app/(ops)/*`, `modules/audit-reporting` | Staff roles list |
| §2 | Metrics (completions, repeat, referrals) | `modules/audit-reporting` | **Referral capture not in schema — see review** |
| §11 | Quality, a11y, observability | `platform/*`, CI, Playwright + axe | Device matrix, SLO, RPO/RTO |

## 6. Recommended vertical slices

Ordered so each slice is shippable and truthful on its own. Slices 1–3 can run without any OPEN vendor decision.

| # | Slice | Depends on | Exit check |
|---|---|---|---|
| 1 | **Foundation + public site skeleton** (prompt 02, plus approved copy from prompt 10 pulled forward) | ADR 0001 stack | All 15 routes reachable; nav/404 work; lint/typecheck/CI green; Lighthouse a11y pass; CTAs say "register interest" |
| 2 | **Schema + authz primitives** (prompt 03, platform side of 04) | Slice 1 | Migrations from empty; overlap + single-active-offer constraints proven by concurrent tests |
| 3 | **Lead intake persisted** — public request-interest + driver-application forms write to DB, appear in `/ops` queue behind staff login | Slices 1–2; staff auth (can be provider-agnostic magic link for 3–5 staff) | Submitted request visible to ops; idempotent submit; no fake confirmation copy |
| 4 | **Customer/driver auth + driver vetting (manual reviewer workflow)** (prompts 04, 05) | Identity provider ADR | Ineligible driver can't be offered; cross-user negative tests pass |
| 5 | **Request → candidates → selection → driver accept** (prompts 06, 07) | Slice 4; notification channel ADR (or ops-phones-driver manual step) | Selection, acceptance and confirmation are distinct persisted states |
| 6 | **Payment + ops verification + confirmation** (prompts 08, 09) | Payment provider ADR, payment policy | Sandbox evidence; unknown-state reconciliation; no confirm before review |
| 7 | Handover, support, safety, notifications (prompt 12) | Storage ADR, SOPs | Ops rehearsal of fallback |
| 8 | Portal completion, hardening, deploy, acceptance (prompts 11, 13–15) | All above | Go/no-go with named owners |

## 7. Decisions

**Agent may decide (record in ADR, reversible):** folder/module layout, component library approach, lint/format rules, test tooling, Drizzle vs. raw SQL per query, internal naming, state-name refinements that keep semantics, error code catalogue, logging library, pnpm.

**Owner must decide before the dependent slice:**

| Decision | Owner | Blocks slice |
|---|---|---|
| Stack confirmation (this doc) | Tree / engineering | 1 |
| Hosting vendor + region + data residency | Engineering + founders | 2 (managed Postgres), deploy |
| Approved public copy, packages (names only is enough for slice 1) | Product / founders | 1 (content), 5 (catalog) |
| Staff identity method (MFA) | Engineering | 3 |
| Customer/driver identity provider (phone OTP likely needed) | Engineering | 4 |
| Screening source, lawful basis, appeal, retention | Legal / privacy | 4 (enabling eligibility) |
| Notification channel (SMS / WhatsApp / email) | Ops + engineering | 5 |
| Rates, payment provider, payment deadline, refund policy | Finance / legal | 6 |
| Storage vendor, photo retention | Engineering + legal | 7 |
| Launch date / pilot scope reconfirmation | Founders | All public promises |

## 8. Conflicts and risks found

See `docs/PACK_REVIEW.md` for the full review. The items that affect Phase 2 are:

1. **Timeline vs. scope.** The draft targets opening by end-November (≈11 days). Only slices 1–3 are achievable in that window without OPEN decisions; the full booking-and-payment flow is not.
2. **Phase numbering drift.** `IMPLEMENTATION_ROADMAP.md` uses Phases 0–8; `prompts/` uses 01–15. Map them before agents start citing "Phase N".
3. **Driver double-booking window.** Overlap is enforced only against *confirmed* intervals, so a driver can accept two overlapping offers while both await payment.
4. **Source PRDs missing.** The two `.docx` sources aren't in the pack, so requirement wording can't be re-checked.
5. **TypeScript 7 tooling maturity.** Verify at scaffold before committing to it.

## 9. Exit statement

Phase 1 exit is met for a greenfield repo. Another engineer can read this file and start Phase 2 once ADR 0001 (stack + hosting direction) is accepted. Nothing has been verified about runtime behaviour because no code exists.
