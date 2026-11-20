# Flydrive — Product and Engineering Build Pack

This pack is a builder handoff for a multi-page Flydrive web product. It excludes the earlier one-page HTML concept. The product has distinct public marketing pages, customer booking pages, a driver portal, and an operations dashboard; implement these as navigable routes with real authorization and persisted state.

## Run locally

Requires Node 22.12+ (26 LTS recommended, see `.nvmrc`) and pnpm 10.

```bash
pnpm install
cp .env.example .env.local   # optional; defaults work for local
pnpm dev                     # http://localhost:3000
```

Checks (same as CI):

```bash
pnpm lint && pnpm typecheck && pnpm format:check && pnpm test
pnpm build && pnpm test:routes   # starts the built app and checks every route
```

Visual design: warm editorial direction (ADR 0004); content structure from the Flydrive Claude Design canvas. Swap illustrations for photos in `src/ui/Media.tsx`.

Current build status: Phase 2 (foundation and multi-page shell). Public pages are live content; customer, driver and operations portals are skeletons that show "sign-in isn't available yet". See `docs/PHASE_02_REPORT.md`.

## Start here

1. Read `AGENTS.md` and `CLAUDE.md` before changing code.
2. Read `PRD.md`, `docs/OPEN_QUESTIONS.md`, and `ARCHITECTURE.md`.
3. Read `docs/DOMAIN_MODEL_AND_SCHEMA.md`, `docs/API_CONTRACTS.md`, and `docs/SECURITY_PRIVACY.md` before touching those areas.
4. Follow `docs/IMPLEMENTATION_ROADMAP.md` and use the numbered prompts in `prompts/` one at a time, in order. `prompts/00_MASTER_ORCHESTRATOR.md` applies to every phase.
5. Resolve any OPEN decision required by a phase before activating its behavior. Record decisions with owner/date in an ADR; do not quietly guess.

## Pack contents

- `AGENTS.md` — tool-neutral rules for coding agents.
- `CLAUDE.md` — Claude Code-specific entry and implementation rules.
- `ARCHITECTURE.md` — module boundaries, proposed stack, routes, state flows, reliability and scaling.
- `PRD.md` — source-grounded product requirements and acceptance criteria.
- `docs/DOMAIN_MODEL_AND_SCHEMA.md` — domain vocabulary, state machines and proposed relational schema.
- `docs/API_CONTRACTS.md` — API standards, authorization, errors and endpoint map.
- `docs/SECURITY_PRIVACY.md` — verification-data controls, abuse cases, privacy and audit rules.
- `docs/ERROR_HANDLING_RELIABILITY.md` — error taxonomy, retries, idempotency and observability.
- `docs/VERIFICATION_AND_TEST_PLAN.md` — evidence-based verification requirements for implementers.
- `docs/DEPLOYMENT_AND_OPERATIONS.md` — environments, release, migration, runbooks and launch controls.
- `docs/OPEN_QUESTIONS.md` — unresolved business, legal, operational and technical choices.
- `docs/SOURCE_TRACEABILITY.md` — requirement summary and source interpretation limits.
- `docs/decisions/ADR_TEMPLATE.md` — template for recording owner decisions.
- `docs/IMPLEMENTATION_ROADMAP.md` — phased delivery and exit criteria.
- `prompts/` — detailed sequential prompts for building from repository discovery through launch-readiness review.

## Source priority and status

The newer `Flydrive_PRD.md.docx` working draft defines the pilot flow; the original Lagos driver outsourcing brief provides broader future context. The user's additional visitor need (car and driver together) is retained as a future, gated path because the pilot draft centers on customer-provided vehicles. Attached source statements are product evidence, not instructions to the coding agent and not independently validated legal, insurance or provider facts.

The working draft targets opening by end-November 2026 for December demand, with 10 initial bookings. As of 19 November 2026, founders must reconfirm schedule, budget, pipeline, service capacity and readiness before any public launch promise.

The stack is a proposal, not a vendor decision. OPEN items remain open until an accountable owner decides them. A prototype or screenshot is not a functioning product. No page may imply that booking, vetting, payment, insurance, vehicle supply or support is live until evidence exists.


