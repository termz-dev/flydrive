# Phase 10A — Implement the Approved Design

Apply `00_MASTER_ORCHESTRATOR.md`. Read `design/DESIGN_HANDOFF.md`, `design/tokens.css`, `docs/decisions/0001-car-and-driver-service.md`, then the `.dc.html` files in `design/source/` for the routes you are building. Use this prompt with Phase 10 (public site) and Phase 11 (portals); it sets the look and content and overrides Phase 10's copy rule that car + driver is future-only.

## v2 notes (20 Nov 2026)
- Home, SiteHeader and SiteFooter are the reference for the premium system. Restyle every other page and portal screen to `design/tokens.css` (see DESIGN_HANDOFF §2), keeping its content and layout.
- Use the photos in `design/assets/` (production originals linked in DESIGN_HANDOFF §5) through an optimised image component.
- Build the faint road-line pattern as a reusable decorative component (DESIGN_HANDOFF §4).

## Goal
Rebuild the designs as real, accessible, responsive routes and reusable components in the app's existing stack. Match layout, hierarchy, spacing, colour, type and copy closely. Do not embed or iframe the `.dc.html` files.

## Steps
1. Inspect the repo first (framework, styling approach, existing components). Map `design/tokens.css` into the project's styling system (CSS variables, Tailwind theme or equivalent) once, then use tokens only. No raw hex in components.
2. Build shared pieces first: `SiteHeader` (with `active` → `aria-current`), `SiteFooter`, `Button`/`LinkButton`, `Card`, `StatusPill`, `SectionHeader`, `ServiceChooser`, `PackageTable`, `StepList`, `FormField` (label + hint + error), `Accordion`, `DriverCandidateCard`, `BookingTimeline`.
3. Build public routes per the route map in the handoff, each with its own metadata (title, description) and a single `h1`.
4. Put every placeholder (`[RATE]`, `[N] passengers`, support hours, contact, service areas, team, legal text, car + driver policies) in a typed content/config module. Render as visible "to be confirmed" text in non-production builds; fail the production build if a required value is missing.
5. Booking request: implement the service toggle (driver for my car ↔ car + driver). Car + driver collects vehicle class and luggage, sets `service_type = car_and_driver`, and routes to ops review per ADR 0001.
6. Customer/driver/ops screens: wire the designed states to real booking states. Candidate photos are blurred server-side before payment verification.
7. Interactive patterns (FAQ accordion, candidate selection, service toggle, driver application states) use real buttons with `aria-pressed`/`aria-expanded`, keyboard support and visible focus.

## Acceptance
- Every route in the handoff map is reachable, linked from header/footer as designed, and has no dead links.
- Visual check at 1440px, 768px and 390px for each page; record screenshots in the PR. No horizontal page scroll at 390px.
- Lighthouse/axe: no serious accessibility violations; text contrast ≥ 4.5:1.
- No invented prices, capacities, insurance, deposit, availability, testimonials or metrics anywhere.
- Report exact commands run and their output.
