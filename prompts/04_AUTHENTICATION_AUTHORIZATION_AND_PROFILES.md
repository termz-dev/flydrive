# Phase 4 — Authentication, Authorization and Profiles

Apply master prompt. Use selected contracted identity provider; otherwise implement adapter boundary and honest not-configured state, never fake production login.

Implement customer, driver, operations and restricted compliance/finance permissions. Separate authentication from authorization. Define permission matrix and enforce server-side on every API/page-data request. Build minimal customer profile, customer vehicle/auth status, driver profile and staff mapping; isolate sensitive fields. Vetting, payment verification, refund and export require distinct permissions/reasons and audit.

Acceptance: anonymous/suspended/wrong-role denial; customer A cannot access B; driver A cannot access B offers; non-finance ops cannot refund; guessed IDs do not reveal cross-scope existence; sessions can be revoked; staff MFA/step-up comes from selected provider and is documented; errors/logs contain no secrets/PII.

Add positive and negative authorization tests for each implemented resource. Report provider-configured vs app-enforced controls. No security claim without evidence.
