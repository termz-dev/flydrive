# API Contracts

**Status:** Versioned REST proposal; implement OpenAPI schemas with approved business values. Do not return invented availability/prices.

## Contract rules

- Prefix `/api/v1`, HTTPS, JSON, secure session/token from selected managed identity.
- Validate path/query/body/content type. Client validation is usability only; repeat server-side.
- Authorize actor, object scope and sensitive fields on every endpoint. Review object/property/function authorization and sensitive business flows against [OWASP API Security Top 10](https://devguide.owasp.org/en/07-training-education/07-api-top-ten/).
- Require `Idempotency-Key` for booking, offer response, payment, refund, confirmation and other duplicate-sensitive actions. Same key/body returns same resource; changed body conflicts.
- Use version/ETag for stale updates. Stable cursor pagination and bounded page sizes. Return correlation ID.

## Error envelope

```json
{"error":{"code":"PAYMENT_STATUS_UNKNOWN","message":"We are checking the payment result. This booking is not confirmed yet.","retryable":false,"correlationId":"opaque-id","fieldErrors":[]}}
```

No stack trace, SQL/provider payload, screening detail or secret. Map validation 400/422, unauthenticated 401, forbidden 403, privacy-safe not found 404, stale/conflict 409, throttling 429, dependency unavailable 503. Unknown external result remains pending/unknown and reconciliation resource; do not call it success.

## Endpoint map

| Method and path | Actor | Intent / critical guard |
|---|---|---|
| `GET /service-products` | public | Only approved published packages/rules. |
| `POST /customer/vehicles` | customer | Register car and authorization evidence status. |
| `POST /booking-requests` | customer | Validate package/date/area/car/duties/passengers/schedule/accommodation/lead time; idempotent. |
| `GET /booking-requests/{id}` | scoped party | Return state and only fields allowed for actor and current state. |
| `POST /booking-requests/{id}/candidate-selection` | customer | Select one driver and create expiring offer; no charge/confirmation. |
| `POST /driver/offers/{id}/accept` | addressed driver | Recheck eligibility, expiry and no overlap transactionally. |
| `POST /driver/offers/{id}/decline` | addressed driver | Record decline, return to candidate choice. |
| `POST /booking-requests/{id}/payment-intents` | customer | Only after acceptance; amount calculated server-side. |
| `POST /webhooks/payments/{provider}` | provider | Verify signature/time/replay; persist unique inbox event; process idempotently. |
| `POST /ops/payment-reviews/{id}/verify` | finance/ops permission | Require authoritative evidence, reviewer, reason and fresh state. |
| `POST /ops/bookings/{id}/confirm` | ops permission | Require driver accept + provider success + separate verified review + current policy checks. |
| `GET /booking-requests/{id}/driver-profile` | scoped customer | Only limited pre-pay fields; extra approved fields only after confirmation. |
| `POST /assignments/{id}/handover-sessions` | assigned parties | Create authorized pickup/return record. |
| `POST /handover-sessions/{id}/confirm` | current party | Actor confirms only own side; private notes/photos validated. |
| `POST /ops/bookings/{id}/replacement-choice` | scoped customer/ops | Customer chooses proposed alternative or refund; no silent substitution. |
| `POST /ops/refunds` | approved finance/ops | Only approved policy/provider; idempotent, audited, reconcile unknown. |
| `POST /support-cases` | customer/driver | Only own booking; safety escalation follows separately staffed protocol. |

## Webhooks and errors

Verify signature over raw body, timestamp window/key version; persist provider event ID before processing; duplicate gets prior acknowledgement; out-of-order event cannot rewind state. Acknowledge only after durable receipt. Reconcile uncertain status through provider query/staff queue. Browser redirect is never payment proof.

Role map: customer sees own resources; driver sees own offers/assignments; ops permissions separately cover vetting, bookings, payment review, refunds, incident/safety and exports. Deny by default; high-impact staff actions require reason and audit.
