# Error Handling and Reliability

## Principles

1. Persist truth before success. Booking and money states come from durable server state and authoritative evidence.
2. Expected failures are typed and handled at boundaries; unexpected failures preserve cause/context, correlation ID and safe user message.
3. Never swallow exceptions, turn provider error into empty results, or treat timeout as clean failure. Timeout after request may mean effect occurred; reconcile.
4. Retry only idempotent or provider-idempotent operation. Bounded backoff/jitter, timeouts, max attempts and dead-letter/operations visibility.
5. UI distinguishes loading, empty, unavailable, pending, failed and confirmed; offer recovery without discarding input.

## Error categories

| Type | Example | Handling |
|---|---|---|
| Validation | bad schedule, unsupported area | 400/422 field errors; no partial write. |
| Auth/scope | expired session, other user's booking | 401/403 or privacy-safe 404; audit sensitive denial. |
| Conflict/stale | offer expired, driver overlap, stale version | 409 and refresh/reselect action; recheck inside transaction. |
| Provider rejection | declined charge, failed check | Persist category/reference; do not mark success. |
| Provider unknown | timeout after request, callback missing | Unknown/pending; reconcile; prevent duplicate action. |
| Invariant/data | impossible state, duplicate active assignment | Roll back, high-severity alert, preserve trace; never continue. |
| Internal | unexpected runtime error | Safe message + correlation ID; restricted redacted log; no details to client. |

## Required patterns

Validate config at startup; fail readiness for missing config of enabled feature. Disabled feature is honestly unavailable. Use request correlation across web/API/worker. Enforce transitions and overlap in DB transaction. Outbox external effects atomically with state; worker records attempts/outcome. Webhook inbox unique, durable, idempotent and ordered safely. Payment/refund/recheck reconciliation is restartable and visible; manual resolution requires permission/reason/audit. Readiness differs from liveness.

## Observability

Redacted structured log fields: timestamp, level, env, correlation, module/route, actor class (not PII), outcome/code, duration, state transition, safe provider reference hash. Metrics: request errors/latency, booking state age, offer accept/decline, overlap conflicts, unknown payment age, ops/vetting queue, webhook and outbox backlogs, delivery/upload failures and incident response time. Set thresholds, retention and owners before launch.
