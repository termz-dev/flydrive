# Phase 5 — Driver Onboarding and Vetting

Apply master prompt. Implement driver registration/profile and separate identity, licence, guarantor and approved background-check cases with status history, expiry, reviewer and reason. User says Flydrive conducts background checks; actual source, lawful basis, criteria, review/appeal and retention remain OPEN. Don't invent details or deny based on unapproved data.

If provider isn't selected, implement explicitly manual operations workflow with evidence reference/status/reviewer/reason; do not imply provider verification. If selected, typed adapter, contract tests and reconciliation; secrets server-only. Driver sees actionable status, not confidential notes. Candidate data stays minimal. Training/assessment is deferred; show `Pending`, never complete.

Server eligibility requires every approved required check; pending/unavailable/unknown/expired fails closed. Test duplicate/recheck, expiry, timeout, conflicting results, unauthorized reviewer, appeal history, sensitive-read audit. Preserve prior decisions. Exit only when ineligible driver cannot reach candidate/offer/accept paths and reviewer can understand decision.
