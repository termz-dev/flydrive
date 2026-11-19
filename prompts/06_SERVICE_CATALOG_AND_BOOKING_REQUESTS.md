# Phase 6 — Service Catalog, Availability and Request Intake

Apply master prompt. Implement unpublished-by-default half-day/full-day, weekly (six working days), monthly/daily resumption/live-in, weekend Fri-Mon morning and custom quote catalog. Hours, cutoff, rates/fees are OPEN; never publish made-up values.

Build multi-step customer request: date/time, pickup, duties/purpose/itinerary, vehicle/transmission, passengers, schedule, accommodation when relevant, authorized vehicle. Persist drafts safely and preserve input on recoverable errors. Client validation helps usability; server schema is authoritative.

Rules: Lagos/Ibadan only when actual capacity verified; 3-day standard notice; shorter request -> ops availability review, never auto-confirm. Out-of-state overnight requires approved sleep/freshening accommodation; no meals required. Customer pays fuel/toll/parking/washing; driver pays transport to assignment. Disclose approved expense rules before payment. Multiple vehicle/passenger changes trigger suitability/authorization recheck. No quote unless approved rates exist; custom request goes to ops quote.

Test timezone/past date, unsupported area, accommodation missing, idempotent submit, changed-body key conflict, package change, urgent flow and low availability. Exit when request states and failure paths persist/are observable.
