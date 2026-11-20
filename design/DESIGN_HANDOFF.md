# Flydrive — Design Handoff (v2, premium)

**Status:** Approved direction, 20 Nov 2026. Replaces the v1 handoff.
**Live canvas (click-through):** https://claude.ai/artifact/8C6HbVpavW6YpxCvwUi95K
**Source:** `design/source/*.dc.html` (one file per screen) · `design/source/canvas.json`
**Tokens:** `design/tokens.css` · **Photos:** `design/assets/` · **Pattern:** `design/assets/road-pattern.svg`

Rebuild these designs as real routes and components in the app's stack (see `prompts/10A_IMPLEMENT_APPROVED_DESIGN.md`). Do not ship or iframe the `.dc.html` files.

## 1. What changed since v1

- **Premium visual system** (tokens.css): near-black ink `#0B0F14`, 1320px container, Space Grotesk 600 with tight tracking, pill buttons, 22–32px radii, generous spacing.
- **Car + driver is a main service** next to driver-for-your-car (ADR 0001). Its commercial terms stay placeholders.
- **People photography** on Home, Car + driver, Visitors, Drive with us, About and Trust & safety.
- **Header:** dropdown nav with a `tone` prop (`dark` on Home, `light` elsewhere) and a mobile menu.
- **Road-line pattern:** a very faint decorative SVG behind selected cards.

## 2. Reference vs. pages still to restyle

`Main.dc.html` (Home), `SiteHeader.dc.html` and `SiteFooter.dc.html` are the **reference implementation of the premium system**. The other public pages have the right **content, structure and photos**, but some still use v1 styling: `#0E1A2B` ink, 1240px container, 10px-radius buttons. **When building them, apply the tokens.css system to every page** and keep the content and layout. Concretely:

| v1 value in source | Build with |
|---|---|
| `#0E1A2B` | `--fd-ink` `#0B0F14` |
| `max-width: 1240px; padding 0 32px` | `--fd-container` 1320 / `--fd-gutter` 40 |
| buttons `border-radius: 10px` | pill `999px`, 56px tall |
| cards 16–20px radius | 22px (small) / 28–32px (feature) |
| headings 700 weight | Space Grotesk 600, -0.03 to -0.045em |

The portal screens (`BookingNew`, `Candidates`, `BookingStatus`, `Ops`, `DriverOffer`) define **flows and states**. Restyle them with the same tokens.

## 3. Page → route map

| Design file | Route | Notes |
|---|---|---|
| `Main.dc.html` | `/` | Dark hero + booking widget (service toggle), map visual, trust strip, two service photo cards, packages, 4 steps + phone mock, safety panel with photo, city tiles, visitors + driver photo cards |
| `Services.dc.html` | `/services` | Two option cards + package table (rates from catalog) |
| `CarAndDriver.dc.html` | `/services/car-and-driver` | Amber hero with SUV photo + floating "includes" card; vehicle classes; steps |
| `HowItWorks.dc.html` | `/how-it-works` | 7 steps + "If something changes" |
| `TrustSafety.dc.html` | `/trust-and-safety` | Dark hero with driver photo |
| `Lagos.dc.html`, `Ibadan.dc.html` | `/locations/lagos`, `/locations/ibadan` | One template; area chips are samples (config) |
| `Visitors.dc.html` | `/for-visitors` | Traveller photo + "Example stay" card |
| `Drivers.dc.html` | `/drivers` | Driver photo + benefits overlay |
| `DriverApply.dc.html` | `/drivers/apply` | Lead intake; inline error + received state |
| `About.dc.html` | `/about` | Team photo (stock: replace with real team) |
| `FAQ.dc.html` | `/faq` | Topic filter + accordion |
| `Contact.dc.html` | `/contact` | Contact details are placeholders |
| `Privacy.dc.html`, `Terms.dc.html` | `/privacy`, `/terms` | Layout only; counsel writes the text |
| `NotFound.dc.html` | 404 | |
| `SiteHeader.dc.html` / `SiteFooter.dc.html` | shared layout | Header props: `active`, `tone` |
| `BookingNew.dc.html` | `/bookings/new` | Service toggle; car + driver adds vehicle class + luggage |
| `Candidates.dc.html` | `/bookings/[id]` (matching) | Selectable cards, limited pre-payment fields |
| `BookingStatus.dc.html` | `/bookings/[id]` (verifying) | Timeline; locked post-confirmation section |
| `DriverOffer.dc.html` | `/driver/offers/[id]` | Mobile-first 390px |
| `Ops.dc.html` | `/ops` | Queue, guarded "Verify & confirm", driver checks |

## 4. Components to build

