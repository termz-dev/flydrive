# Deployment and Operations Guidance

## Environments

Local uses synthetic fixtures and local/ephemeral DB/storage; external sends/payments disabled unless sandbox. CI isolated data and scoped short-lived credentials. Staging production-like with sandbox providers and no production personal documents. Production is isolated cloud account/storage/credentials with managed secrets, backups, alerts and release controls. Hosting/region/data residency/cost/RPO/RTO remain OPEN.

## Configuration and release

Validate required config at process startup; fail readiness if enabled feature lacks valid config. `.env.example` contains names/descriptions only. Secret manager stores scoped/rotated values. Feature flags default OFF until policy/provider/reviewer readiness; flags don't hide defects.

Release: reproducible build from reviewed commit/lockfile; run applicable checks; immutable artifact metadata; review migration and forward recovery; run migration as controlled job (no app startup schema mutation); staging smoke incl unknown provider state; canary only after launch checklist; monitor errors/queues/reconciliation; app rollback separate from schema. Irreversible migration requires forward repair/customer recovery plan.

## Runbooks required

Payment unknown/duplicate callback/refund pending; screening provider unavailable/conflict; driver cancellation after payment; safety allegation and immediate risk; handover disagreement/damage; account takeover/privacy incident; notification outage/dead letters; DB failover/migration; backup restore; deletion job failure. Every runbook names owner, safe customer message, action limits, evidence references (not copied PII), escalation and closure.

## Launch checklist

- [ ] Founders/ops confirm current date, cohort, budget, pipeline, driver capacity and service hours.
- [ ] Multi-route public pages contain only approved packages/rates/terms/testimonials.
- [ ] Screening basis/sources/review/appeal/retention and manual fallback approved.
- [ ] Payment provider contracts/live credentials/callbacks/reconciliation verified; review permissions audited.
- [ ] Customer/driver terms, privacy notice, refund/reschedule and vehicle authorization approved.
- [ ] Handler coverage and immediate safety response staffed; no unstaffed 24/7 promise.
- [ ] Migrations, backup/restore, retention/deletion and access matrix reviewed.
- [ ] Critical e2e in intended environment; no fake provider behavior in prod.
- [ ] Alerts, runbooks, rollback/forward recovery and feature-disable path demonstrated.
- [ ] Unapproved features disabled and public copy makes no implied promise.
