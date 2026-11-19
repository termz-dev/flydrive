# Open Questions and Decision Register

No agent may convert OPEN items into production policy. Record owner decision/date/effective scope in ADR or approved policy. Use truthful disabled/manual behavior meanwhile.

## Product, launch and commercial

- **Founders — OPEN:** Is end-November opening/December pilot still intended? Confirm date, contingency, budget, pipeline, target cohort, driver supply and staffing; re-evaluate because timeline is close.
- **Operations — OPEN:** Exact Lagos/Ibadan boundaries, capacity, driver availability, coverage hours, urgent-request process and support contacts.
- **Product — OPEN:** Half/full-day hours, start time, breaks/overtime, weekly schedule/rest, monthly definition, live-in, weekend cutoff, booking horizon.
- **Product/Operations — OPEN:** Required intake fields, multi-car/passenger changes, post-payment contact details/deadline, multi-day handover cadence.
- **Finance/Legal — OPEN:** Rates, quote expiry, taxes/fees, night/interstate/overtime, fuel/toll/parking/washing, cancellation, early termination and reschedule/refund wording.
- **Finance — OPEN:** Payment deadline/provider/evidence, unknown reconciliation, payout trigger/proof/timing, chargebacks/refunds/reversals and weekly payout trigger.
- **Product/Operations — OPEN:** Female-driver preference availability, policy and fallback.

## Legal, safety and privacy

- **Legal — OPEN:** Driver engagement/classification. A 90-day rotation does not itself establish legal status. Obtain Nigerian employment counsel.
- **Legal/Privacy — OPEN:** Lawful basis/notices, screening sources/criteria, adverse review/appeal, retention/deletion/expiry and customer disclosure.
- **Insurer/Legal — OPEN:** Cover, parties/events/exclusions/limits/territory, binding trigger, claims and evidence. No cover promise without contract.
- **Ops/Safety — OPEN:** Handler staffing, emergency escalation, backup/overnight response, contact channel, incident triage and evidence preservation.
- **Ops/Legal — OPEN:** Strike policy evidence, hearing, authority, review/appeal, rating impact, interim safety pause; human-led until approved.
- **Ops/Legal — OPEN:** Vehicle ownership/authorization proof, reviewers, timing, access and retention.
- **Business/Legal/Insurance — OPEN:** Visitor car+driver model, supplier/inventory authority, class, deposit, damage/liability, insurance, pricing, return and agreements. Keep gated.

## Technical

- **Engineering — OPEN:** Auth, payment, screening, notification, storage, hosting vendor/region, cost and residency/transfer.
- **Engineering/Security — OPEN:** RPO/RTO, SLO, performance profile, device/browser matrix, upload limits, backup/restore, retention automation and on-call.
- **Product/Engineering — OPEN:** Any future tracking/overtime policy, source, consent, access, retention, dispute and billing evidence.
- **Product/Legal — OPEN:** Additional post-payment profile fields and reveal timing.

## Safe implementation proposals

Next.js/TypeScript modular monolith, PostgreSQL, explicit migrations, private object storage, managed identity, provider adapters and transactional outbox are proposals. Validate with repo/team. Agents may choose local names/component structure inside these boundaries. Record material changes as ADRs.
