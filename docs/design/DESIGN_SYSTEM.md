---
version: alpha
name: touroperator.framer.website
description: Design system for a travel and tour operator marketing site with a clean, editorial feel, strong imagery, and high-contrast booking-oriented calls to action.
colors:
  primary: "#1F4E79"
  secondary: "#D97706"
  tertiary: "#0F766E"
  neutral:
    0: "#FFFFFF"
    100: "#F8FAFC"
    200: "#E2E8F0"
    300: "#CBD5E1"
    400: "#94A3B8"
    500: "#64748B"
    600: "#475569"
    700: "#334155"
    800: "#1E293B"
    900: "#0F172A"
  surface:
    default: "#FFFFFF"
    muted: "#F8FAFC"
    raised: "#FFFFFF"
    inverted: "#0F172A"
  on-surface:
    default: "#0F172A"
    muted: "#475569"
    inverted: "#FFFFFF"
  error: "#DC2626"
typography:
  headline-display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "3.5rem"
    lineHeight: 1.05
    fontWeight: 700
    letterSpacing: "-0.03em"
  headline-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "2.5rem"
    lineHeight: 1.1
    fontWeight: 700
    letterSpacing: "-0.025em"
  headline-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "2rem"
    lineHeight: 1.15
    fontWeight: 700
    letterSpacing: "-0.02em"
  body-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    lineHeight: 1.6
    fontWeight: 400
    letterSpacing: "0em"
  body-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.6
    fontWeight: 400
    letterSpacing: "0em"
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.5
    fontWeight: 400
    letterSpacing: "0em"
  label-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.2
    fontWeight: 600
    letterSpacing: "0.01em"
  label-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.2
    fontWeight: 600
    letterSpacing: "0.01em"
  label-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    lineHeight: 1.2
    fontWeight: 600
    letterSpacing: "0.04em"
rounded:
  none: "0px"
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  full: "9999px"
spacing:
  0: "0px"
  1: "0.25rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.25rem"
  6: "1.5rem"
  8: "2rem"
  10: "2.5rem"
  12: "3rem"
  16: "4rem"
  20: "5rem"
components:
  button:
    background: "{colors.primary}"
    text: "{colors.surface.default}"
    hoverBackground: "{colors.tertiary}"
    borderRadius: "{rounded.md}"
    paddingX: "{spacing.5}"
    paddingY: "{spacing.3}"
  button-secondary:
    background: "{colors.surface.default}"
    text: "{colors.primary}"
    borderColor: "{colors.primary}"
    borderRadius: "{rounded.md}"
    paddingX: "{spacing.5}"
    paddingY: "{spacing.3}"
  card:
    background: "{colors.surface.default}"
    text: "{colors.on-surface.default}"
    borderColor: "{colors.neutral.200}"
    borderRadius: "{rounded.lg}"
    padding: "{spacing.6}"
    shadow: "0 8px 24px rgba(15, 23, 42, 0.08)"
  input:
    background: "{colors.surface.default}"
    text: "{colors.on-surface.default}"
    borderColor: "{colors.neutral.300}"
    borderRadius: "{rounded.md}"
    paddingX: "{spacing.4}"
    paddingY: "{spacing.3}"
    focusBorderColor: "{colors.primary}"
---

# Overview

This design system supports a travel and tour operator website with a polished, trust-building aesthetic. Use it to present destinations, itineraries, and booking actions with clear hierarchy, generous whitespace, and strong imagery cues.

The visual tone should feel premium but approachable: dark text on bright surfaces, blue as the primary trust color, and warm accent color for emphasis. Because no source tokens or screenshot were provided, the values below are conservative defaults inferred for a modern Framer marketing site.

# Colors

## Palette intent
- **Primary** is the main brand and action color. Use it for primary buttons, links, key icons, and active states.
- **Secondary** is a warm accent for highlights, badges, and seasonal or promotional emphasis.
- **Tertiary** can support informational accents, itinerary states, or subtle contrast in charts and illustrations.
- **Neutral** colors provide readable structure across text, borders, backgrounds, and dividers.
- **Surface** colors define page and card backgrounds.
- **On-surface** colors ensure accessible text contrast.
- **Error** is reserved for validation and destructive states only.

