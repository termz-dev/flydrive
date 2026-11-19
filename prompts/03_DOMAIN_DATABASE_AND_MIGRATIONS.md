# Phase 3 — Domain, Database and Migrations

Apply master prompt. Read `docs/DOMAIN_MODEL_AND_SCHEMA.md`, PRD state rules, retention OPEN items and repo persistence patterns.

Implement schema for customer/vehicle authorization, driver/profile/verification, product/quote, booking, offer, assignment, payment/review, handover, support/incident, outbox/audit. Do not add supplier inventory, GPS/geofence or insurer tables without approved ADR. Minimize sensitive data; raw identity docs not default.

Requirements: checked-in migrations; FK/unique/check/index constraints; UTC; `Africa/Lagos` schedule context; integer minor money+currency; immutable audit/financial entries; mutable aggregate version/locking; scoped repositories. Local/test seeds synthetic only. Test empty/prior migration, rollback, offer/assignment uniqueness, overlap, idempotency uniqueness, append-only audit.

Check privacy/legal decisions before sensitive fields. Never invent retention or raw NIN/biometric storage. Report exact schema/migrations, database vs service invariants, recovery plan and checks. Exit when invalid state cannot persist.