`SiteHeader` (logo, nav with Services ▾ and Locations ▾ dropdowns, Drive with us, Sign in, Book now pill; amber 2px underline marks the active page; under 1100px it collapses to Book now + menu button), `SiteFooter`, `Button` (primary ink, secondary outline, light-on-dark, amber), `Pill/Tag` (white tag "I have a car", ink tag "I need a car too", both with an amber dot), `BookingWidget`, `ServicePhotoCard` (image-top variant and full-bleed variant with scrim), `PhotoPanel`, `PackageTile`, `StepList`, `PhoneMock`, `CityTile`, `RoadPattern`, `FormField`, `Accordion`, `DriverCandidateCard`, `BookingTimeline`, `StatusPill`.

### Road-line pattern

A decorative SVG (`design/assets/road-pattern.svg`, 3 layouts in source) placed behind card content. Container: `position: relative; overflow: hidden; isolation: isolate`. SVG: `position: absolute; inset: 0; z-index: -1; aria-hidden="true"`, `preserveAspectRatio="xMidYMid slice"`. Stroke colours: `--fd-pattern-light`, `--fd-pattern-dark` or `--fd-pattern-amber`, so it is **barely visible**. Use it on plain panels only, never behind photos or body-heavy text.

### Photo cards

- Full-bleed photo with text uses `--fd-scrim` over the lower 78% so white text passes contrast.
- Tags sit top-left at 28px inset.
- `object-fit: cover`. Keep the `object-position` values from source; they keep faces in frame.

## 5. Photos (`design/assets/`)

All are free Pexels photos (Pexels licence: free commercial use, no attribution required). The files in `assets/` were captured at 1000–1600px for the mockup. **Download the originals from the links below for production** and serve responsive sizes (`srcset`, AVIF/WebP, lazy-load below the fold).

| File | Used on | Original |
|---|---|---|
| `driver-at-wheel.jpg` | Home, "Driver for your car" card | https://www.pexels.com/photo/man-in-gray-suit-driving-a-car-8425360/ |
| `chauffeur-door.jpg` | Home, "Car + driver" card | https://www.pexels.com/photo/woman-in-black-blazer-standing-beside-black-car-8425035/ |
| `driver-window.jpg` | Home safety panel; Trust & safety hero | https://www.pexels.com/photo/man-sitting-inside-the-black-car-8425392/ |
| `family.jpg` | Home "Coming home for December?" | https://www.pexels.com/photo/4299288/ |
| `happy-driver.jpg` | Home "Drive with Flydrive" | https://www.pexels.com/photo/8425384/ |
| `chauffeur-suv.jpg` | Car + driver hero | https://www.pexels.com/photo/professional-chauffeur-standing-beside-luxury-suv-36377051/ |
| `traveller.jpg` | Visitors hero | https://www.pexels.com/photo/4173219/ |
| `older-driver.jpg` | Drive with us hero | https://www.pexels.com/photo/4606331/ |
| `team.jpg` | About | https://www.pexels.com/photo/30688597/ |

**Before launch:**
- `team.jpg` shows models, not Flydrive staff. Replace it with a real team photo, or don't present it as the team.
- `chauffeur-suv.jpg` has a number plate reading "UNITED", a third-party name. Crop it out or pick another photo.
- Write real `alt` text per photo; the source has drafts.

## 6. Behaviour and content rules (unchanged)

- Booking state is the source of truth; badges and timelines map to the states in `docs/DOMAIN_MODEL_AND_SCHEMA.md`.
- Short notice (under 3 days) shows the amber warning and routes to ops review. Car + driver requests go to ops review until ADR 0001 is Accepted.
- Candidate cards show only first name, a **server-side** blurred photo, years of experience, checks and "Training: Pending".
- Ops "Verify & confirm" stays disabled until evidence and a handler are recorded; the action is audited.
- Sample data in the mockups (Tunde, FD-0142, dates, "Lagos → Ikeja") is illustrative. The hero map and trip card are decorative, not live data or GPS.
- Every `[PLACEHOLDER]` (rates, hours, capacities, deposit, fuel policy, service areas, support hours, contact, team) comes from a typed config/content module. Never invent values.
- Accessibility: real buttons and links, `aria-pressed`/`aria-expanded` on toggles and dropdowns, visible focus, 44px touch targets, text contrast ≥ 4.5:1. Never white text on amber.

## 7. Reading a `.dc.html` file

Plain HTML with inline styles inside `<x-dc>`. `<helmet>` holds head content. `<dc-import name="SiteHeader" active="x" tone="dark">` is a component with props. `<sc-for>` is a `.map()`, `<sc-if>` is a conditional, and `{{x}}` is a value from the `renderVals()` script at the bottom (demo state only). Links like `href="Services.dc.html"` map to the routes in §3. Ignore `support.js` and `data-props`.
