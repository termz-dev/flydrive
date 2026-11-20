# ADR 0005 — Claude Design colours and fonts on the editorial layout

- **Status:** Accepted (amends ADR 0004)
- **Owner:** Tree (Tree Augmented)
- **Date:** 2026-11-20

## Decision

Keep the ADR 0004 layout (floating pill navigation, pill arrow buttons, framed hero, dark rounded
panels, numbered package list, facts card, step animation), but use the colours and fonts from
the Flydrive Claude Design canvas:

- Navy `#0E1A2B` (ink, dark panels, footer, logo), blue `#1F5C8C` (links, eyebrows),
  amber `#F5B53D` (accent, primary pill button), greys `#F7F8FA` / `#F2F4F7` / `#E4E7EC`,
  muted text `#475467` / `#5B6778`, green `#1A6B43` for ticks. White page background.
- Space Grotesk (500/600/700) for headings and display numbers; Inter for body text. Both
  self-hosted via Fontsource.
- The navy logo with the amber mark returns.

Tokens live at the top of `src/app/globals.css`.
