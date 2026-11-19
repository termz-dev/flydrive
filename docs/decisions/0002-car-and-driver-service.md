# ADR 0002 — Car + driver offered as a service

- **Status:** Accepted
- **Owner:** Tree (Tree Augmented), on behalf of the Flydrive founders
- **Date:** 2026-11-19
- **Scope:** Public website and product scope

## Context

The pack (PRD §1, §10; `docs/OPEN_QUESTIONS.md`; AGENTS.md) kept "visitor car + driver"
as a future, gated path until supplier, inventory, insurance, deposit, damage and pricing terms
were decided. The Flydrive design canvas (Claude Design, Nov 2026) presents car + driver as a
headline service alongside driver-only, with its own page at `/services/car-and-driver`.

On 19 Nov 2026 the owner confirmed car + driver is approved and should be shown as a live service.

## Decision

- Car + driver is a first-class Flydrive service. Every package can be booked driver-only (the
  customer's car) or car + driver (a vehicle Flydrive arranges).
- The public site shows it in the navigation, the home page, a dedicated `/services/car-and-driver`
  page, the visitors page, the FAQ and the location pages.
- Vehicle classes shown: saloon, SUV and minivan, as in the design.

## Still OPEN (not decided by this ADR)

These stay "being finalised" in public copy and must not be invented:

- Vehicle supplier(s), fleet size and availability, passenger capacity per class
- Pricing, security deposit, fuel/toll/parking policy for car + driver
- Damage liability, insurance cover and claims process (no cover claims until contracted)
- Vehicle handover/return terms and late-return policy

## Consequences

- Online booking is still not open, so the site invites contact rather than booking.
- Phase 3 (data model) must add supplier vehicles, vehicle classes and vehicle reservations
  with an overlap constraint mirroring driver availability. The `booking_requests` table needs a
  `vehicle_source` (`customer` | `flydrive`). Handover applies to both.
- `docs/OPEN_QUESTIONS.md` moves the visitor car + driver item from "keep gated" to "approved;
  terms open".

## Revisit when

Supplier contracts, pricing and cover terms are agreed; or if supply can't support the demand the
site generates.
