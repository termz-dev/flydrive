# ADR 0001 — Car + driver as a main service

- **Status:** Proposed. Product direction set by founder; commercial and legal terms still OPEN
- **Owner:** Olajide (Tree) Oke, founder
- **Date:** 2026-11-19
- **Review trigger/date:** Before the first paid car + driver booking

## Context
The PRD and `docs/OPEN_QUESTIONS.md` treated "visitor car + driver" as a future, gated path, with the pilot centred on customer-provided vehicles. On 19 Nov 2026 the founder set the direction that Flydrive serves **both** people who have a car and people who need a car and driver. The approved designs (`design/`) present the two services side by side across the website and booking flow.

## Decision
- Car + driver is a first-class service in the product UI, routes, catalog and booking data model, alongside driver-for-your-car.
- The customer chooses a **vehicle class** (proposed: Saloon, SUV, Minivan). The specific vehicle is assigned by operations and confirmed with the booking.
- Until the OPEN items below are approved, car + driver requests go to operations manual review. There is no automatic vehicle allocation, and every unapproved term shows as a placeholder.

## Still OPEN (owner to decide and record)
- Vehicle supply: own fleet vs partner suppliers; supplier agreements and authority.
- Vehicle classes offered and passenger/luggage capacity per class.
- Pricing: vehicle component per package; quote rules.
- Fuel, tolls and parking responsibility for car + driver.
- Security deposit: amount, hold/release, method.
- Damage, liability and insurance cover; claims process.
- Vehicle condition standard, inspection and handover evidence.
- Interstate use, return rules, late return.

## Alternatives considered
- Keep car + driver gated (original PRD): simpler pilot, but misses the visitor/December demand the founder is targeting.
- Referral-only (pass leads to a rental partner): less liability, but a weaker product and less control over the customer experience.

## Consequences
- Data model: `booking_requests.service_type` (`driver_only` | `car_and_driver`), `vehicle_class`, supplier vehicle assignment; `vehicles` gains a source (`customer` | `flydrive`/`supplier`).
- Ops: a vehicle-assignment step and a vehicle availability check alongside driver overlap.
- Legal/insurance work is required before taking payment for car + driver.

## Evidence and implementation
Designs: `design/DESIGN_HANDOFF.md`, `design/source/CarAndDriver.dc.html`, `BookingNew.dc.html`, `Services.dc.html`, `Visitors.dc.html`.

## Rollback or revisit
A feature flag `carAndDriver.bookingEnabled` controls whether requests can be submitted. When off, pages still show the service with an "enquire" CTA to `/contact`.
