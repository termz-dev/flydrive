# Verification and Test Plan

Tests are part of implementation. They prove behavior, not vendor production availability, legal compliance or launch readiness. Use synthetic users/documents/addresses/payment refs.

## Layers

- Static: formatter, lint, strict TypeScript, dependency/security/license review, secret scan, migration checks.
- Domain/unit: transitions, eligibility, 3-day lead edge, timezone, overlap, quote version, idempotency, profile disclosure.
- Database: real ephemeral PostgreSQL, migrations from empty/prior schema, constraints, rollback, concurrent acceptance, outbox atomicity.
- API: OpenAPI/schema, permissions, errors, replay/idempotency, redaction, webhook signatures.
- Adapter: selected vendor sandbox/fixtures; these do not prove live credentials.
- End-to-end: request -> candidate -> driver accept -> payment -> ops verify -> confirmation -> handover -> completion/support on supported browsers and small screens.
- Security/privacy: object/property/function scope, privilege escalation, upload abuse, sessions, replay, rate limits, log redaction and deletion.
- Resilience/ops: timeout after possible provider success, duplicate/out-of-order callback, retry/dead-letter/recovery, restore, staff workflow and safety escalation drill.

## Critical scenarios

- Customer A cannot access B's profile, vehicle, booking, payment, photo, support or handover by guessed ID.
- Driver cannot see another driver's offers/check data; unauthorized ops cannot verify/refund/export.
- Pending/unavailable/expired/rejected required check fails server-side eligibility.
- Concurrent assignments cannot overlap; one offer can be accepted once.
- Customer selection does not charge/confirm. Decline/expiry returns to alternatives.
- Under 3 days routes to manual ops; no automatic confirmation.
- Full payment only after driver accept. Unknown stays unknown; no duplicate charge. Failed/unverified payment never confirms or reveals restricted profile.
- Ops confirmation requires authoritative provider evidence and verified review.
- Pre-payment profile includes only first name, blurred photo, years experience and accurate training status. Extra fields unlock only after confirmed payment review.
- Changed vehicle/passengers triggers renewed authorization/suitability review.
- Both parties independently confirm handover; duplicate submissions safe; disagreement opens handler case.
- Paid driver unavailable invokes customer choice; no silent replacement; refund isn't complete until provider confirms.
- Missing/corrupt/private photo cannot satisfy evidence; upload checksum verified.
- Provider outage never creates success in screening, payment, availability or notification.
- No GPS request/collection in pilot.
- Overnight out-of-state request cannot confirm without approved accommodation.
- Logs/analytics contain no sensitive data; deletion is auditable and resumable.

For each phase keep commit/environment/command/report/outcome/gaps. A unit fake is not live integration evidence. Skipped tests require owner, reason, mitigation and expiry. Coverage percentage isn't scenario evidence.
