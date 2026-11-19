# Implementation Roadmap

Sequence is a proposal; finish each exit evidence before dependent production paths. Revalidate target date/capacity with founders.

## Phase 0 — Discovery and decisions
Inspect repository/worktree/dependencies/routes/DB/auth/tests/CI/deploy without changing files. Map PRD to current/new modules. Confirm schedule, capacity and operating terms. Record ADRs and OPEN owners.
**Exit:** repo assessment, stack direction, requirements map, decision owners, safe plan; no user work overwritten.

## Phase 1 — Foundation and multi-page shell
Reconcile app structure, TypeScript/lint/CI/config validation/logging/error boundaries/shared navigation. Add public route skeletons, customer/driver/ops route groups, accessible 404 and truthful disabled CTA.
**Exit:** each page is a separate reachable route; local setup and static checks reproducible; no fake booking success.

## Phase 2 — Persistence and authorization
Migrations, core aggregates, state transition services, database constraints, audit, authorization primitives and scoped repos.
**Exit:** migration from empty/prior version, rollback/forward plan, transition/concurrency and access tests.

## Phase 3 — Driver onboarding/vetting
Verification cases, driver portal status, reviewer queue; provider adapters or approved manual process. Training remains pending.
**Exit:** ineligible drivers can't be offered; history/reviewer audit; provider outage truthful.

## Phase 4 — Request, availability, candidate choice/response
Approved catalog config, request wizard, 3-day urgent queue, candidate suitability, limited profile, customer selection, driver accept/decline and overlap protection.
**Exit:** no charge/confirm on selection/decline; state and concurrency evidence.

## Phase 5 — Payment and confirmation
Real selected provider, idempotent full charge after acceptance, webhook inbox/reconciliation, separate staff review, confirmation and post-payment profile disclosure.
**Exit:** sandbox/target environment evidence, unknown-state recovery, duplicate handling, no confirm before review.

## Phase 6 — Handover/support/exception
Separate party confirmations, private evidence, assigned handler, disagreement, safety route, customer choice replacement/refund. Activate refunds only after approval.
**Exit:** exception and safety procedure rehearsed; no silent substitution.

## Phase 7 — Complete role portals and public site
Finish customer, driver and ops routes; approved page copy, accessibility, mobile/low bandwidth states, role matrix and form recovery.
**Exit:** route/access review and real end-to-end authorized flow.

## Phase 8 — Readiness/pilot
Vendor/contracts/terms/privacy, security review, alerts, backup restore, runbooks, staff, rollback/forward recovery, provider smoke tests and go/no-go.
**Exit:** named owners sign checklist; unresolved capabilities disabled; capacity/support staffed.

## Later, separate approval
Supplier vehicle path, native app, tracking/geofence, overtime, insurer binding, training assessment, strike/rotation automation, fleet accounts and new cities. Measure before adding infrastructure/services.
