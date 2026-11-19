# Phase 8 — Payment and Operations Verification

Apply master prompt. Block live charge until Finance selects provider, fee/rate/deadline, authoritative evidence, refund policy and reviewer permissions. If unresolved, show payment unavailable/manual pilot state and do not confirm.

With approved provider, implement server-calculated full amount after driver acceptance; hosted/tokenized flow when supported; idempotent payment intent; signed webhook inbox; duplicate/out-of-order handling; status query/reconciliation; staff review record. Never collect card data directly. Browser redirect is not proof; provider success alone is not ops verification.

Pending remains not confirmed. Failed may retry only with provider evidence no charge and safe idempotency. Unknown/timeout never triggers another charge; reconcile. Provider success queues operations review. Authorized operations verifies authoritative provider/settlement record, reason and audit. Only then can confirmation occur.

Test amount tampering, signature failure/replay, success with lost callback, duplicate submit, out-of-order event, unauthorized review, mismatch and refund ambiguity. Report sandbox vs live evidence separately. Exit with unknown-state recovery and no confirmation before staff review.
