# Flydrive Build Pack — Review

**Date:** 19 November 2026 · **Reviewer:** Claude, for Tree Augmented · **Scope:** all 32 files in the Flydrive Implementation Pack

## Verdict

The pack is well built. It is strong on truthfulness rules, state separation (selection ≠ acceptance ≠ payment ≠ confirmation), authorization, idempotency and keeping undecided things undecided, and a coding agent following it will be hard to push into shipping fake behaviour.

Its main weakness is **proportion**. It specifies production-grade machinery (transactional outbox, webhook inbox, exclusion constraints, worker process, 15 phases) for a pilot of **10 bookings in December**, due to open in about 11 days, with almost every vendor and policy still OPEN. As written, the honest outcome by 30 November is a public site and a "register interest" form, not a bookable product.

Below: (A) a recommended pilot cut, (B) gaps and contradictions to fix in the pack, (C) smaller issues.

---

## A. Recommended pilot cut: "concierge pilot"

Ten bookings is few enough for ops staff to run by hand. Build the software for **intake, record-keeping and truth**, and let people do matching, payment chasing and driver contact until volumes justify automation.

| Layer | Pilot (by ~30 Nov – mid Dec) | Deferred until after 10 bookings |
|---|---|---|
| Public site | All 15 routes, approved copy, "Request a driver" and "Apply to drive" forms | — |
| Customer | Request form **without sign-up** (name, phone, email, dates, area, package, vehicle, duties, accommodation). Status page via signed link | Customer accounts, candidate comparison UI |
| Matching | Ops picks 1–3 vetted drivers in `/ops`, sends the customer a link showing the limited profile (first name, blurred photo, experience, training "Pending"); customer selects | Self-serve candidate list |
| Driver | Ops phones/WhatsApps the driver; driver accepts via a one-time signed link (records accept/decline with timestamp) | Driver portal, availability calendar |
| Payment | Provider-hosted payment link (or bank transfer) after acceptance; ops records provider reference and verifies in `/ops` (two-person rule optional) | Webhook inbox, automated reconciliation |
| Confirmation | Ops-only "Confirm" button guarded by: accepted offer + recorded payment evidence + verifier ≠ confirmer (optional) | — |
| Handover | Simple form via signed link for each party: condition notes + optional photo to private storage | Multi-day cadence |
| Ops | Staff login with MFA, booking board by state, driver vetting records, audit log | Refund automation, payouts, metrics dashboards |

What this keeps from the pack: every state is persisted and audited, nothing claims success without evidence, the limited-profile rule is enforced server-side, and there's no fake payment. What it drops: things that only pay off at volume.

**Decisions needed this week for this cut:** pilot go/no-go and date; package names and whether prices are shown or quoted; payment method (hosted link provider or transfer) and who verifies; driver vetting manual procedure and who reviews; ops contact hours; privacy notice and terms (even interim versions from counsel).

---

## B. Gaps and contradictions

### B1. Driver can be double-booked between acceptance and payment — *high*
`DOMAIN_MODEL_AND_SCHEMA.md` and `API_CONTRACTS.md` enforce "no overlapping **confirmed** intervals" and recheck overlap at acceptance against confirmed assignments only. A driver can therefore accept two overlapping offers that both sit in `payment_pending`; whichever confirms second fails late, after the customer has paid.
**Fix:** acceptance creates a **tentative hold** (`availability_blocks` with `kind = hold`, `expires_at = payment deadline`), included in the exclusion constraint. Confirmation converts the hold to firm; expiry or payment failure releases it. This also requires the **payment deadline** decision (B2).

### B2. No payment deadline or offer-expiry states at booking level — *high*
Offers have `expired`, but the booking state machine has no `offer_expired` / `payment_expired` transition, and the payment deadline is OPEN with no interim rule. Without one, a driver can be held indefinitely.
**Fix:** add `payment_expired → matching` (or `→ cancelled`) and a configurable deadline that defaults to an ops-confirmed manual expiry until Finance decides.

### B3. Return transitions are undefined — *medium*
Branches are listed (`driver_declined`, `no_candidate`, `payment_failed`, …) but not where each goes next. E.g. does `driver_declined` return to `matching` with the declined driver excluded? Does `payment_failed` keep the driver's hold?
**Fix:** add a transition table (from, command, actor, guard, to) to `DOMAIN_MODEL_AND_SCHEMA.md`. Agents will otherwise invent these.

### B4. Two ops steps where one may do — *low/decide*
`payment_verified` and `confirmed` are separate states, each needing a staff action (`/ops/payment-reviews/{id}/verify` then `/ops/bookings/{id}/confirm`). If this is meant as a four-eyes control, say so (verifier ≠ confirmer). If not, merge into one guarded command to halve ops clicks.