## Usage guidance
- Favor **white and near-white surfaces** with dark text for editorial clarity.
- Use **primary** sparingly so calls to action remain prominent.
- Use **secondary** only for accent moments; do not use it as a competing CTA color unless explicitly needed.
- Keep borders and separators subtle using neutral 200–300.

# Typography

## Hierarchy
- **headline-display**: Hero titles and major landing-page statements.
- **headline-lg**: Section openings, destination spotlights, and feature headers.
- **headline-md**: Card titles, itinerary headings, and modal titles.
- **body-lg**: Intro paragraphs and value propositions that need extra presence.
- **body-md**: Default page body copy.
- **body-sm**: Supporting text, metadata, and helper content.
- **label-lg / label-md / label-sm**: Buttons, tags, form labels, and small UI annotations.

## Type behavior
- Use a clean sans-serif system such as Inter for a modern travel brand feel.
- Keep headlines tight with slightly negative letter spacing.
- Maintain generous line height for longer travel descriptions and itinerary copy.
- Reserve bold weights for headings and actionable UI; avoid overusing heavy weight in body copy.

# Layout

## Spacing
Use a consistent spacing scale based on 4px increments:
- **1–4** for compact gaps, icon/text spacing, and inline UI.
- **5–8** for form fields, card internals, and section rhythm.
- **10–20** for page sections, major layout separation, and landing-page breathing room.

## Structure
- Prefer a modular marketing layout with large hero sections, card grids, and alternating content blocks.
- Use wide horizontal padding on desktop and tighter stacking on mobile.
- Keep itinerary and tour detail pages readable by limiting line length and using clear content grouping.
- Align CTA placement consistently near the end of narrative sections and within cards.

# Elevation & Depth

The source data did not provide explicit elevation tokens, so use restrained shadow depth conservatively.

- Use a light shadow for raised cards, dropdowns, and floating elements.
- Avoid heavy shadows that compete with photography.
- Keep most containers flat; reserve depth for actionable or layered elements.
- If multiple elevations are needed, use only subtle steps to preserve a clean travel-editorial style.

# Shapes

Rounded corners should feel soft and modern without becoming playful.

- **none**: Rarely used; suitable for structural separators or edge-to-edge media.
- **sm**: Small utility controls.
- **md**: Default for buttons, inputs, and compact UI.
- **lg**: Cards and larger content blocks.
- **xl**: Hero media and prominent feature containers.
- **full**: Pills, badges, avatar treatments, and capsule tags.

Prefer moderately rounded rectangles for most UI, with full rounding reserved for small status chips and tags.

# Components

## Buttons
- Primary buttons use the brand blue background with white text.
- Secondary buttons invert to a white surface with a blue outline and text.
- Keep button labels concise and action-oriented, such as “Book now,” “View itinerary,” or “Check availability.”

## Cards
- Use cards for tours, destination highlights, testimonials, and package summaries.
- Cards should feel airy, with white backgrounds, subtle borders, rounded corners, and soft shadows.
- Include a clear visual hierarchy: image, title, short description, metadata, then action.

## Inputs
- Inputs should be simple, high-contrast, and easy to scan.
- Use clear focus states in primary color.
- Keep placeholder text subdued and avoid overly decorative fields.
- When used for booking forms, group fields with consistent spacing and aligned labels.

## Navigation and links
- Navigation should be clean and minimal.
- Highlight the current section with primary color or subtle emphasis rather than heavy decoration.
- Links should be easy to identify without overwhelming the layout.

## Badges and tags
- Use pill-shaped tags for trip type, difficulty, duration, or availability.
- Keep tag colors muted and readable; avoid saturated fills unless signaling urgency.

# Do's and Don'ts

## Do
- Do use white or near-white surfaces with dark text for most content.
- Do keep calls to action consistent: primary buttons should always look primary.
- Do use generous spacing around destination photography and key headlines.
- Do keep cards simple and scannable with clear metadata.
- Do use accent colors sparingly to support hierarchy, not replace it.
- Do keep typography clean and readable, especially for itinerary details and booking forms.

## Don't
- Don't introduce multiple competing brand colors for primary actions.
- Don't use dense blocks of text without subheads, spacing, or supporting metadata.
- Don't apply heavy shadows, complex gradients, or ornamental UI effects.
- Don't make all buttons filled; reserve the strongest fill for the main CTA.
- Don't rely on color alone to communicate status or validation.
- Don't use rounded corners so large that cards or controls feel cartoonish.