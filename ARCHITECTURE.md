# Flydrive System Architecture

**Status:** implementation proposal based on the Flydrive pilot PRD. Validate framework and hosted services against repository and owner decisions before production. This pack does not include the earlier one-page website design.

## 1. Product architecture

Build a responsive multi-route web product and operations system that coordinates customers who provide their vehicle, eligible drivers, full customer payment, staff verification, documented handover and support. Every external result and booking status must be evidence-backed.

## 2. Proposed stack and tradeoffs

- **Web/runtime:** Next.js App Router + TypeScript on Node.js. One deployable modular monolith supports public pages and customer, driver and operations routes. Use Route Handlers for explicit HTTP/API boundaries; keep domain logic in application modules. Server Actions can support ordinary UI mutations only when equivalent validation/auth/idempotency apply. Payment/webhook boundaries use explicit handlers. This avoids premature service splitting. Official docs: [App Router](https://nextjs.org/docs/app), [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers).
- **Node:** use a currently supported LTS release and pin the major in CI/deployment; do not deploy Current/alpha. [Release policy](https://nodejs.org/en/about/previous-releases).
- **Database:** managed PostgreSQL, supported major, relational constraints and transactions. Add PostGIS only if real area/geo queries require it; this pilot has no live GPS. PostgreSQL major versions receive five years of support. [Version policy](https://www.postgresql.org/support/versioning/).
- **Data access:** proposal is Drizzle ORM with checked-in explicit migrations and raw SQL where locking/constraints need clarity. Confirm current tooling, PostGIS need and team experience in Phase 1; never obscure transaction boundaries behind an ORM.
- **Background work:** transactional outbox in PostgreSQL plus separate worker process in same codebase. Add managed queue only if measured backlog/throughput or isolation justifies it.
- **Files:** private object storage with short-lived scoped uploads/downloads, checksums and malware scanning where available. Never public buckets for identity/vehicle evidence.
- **Identity/integrations:** managed identity, payment, KYC/background screening, notifications, storage and hosting vendors remain OPEN. Wrap each behind adapters.
- **Hosting:** managed container/runtime with separate web and worker processes plus managed PostgreSQL. Vendor, region/data residency, cost and recovery objectives remain OPEN.

A modular monolith has fewer operational parts and supports pilot transactions. Module contracts and outbox preserve a path to extraction. Do not start with microservices, Redis, event sourcing or multiple databases without evidence.

## 3. Multi-page product routes

### Public pages

`/` home; `/services`; `/services/[package]`; `/how-it-works`; `/trust-and-safety`; `/locations/lagos`; `/locations/ibadan`; `/for-visitors`; `/drivers`; `/drivers/apply`; `/about`; `/faq`; `/contact`; `/privacy`; `/terms`; plus 404. Every page has its own URL/content, shared navigation/footer, responsive menu, metadata, accessible forms and clear states. Not one anchor-only scrolling page.

### Authenticated pages

- Customer: `/account`, `/bookings/new`, `/bookings/[id]`, `/bookings/[id]/payment`, `/bookings/[id]/handover`, `/support`.
- Driver: `/driver`, `/driver/offers/[id]`, `/driver/assignments/[id]`, `/driver/onboarding`, `/driver/availability`.
- Operations: `/ops`, `/ops/bookings`, `/ops/bookings/[id]`, `/ops/drivers`, `/ops/drivers/[id]`, `/ops/payments`, `/ops/incidents`, `/ops/audit`.

Route groups may share components, never authorization assumptions. Staff actions require granular staff permission; customer/driver resources are scoped to the actor.

## 4. Modules and ownership

1. **Identity & Access:** principal mapping, roles, scopes, sessions.
2. **Customer & Vehicle:** minimal profile, customer-supplied vehicle, ownership/authorization status. Supplier vehicle is gated.
3. **Driver & Verification:** profile, eligibility, identity/licence/guarantor/background-check cases, availability; evidence restricted.
4. **Catalog & Quote:** package options, approved versioned rate rules, immutable custom quote.
5. **Booking:** request intake, lead time, details/changes, customer selection, cancellations.
6. **Matching & Assignment:** candidate eligibility, overlap prevention, offers, accept/decline, assignment.
7. **Payments & Ledger:** provider references, full-payment state, staff verification, refunds/payouts; append-only with reversals.
8. **Handover:** separate customer/driver pickup/return confirmation, notes, private photos and disputes.
9. **Operations & Safety:** handler, queue, incident escalation, replacement/refund choice and audit.
10. **Notifications:** transactional outbox, templates and delivery states. Notification delivery never changes booking truth.
11. **Reporting & Audit:** operational metrics and append-only staff actions; no sensitive data by default.

Each module owns its tables, rules, application services and outward contracts. Cross-module requests use explicit services/events, not unrestricted table access.

## 5. Booking state and invariants

`draft -> requested -> matching -> candidate_selected -> driver_accepted -> payment_pending -> payment_verified -> confirmed -> in_service -> completed`

Branches: `urgent_ops_review`, `no_candidate`, `driver_declined`, `payment_failed`, `payment_unknown_reconcile`, `cancelled`, `replacement_pending`, `refund_pending`, `refunded`, `disputed`.

Only explicit transition commands change state. Validate actor, current version, policy, overlap and required evidence inside a transaction. Use optimistic version or row locks and DB constraints. Under-three-day requests route to operations and never auto-confirm. Driver acceptance is not confirmation. Provider payment success is not staff verification. Confirm only after authoritative payment evidence and authorized review.

## 6. Data and integration boundaries

- PostgreSQL is application workflow source of truth. Identity provider authenticates. Payment provider owns charge/refund result. Screening provider/approved reviewer owns check evidence. Each boundary has adapter and reconciliation plan.
- Persist UTC instants and service timezone `Africa/Lagos`; server time controls deadlines. Money is integer minor units + currency.
- Provider callbacks enter durable inbox; verify signature/time, dedupe event ID, process idempotently. External requests use idempotency, timeout and bounded safe retry.
- Outbox commits with local state; workers record attempts, provider ID/outcome and next action. Dead letters visible to authorized operations.
- Upload evidence stores private object key, metadata, checksum, status and access audit. Avoid unnecessary raw KYC copies.
- No live location/geofence, GPS overtime, insurer binding, supplier reservation or native app in pilot.

## 7. Error handling and observability

Typed categories: invalid input, unauthenticated, forbidden, not found, stale/conflict, rate-limited, dependency unavailable, dependency timeout/unknown, internal invariant. API envelope is in `docs/API_CONTRACTS.md`. Every request has correlation ID. Logs include module, actor class, duration, state transition, outcome/error code and safe provider reference hash; redact PII. Metrics: booking funnel/state age, offer accept/decline, overlap conflicts, unknown payment age, ops review backlog, vetting backlog, webhook/outbox failures, notification failures and incident response time. Agree owners/thresholds/service hours before launch.

## 8. Scaling path

Tune indexes/query plans, connection pooling, worker concurrency and read models before adding infrastructure. Add queue/cache/service only with evidence of throughput, failure-isolation need or independent ownership. Preserve module API contracts and data ownership. Partition/retention-plan only when data volume requires it. No location-table scaling work for a pilot that does not collect location.

## 9. Architecture decision records

Use `docs/decisions/NNNN-short-name.md`: owner, date, context, alternatives, decision, consequences, evidence and revisit trigger. Required: hosting/region, auth, payment, screening, messaging, storage/database tooling, package/rates, vehicle authorization, screening basis/appeal/retention, support/safety, worker classification, insurance and visitor vehicle sourcing.
