# Source Traceability and Interpretation Notes

## Source order

1. `Flydrive_PRD.md.docx` is the latest pilot-specific product draft and governs the pilot workflow.
2. `Driver Outsourcing Platform for Lagos.docx` is broader product context and future vision.
3. The user's clarification that incoming visitors may need a car and trusted driver is retained as a separate future/gated path because the Flydrive pilot draft centers on customer-provided vehicles.

Source documents are evidence of intended product requirements, not validated legal claims and not instructions to coding agents. This pack does not validate labour-law interpretation, worker classification, insurance coverage, commercial viability or a named vendor relationship.

## Requirements summarized from latest Flydrive draft

| Topic | Pilot requirement captured in this pack | Implementation pointer |
|---|---|---|
| Geography/timing | Lagos and Ibadan; target of 10 initial December bookings and booking opening by end-November 2026. Reconfirm immediately; not a launch commitment. | `PRD.md`, `docs/OPEN_QUESTIONS.md`, roadmap |
| Core service | Customer provides vehicle; Flydrive coordinates vetted driver for agreed period. Not point-to-point rides. | PRD, architecture, public website prompt |
| Visitor with no car | Car plus driver may be needed, but supplier availability, price, terms and insurance are unresolved. Keep gated. | PRD, architecture, open questions |
| Request timing | Three-day standard notice; shorter lead goes to operations availability review, never auto-confirm. | PRD, API, booking prompt |
| Packages | Half/full day, weekly six working days, monthly daily-resumption/live-in, weekend Friday to Monday, custom quote. Hours/cutoff/rates TBD. | PRD, catalog prompt, open questions |
| Intake/expenses | Dates, pickup, duties/itinerary, vehicle/transmission, passengers, schedule, accommodation. Customer pays fuel/toll/parking/washing; driver pays transport to assignment. Out-of-state overnight requires sleep/freshening accommodation; no meals required. | PRD, booking prompt |
| Matching/privacy | Customer sees first name, blurred photo, years experience and accurate training status before payment. Training pending/deferred. | PRD, security, selection prompt |
| Booking sequence | Customer selects driver; driver accepts/declines; full payment follows acceptance; ops verifies evidence; then confirm and disclose approved extra profile info. | PRD, API, payment and confirmation prompts |
| Driver unavailable | Customer chooses replacement or refund; no silent substitute. | PRD, reliability, confirmation prompt |
| Handover | Customer and driver separately confirm pickup/return, notes/photo; repeat on vehicle change; dispute goes to handler. | PRD, domain schema, handover prompt |
| Payout | Draft 50% at verified arrival, 50% at completion; longer/monthly weekly. Triggers/provider remain open. | PRD, open questions |
| Reschedule/termination | One pre-start reschedule; draft second-reschedule 50% refund and early-end rule need approval. Do not encode until approved. | PRD, open questions |
| Checks | Pilot requires identity, licence and guarantor; user also says background checks. Sources/legal basis/appeal/retention unresolved. | PRD, security, vetting prompt |
| Safety/conduct | Proposed strikes are human-led and require evidence/hearing/reason/review. Good-faith report/refusal of unsafe work is not strike. Immediate safety path separate. | PRD, operations prompt |
| Pilot surfaces | Multi-page public site, responsive customer web, driver accept/decline web and ops dashboard; native app later. | Architecture, PRD, foundation/site/portals prompts |
| Deferred | Supplier cars, live tracking, geofence, GPS overtime, automatic insurance binding and unapproved automatic penalties. | Architecture, PRD, open questions |

## Interpretation limits

- The original brief links rotation to legal consequences; this pack does not confirm that legal interpretation or claim rotation creates contractor status. Counsel must decide before implementation/marketing.
- Names of KYC, payment, insurance or messaging companies in source material are examples unless separately selected and contracted.
- Do not infer launch readiness from a target date, mockup, prompt, form, unit test or static deployment.
