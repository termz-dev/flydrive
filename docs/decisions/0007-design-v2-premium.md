# ADR 0007 — Design v2 (premium) replaces ADR 0005 visuals

- **Status:** Accepted (founder, 20 Nov 2026)
- **Supersedes:** visual parts of ADR 0003, 0004 and 0005

## Decision
Rebuild every public page, the shared header and footer, and restyle the portals to the v2 design
handoff (`design/DESIGN_HANDOFF.md`, `design/tokens.css`, `design/source/*.dc.html`), with one
exception set by the founder: **keep the existing buttons** (pill buttons with the arrow circle,
navy / amber / secondary variants). Two variants were added in the same shape for dark and photo
surfaces (`button-light`, `button-ghost-light`) and one outline variant (`button-outline`).

## What changed
- Tokens: ink `#0B0F14`, 1320px container, 40px gutter, 112px sections, 22/28/32px radii, Space
  Grotesk 600 with tight tracking. Portal and form styles keep their old variable names, now mapped
  onto the v2 tokens at the top of `src/app/globals.css`.
- Header: dropdowns for Services and Locations, dark tone on the home page, amber underline for the
  current page, compact "Book now" + menu under 1100px (`src/ui/SiteNav.tsx`).
- Photography: nine licensed Pexels photos in `public/images/`, served through `next/image` via
  `src/ui/Photo.tsx` (object positions from the design). Road-line pattern: `src/ui/RoadPattern.tsx`.
- Placeholders (`[RATE]`, `[N] passengers`, support hours, payout timing, deposit, fuel, team) come
  from `src/content/site.ts`. `null` renders honest "to be confirmed" copy; nothing is invented.
- The home booking widget is a GET form that pre-fills `/bookings/new` (via sign-in if needed).

## Deliberate departures from the design copy
- Background checks are described as "being finalised" (the eligibility rule doesn't require one yet).
- Driver pay: offers don't carry a driver pay figure yet, so the Drive page says rates are being
  finalised instead of "shown in the offer".
- Contact has no message form (there's no backend for one); it points signed-in customers to Support.
- The hero map, "Tunde" card and phone mock are labelled as examples and hidden from screen readers.
- The team section on About is hidden until `TEAM` has real people.

## Before launch
- `team.jpg` shows models, not Flydrive staff: replace it with a real team photo or another image.
- Replace mockup-size photos with production originals if higher resolution is needed.
- Fill the values in `src/content/site.ts` as they are approved.
