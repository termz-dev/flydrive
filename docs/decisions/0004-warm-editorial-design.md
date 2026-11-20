# ADR 0004 — Warm editorial design direction

- **Status:** Accepted (supersedes the visual tokens in ADR 0003)
- **Owner:** Tree (Tree Augmented)
- **Date:** 2026-11-20

## Context

After ADR 0003 the owner shared reference screenshots of a modern travel template ("Wayfare",
a Framer template) and asked for a modern design in that style.

## Decision

Use the reference as inspiration, not a copy:

- Warm cream surfaces (`#F6EFE4`, `#FBF7F0`), warm near-black ink (`#24201B`), one yellow accent
  (`#FFC83D`), dark rounded panels (`#26221D`).
- Instrument Sans (self-hosted) for everything; large, tight, semibold headings.
- Floating pill navigation; pill buttons with a round arrow badge; 20–28px rounded frames.
- Home: framed full-bleed hero, two-way booking choice, dark numbered package list with
  hover/focus highlight, steps, "why Flydrive" with an image and a facts card, cities, banners.
- Layout and content from the Claude Design canvas and the honesty rules stay.

`docs/design/DESIGN_SYSTEM.md` (ADR 0003) is kept for reference only.

## Not copied from the reference

- Photography: Flydrive has no licensed photos yet. Image slots render illustrations
  (`src/ui/SceneArt.tsx`) and switch to photos when paths are set in `src/ui/Media.tsx`.
- Stats, star ratings and review counts: Flydrive has none yet. The facts card states only true
  facts (cities, notice period, number of checks, booking types, zero auto-confirmations).
- Language picker and dark-mode toggle: not needed for the pilot.

## Revisit when

Real photography is available, or Flydrive commissions a brand identity.
