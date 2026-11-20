# UI / UX audit — 20 November 2026

Reviewed every public page (desktop 1440px and mobile 390px), the sign-in pages and the customer,
driver and operations portals, with real data. Brand constraints kept: Claude Design colours and
fonts (ADR 0005), editorial layout (ADR 0004).

## Root cause

The stylesheet had grown to ~1,700 lines of layered overrides from four design passes. Similar
components got different padding, radius and spacing depending on which override won. It was
rebuilt as one system: tokens (colour, 4px spacing scale, type scale, radii, shadows) → base →
layout → components, with no overrides on overrides.

## Findings and fixes

| # | Area | Finding | Fix |
|---|---|---|---|
| 1 | Header | "Sign in" and "Book a driver" wrapped to two lines; 7 nav items + 2 actions overflowed the pill | 5 primary items (Locations and Visitors moved to footer/home); `nowrap`; pill aligned to the content width |
| 2 | Global | ALL-CAPS tracked labels above every heading and in the footer (template tell) | Sentence-case labels, used only where they add wayfinding; redundant ones removed (e.g. "FAQ" above "Frequently asked questions") |
| 3 | Global | "→" appended to most links and inside body copy | Removed from text; the round arrow badge is kept only on primary pill buttons |
| 4 | Global | Amber used for 4+ large blocks per page, competing with the main button | Amber reserved for the primary action and small accents; Ibadan tile uses brand blue, banners use soft tints |
| 5 | Home | Booking-choice tiles had content at different heights and an orphaned arrow | One tile structure: label top, title/body/link bottom, equal height |
| 6 | Home | Packages numbered 01–06 though they aren't a sequence | Numbers removed; list is a `<ul>`; real steps keep their numbers |
| 7 | Home | Middle-dot meta string in the hero chip | Plain sentence |
| 8 | Inner pages | Double padding (page header + section) left a large empty band under every title | Spacing rule collapses the gap between a page header and its first section, and between plain sections; tinted bands keep full padding |
| 9 | Services | Headline said "for your own car" on the page that also sells car + driver; 5+1 card grid left an orphan | "Driver packages, booked by duration"; fixed 3-column grid (2/1 on smaller screens) |
| 10 | FAQ | Long wall of Q&A | Accessible `<details>` accordion |
| 11 | Forms | Plain inputs, tiny radios, labels/hints/errors spaced inconsistently, submit floating | 48px inputs, custom select chevron, consistent label → hint → input → error rhythm, focus rings, error states, option cards for choices, grouped sections with titles, action bar with helper text |
| 12 | Auth | Small form left of centre with the footer right under it | Centred card on a tinted page with heading, intro and links grouped |
| 13 | Portals | Side-by-side panels misaligned (sibling margin applied in a grid) and uneven padding | Grid gaps only; one panel padding; tinted app background with white panels |
| 14 | Portals | Status badge far right, away from the title | Badge sits beside the title |
| 15 | Portals | Raw values shown ("full-day", "lagos", "pickup · customer") | Human labels throughout (`src/modules/shared/labels.ts`) |
| 16 | Portals | Filter chips wrapped onto two ragged lines | Single scrollable filter bar |
| 17 | Portals | Empty states as grey text | Dashed empty-state blocks |
| 18 | Mobile | Hero buttons uneven widths; choice tiles too tall | Full-width stacked buttons; compact tiles |

## Quality floor kept

Keyboard focus visible on every control; `prefers-reduced-motion` respected; colour never the
only signal (badges have text); tap targets ≥ 42px; responsive at 390px.

## Still worth doing

Real photography for the hero and package image slots; an automated accessibility audit
(axe/Lighthouse) in CI; a brand identity pass if Flydrive commissions one.