### B5. Notifications block the core flow but are treated as a late phase — *high*
Driver accept/decline (prompt 07) needs the driver to *know* about the offer, but notifications arrive in prompt 12 and the channel is OPEN. In Lagos/Ibadan, SMS and WhatsApp are far more reliable than email or portal polling.
**Fix:** decide the channel early; until then, document the manual step ("ops contacts driver") as an explicit, audited action in prompt 07.

### B6. Auth is a hard dependency for almost everything — *high*
Customer must "sign in" before requesting (PRD §6.1), and drivers need portal logins, yet the identity provider is OPEN and sits in prompt 04. Every later phase blocks on it.
**Fix:** allow request intake without an account (contact details + verified phone or email), and use signed, expiring, single-purpose links for selection, driver response and handover in the pilot. Note that phone-number OTP is probably required for drivers.

### B7. Customers call an `/ops/...` endpoint — *low*
`POST /ops/bookings/{id}/replacement-choice` lists "scoped customer/ops" as actor. Mixing customer actions into the ops namespace invites authorization mistakes.
**Fix:** split into `POST /booking-requests/{id}/replacement-choice` (customer) and an ops proposal endpoint.

### B8. Missing endpoints — *medium*
The endpoint map lacks: public driver application and contact/interest forms; driver availability CRUD; booking cancellation (customer and ops); custom-quote creation and acceptance; ops candidate shortlisting for urgent requests; support case listing; vehicle-change request. Prompts reference several of these.

### B9. Payouts have no home — *medium*
PRD §8 describes 50/50 driver payouts and `financial_entries` covers them, but no prompt implements or explicitly defers payouts. Prompt 11 only says "earnings only if payout rules are approved".
**Fix:** state in the roadmap that payouts are handled outside the system (manual transfer + ledger entry by finance) for the pilot.

### B10. Referral metric isn't capturable — *low*
PRD §2 tracks referrals, but no schema field records referral source/code.
**Fix:** add `acquisition_source` / `referral_code` to `booking_requests` or `customer_profiles`.

### B11. Phase numbering drift — *medium*
`IMPLEMENTATION_ROADMAP.md` runs Phase 0–8; `prompts/` runs 01–15; `README.md` lists the prompt numbering. Prompt 02 says "approved Phase 1 assessment" (prompt numbering), but roadmap "Phase 1" is the foundation. Agents and people will mix them up.
**Fix:** add a mapping table to the roadmap, or renumber it to match prompts.

### B12. Public site arrives late but is the only thing launchable soon — *medium*
Prompt 10 (public site content) comes after payments and confirmation. Given the date, pull approved public copy into the foundation slice (prompt 02) so the site can go live first with truthful interest forms.

### B13. Source documents aren't in the pack — *low*
`SOURCE_TRACEABILITY.md` cites `Flydrive_PRD.md.docx` and the Lagos brief as authoritative, but neither is included. Include them (or excerpts) so agents and reviewers can check wording.

---

## C. Smaller notes

- **Lagos → Ibadan is interstate** (Lagos State → Oyo State). Any overnight Lagos–Ibadan job triggers the "out-of-state accommodation" rule; make sure ops and copy treat that as normal, not an edge case.
- **Privacy law:** name the regime the legal review is against (Nigeria Data Protection Act 2023 / NDPC guidance) so "obtain Nigerian privacy review" becomes concrete. Guarantor data is third-party personal data and needs its own notice.
- **Blurred photo:** say how. Server-side blur at upload, stored as a separate derivative, so the unblurred object is never sent before confirmation. Otherwise CSS blur may leak the original.
- **Driver supply realism:** the candidate step assumes several vetted, available drivers per request. With a small pool, the customer may often see one candidate. Add copy and UI for "one suitable driver found".
- **Currency:** state NGN and kobo explicitly as the pilot currency.
- **TypeScript 7 / tooling:** see `REPOSITORY_ASSESSMENT.md` §2. Check Next 16 + typescript-eslint support before pinning.
- **Low-bandwidth targets:** the PRD mentions low bandwidth but sets no budget. Suggest page weight ≤ 300 KB on public pages and no client-side JS required for forms (progressive enhancement).
- **Over-engineering watch:** outbox + webhook inbox + worker are correct long-term, but for the concierge pilot a synchronous provider call plus a manual ops reconciliation queue is enough. Record that as an ADR rather than silently skipping it.

## Suggested next actions

1. Founders confirm: go/no-go for a December pilot, and accept or reject the concierge cut (§A).
2. Tree accepts ADR 0001 (stack, from `REPOSITORY_ASSESSMENT.md`), then Phase 2 (foundation + public site) starts.
3. Patch the pack for B1–B3, B5, B6 and B11 before prompts 06–09 are run.
