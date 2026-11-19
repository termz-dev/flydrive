# Flydrive Product Requirements Document

**Status:** Product baseline; proposed details are labeled and OPEN decisions must not be invented. The Flydrive working draft is the latest pilot reference.

## 1. Product mandate

Flydrive helps private vehicle owners arrange a highly vetted professional driver for an agreed duration. The company coordinates screening, suitable-driver selection, driver acceptance, full payment, operations verification, booking confirmation, handover and support. This is not point-to-point ride hailing. A visitor who needs Flydrive to source both a car and driver is a separate future/gated path.

## 2. Goals and measures

- Let a customer request a driver for the customer's own authorized vehicle in Lagos or Ibadan.
- Show suitable candidate profiles with only approved pre-payment fields.
- Preserve customer selection and driver accept/decline as separate steps.
- Take full payment only after acceptance; confirm only after operations verifies authoritative payment evidence.
- Record separate pickup/return condition confirmations, notes, photos and disagreements.
- Provide an operations dashboard for eligibility review, availability, booking/payment queue, replacement/refund, incidents and audit.
- Track completed bookings, repeat paying customers and referrals separately; also request, acceptance, confirmation, completion and exception rates.

Working draft target: 10 initial December 2026 bookings and opening by end-November 2026. As of 19 November 2026, founders must reconfirm schedule, budget, pipeline, driver supply, coverage and dependencies. This is not a public commitment.

## 3. Users and surfaces

- **Customer/authorized user:** needs a trusted driver for own vehicle for errands, events, routine or temporary need; wants clear schedule, choice, payment and support.
- **Driver:** needs complete assignment terms before accepting, accurate status and operations contact.
- **Operations:** coordinates real availability, payment evidence, confirmation, support, replacement/refund and safety response.
- **Compliance reviewer:** makes restricted decisions with reasons and audit.
- **Public visitor:** needs service, locations, process and eligibility information.

Required surfaces: multi-page public website, customer web portal, driver responsive web portal and operations dashboard. Native driver app is deferred.

## 4. Public information architecture

Separate navigable routes: home (`/`); services and package detail (`/services`, `/services/[package]`); how it works; trust/safety; Lagos and Ibadan; visitors; drivers and driver application; about; FAQ; contact; privacy; terms; 404. Shared nav/footer are fine. A single long page with anchor links is not sufficient.

Each route has meaningful page-specific content, metadata, responsive layout, keyboard/screen reader support, visible form labels/errors, loading/empty/error states where dynamic. No unverified numerical proof or testimonials. Legal pages require counsel approval. Visitor page must state customer-provided vehicle for pilot and not imply cars are available.

## 5. Packages and operational rules

Working catalog: half-day, full-day, weekly (six working days), monthly/longer (daily resumption or live-in), weekend (Friday to Monday morning), and custom operations quote. Exact hours, rest/break, monthly definition, weekend cutoff, rates/fees are OPEN. Do not publish made-up values.

Standard notice is three days. Requests inside three days go to operations for a manual availability check; never auto-confirm or imply availability. Intake: dates/times, pickup, duties, purpose/itinerary, vehicle/transmission, passenger requirements, schedule and accommodation when relevant. Out-of-state overnight work requires sleeping and freshening accommodation; meals are not required. Customer pays fuel/tolls/parking/washing; driver pays transport to assignment. Disclose approved terms before payment. Multiple vehicles/passengers need renewed suitability and authorization review when changed.

## 6. Customer booking flow

1. Customer signs in and submits request for customer-provided/authorized vehicle.
2. Server validates date, area, package, schedule, vehicle and required details. Under-three-day request enters operations review.
3. Show suitable drivers with no overlapping confirmed assignment. Before payment, show only first name, blurred photo, experience years and accurate training status. Pilot training is deferred; show “Pending” if shown.
4. Customer selects one candidate. Selection is not assignment confirmation.
5. Selected driver reviews complete assignment and accepts/declines. Decline returns customer to alternatives without charge. No silent substitution.
6. After acceptance, collect full payment through configured real provider. Pending/failed/unknown is not confirmation.
7. Operations verifies authoritative provider/settlement evidence. Only then confirm and reveal additional approved profile fields.
8. After confirmation collect meeting-point address and a phone number driver can call; required fields/deadline are OPEN.
9. Customer and driver separately confirm pickup/return vehicle condition, notes and photo option. Changed vehicle requires new authorization/suitability review; disagreement routes to handler.
10. If paid driver becomes unavailable, customer chooses replacement or refund; customer approval is required for replacement.

## 7. Driver eligibility and safety

Pilot draft requires verified identity, driver's licence and guarantor. User also says Flydrive conducts background checks. Screening sources, lawful basis, criteria, adverse-decision review/appeal, retention and expiry are OPEN. Never expose raw check details. Training is pending/deferred. Future assessment uses FRSC and applicable road rules; maximum two attempts, but pass mark, assessor, format and policy require approval.

Preferences (female-driver, transmission, long-distance experience) are requests, not guarantees. A named handler is assigned to confirmed booking. Safety escalation is immediate and separate from ordinary replacement. No 24/7 promise until staffed. Proposed strike policy remains human reviewed; evidence, both parties heard, operations-lead decision, rationale and review route. Good-faith reports or refusal of unsafe work are never a strike. No automatic consequences before approval.

## 8. Money, changes and payout

Full customer payment after driver acceptance. Ops verifies provider evidence before confirmation. Fixed rates only after approval; custom work is quoted; show approved extras before payment. Timeout/unknown requires reconciliation.

Draft payout is 50% at verified arrival and 50% at completion; longer/monthly work weekly. Triggers, proof, first-week timing, reversal and provider are OPEN. One pre-start reschedule is proposed; a second may close booking with proposed 50% refund. Early termination keeps package price unchanged and unused hours do not transfer according to draft. These terms require business/legal approval before enforcement or publication.

## 9. Operations capabilities

Driver check cases and review history; availability and overlap check; booking queue and urgent review; customer selection/driver response; payment pending/unknown/verified; confirmation; named handler; post-payment details; handover disagreements; replacement/refund choice; incident and resolution. Staff roles and sensitive data access are scoped/audited.

## 10. Out of pilot

Confirmed vehicle sourcing/rental; live GPS/geofence; GPS overtime; native apps; automatic strike/rotation; automatic insurance binding; uncontracted integrations; unapproved prices/payouts; guaranteed emergency or 24/7 support. Keep disabled until decisions/evidence exist.

## 11. Quality requirements

Provide responsive accessible routes, server-side object authorization, boundary validation, transactional state changes, migrations, idempotent effects, private evidence storage, redacted logs, audit, monitoring and recoverable errors. Availability, retention, RPO/RTO, device matrix, performance budget and support hours need owners/values before launch.
