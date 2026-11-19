# Domain Model and Database Schema

**Status:** Logical proposal, not migration SQL. Verify legal basis, provider fields and retention before production migrations. Customer-provided vehicles are pilot core; supplier vehicles and GPS tables are future/gated.

## Vocabulary and state model

Customer, vehicle, driver, verification case, booking request, candidate, driver offer, assignment, payment review, handover, support/incident. A driver offer is distinct from customer candidate selection; assignment is distinct from payment/booking confirmation.

```text
Booking: draft -> requested -> matching -> candidate_selected -> driver_accepted
          -> payment_pending -> payment_verified -> confirmed -> in_service -> completed
Branches: urgent_ops_review | no_candidate | driver_declined | payment_failed
          | payment_unknown_reconcile | cancelled | replacement_pending
          | refund_pending -> refunded | disputed
Verification: not_started -> pending -> verified | needs_review | rejected | expired | unavailable
Offer: prepared -> sent -> accepted | declined | expired | withdrawn
Handover: pending -> customer_confirmed + driver_confirmed -> agreed | disputed
Payment: created -> requires_action -> processing -> succeeded | failed | unknown
         -> ops_verified (separate staff decision) -> refunded as provider confirms
```

Every transition is an authorized command with current version, preconditions, transaction and audit event. Provider success is not staff verification. Unknown is not failed. Exact state names may be refined without changing semantics.

## Relational schema proposal

Use UUID IDs, UTC timestamps, `version` on mutable aggregates, restrictive FKs for financial/audit history. Deletion follows approved retention/anonymization policy.

| Table | Purpose / constraint |
|---|---|
| `users`, `roles`, `user_roles` | Auth subject unique; scoped role grants; no passwords; every grant audited. |
| `customer_profiles` | Minimal contact/preferences and notice/consent version. |
| `vehicles`, `vehicle_authorizations` | Customer scope, masked descriptors, authorization status, restricted evidence reference; no raw registration unless approved. |
| `driver_profiles` | User scope, approved public fields, experience and capabilities with evidence. |
| `verification_cases` | Subject/purpose/provider/reference/status/check/expiry/minimal result/reviewer/reason; no public fields/raw biometric template. |
| `guarantor_links` | Driver, guarantor contact reference, instrument/version, acceptance and state; minimize identity duplication. |
| `availability_blocks` | Driver interval and reason scope; prevent confirmed overlap. |
| `service_products`, `price_rules` | Package/rate version and publication state; only approved schedules/rates publish. |
| `quotes`, `quote_lines` | Immutable amount, currency, fee lines, expiry and accepted terms version. |
| `booking_requests` | Customer, vehicle, interval/timezone, service area, package, validated request fields, state/version, idempotency. |
| `driver_offers` | Booking, driver, details version, expiry/response; one current selection per request. |
| `assignments` | Booking/driver/interval/status and policy version. |
| `payment_intents`, `payment_reviews` | Provider state/ref/amount/currency/idempotency; separate reviewer/outcome/evidence/reason. Never card PAN/CVV. |
| `financial_entries` | Append-only charge/refund/payout; corrections by reversal entries. |
| `webhook_inbox` | Provider/event ID unique, signature result, times, safe payload hash/ref. |
| `handover_sessions`, `handover_confirmations` | Booking/assignment/vehicle/phase/change sequence; separate actor responses with immutable history. |
| `private_files` | Object key/checksum/type/size/purpose/status/scope/retention; private only. |
| `support_cases`, `incident_events` | Booking/category/handler/severity/status/resolution; restricted details. |
| `notification_outbox` | Event/recipient/channel/template version/attempt/delivery state/retry. |
| `audit_events` | Actor/action/subject/reason/time/correlation/redacted diff; append-only/restricted. |

Do not create supplier allocation, location sample, geofence or insurance tables unless approved ADR requires them.

## Invariants

- Every query enforces actor scope; IDs are not authorization.
- One booking has at most one active assignment; one driver has no overlapping confirmed intervals. Use transaction/locking plus database constraints/exclusion strategy.
- Only eligible driver can receive/accept offer; recheck eligibility, expiry and availability at acceptance.
- Only one selected active offer per booking. Concurrent accept has at most one winner.
- Confirmation requires driver acceptance, authoritative provider success and separate authorized ops verification.
- Restricted profile fields cannot be fetched before confirmation and policy approval.
- Handover agreement requires each party's own confirmation; no impersonation.
- Amount is immutable per payment attempt; changed quote requires new version/acceptance.
- Same idempotency key/body returns original result; changed body conflicts.
- Audit/financial corrections append; never overwrite.

## Time and migrations

Store UTC instants; persist `Africa/Lagos` for schedule interpretation. Money is integer minor units plus currency. Use expand-migrate-contract; resumable backfill; migration from empty and previous supported DB; never destructive startup migration. Financial, audit and operational history cannot be hard-deleted without approved privacy process.
