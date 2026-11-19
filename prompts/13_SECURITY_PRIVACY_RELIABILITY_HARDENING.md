# Phase 13 — Security, Privacy and Reliability Hardening

Apply master prompt. Review implemented app against security/privacy/error docs, threat model and OWASP API risks; fix issues, don't report only.

Exercise auth/session, object/property/function authorization, CSRF/CORS, rate limits, uploads, webhooks, secret handling, output escaping, SQL boundary, PII in logs/URLs/analytics, audit immutability, exports and retention/deletion. Validate all environment/provider boundaries.

Reliability: provider timeout after side effect; duplicate/out-of-order callback; DB lock/transaction failure; outbox retry/dead-letter; notification outage; stale UI; form recovery. Unknown never converts silently to success/failure. Add runbooks and safe recovery actions. Confirm no GPS collection in pilot.

Deliver threat-model update, severity findings, fixes, residual risks with owners and exact evidence. Do not claim compliance/certification. Critical auth/payment/privacy/invariant issue blocks exit.
