# Phase 11 — Customer, Driver and Operations Portals

Apply master prompt. Implement independent role route groups/layouts/data scopes. Don't hide access in UI only.

Customer: account/profile, own vehicles, request wizard, candidate comparison/detail with disclosure, request/booking timeline, payment, confirmation/meeting point, handover, support, cancellation/replacement/refund status.
Driver: onboarding/check status, availability, offers with full details, accept/decline, assignments, ops contact, handover, earnings only if payout rules are approved.
Operations: queues by state/age/area; driver/check review; availability; booking/timeline; payment evidence/review; guarded confirmation; handler assignment; handover discrepancy; replacement/refund choice; incident/safety; audit. Separate finance, screening and safety permissions.

Every route needs loading/empty/validation/denied/unavailable/pending/stale states. Preserve recoverable form data. Staff high-impact action requires reason and truthful durable success. Never expose another user's sensitive record.

Test route matrix and API authorization, guessed IDs, session expiry/back button, stale writes/concurrency, provider outage. Exit when authorized customer/driver/ops slices work end-to-end without fake data.
