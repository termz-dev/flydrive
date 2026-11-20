# ADR 0003 — Adopt the travel-operator design system

- **Status:** Accepted
- **Owner:** Tree (Tree Augmented)
- **Date:** 2026-11-20

## Context

Phase 2 shipped a plain shell. On 19 Nov the look was taken from the Flydrive Claude Design
canvas (navy/amber, Space Grotesk). On 20 Nov the owner supplied a design-system spec
(`docs/design/DESIGN_SYSTEM.md`, "touroperator.framer.website") and asked for it to be used.

## Decision

`docs/design/DESIGN_SYSTEM.md` is the source of truth for visual tokens:

- Colours: primary `#1F4E79` (actions, links, active states), secondary `#D97706` (accent only),
  tertiary `#0F766E` (button hover, check icons), slate neutrals, inverted surface `#0F172A`.
- Type: Inter only (self-hosted via `@fontsource-variable/inter`); Space Grotesk removed.
- Radii 4/8/12/16 px, pill tags; one soft card shadow.
- One primary button colour. Secondary-filled buttons were removed; amber appears as accents
  (card highlight, thin borders, eyebrow text).
- Inner page headers moved to the near-white muted surface; the home hero and footer keep the
  inverted surface.

Page layouts and content from the Claude Design canvas are unchanged.

## Consequences

- Tokens live as CSS variables at the top of `src/app/globals.css`; the older names
  (`--navy`, `--amber`, …) are aliases so components did not need rewriting.
- The spec itself says its values are inferred defaults. If Flydrive gets brand assets, update
  the raw tokens in one place.
