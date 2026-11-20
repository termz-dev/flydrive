/**
 * Faint road-line pattern behind plain panels (design/DESIGN_HANDOFF.md §4). Decorative only.
 * The parent needs the `has-pattern` class. Never place it behind photos or body-heavy text.
 */
const LAYOUTS = {
  a: (
    <>
      <path d="M-20 90 C 180 130, 380 40, 640 110" strokeWidth="10" />
      <path d="M420 -20 C 380 140, 460 240, 430 380" strokeWidth="10" />
      <path d="M120 -20 L 90 380" strokeWidth="6" />
      <path d="M-20 300 L 640 280" strokeWidth="6" />
    </>
  ),
  b: (
    <>
      <path d="M-20 260 C 140 220, 300 300, 640 240" strokeWidth="10" />
      <path d="M300 -20 C 330 120, 260 220, 320 380" strokeWidth="10" />
      <path d="M560 -20 L 590 380" strokeWidth="6" />
      <path d="M-20 70 L 640 100" strokeWidth="6" />
    </>
  ),
  c: (
    <>
      <path d="M-20 200 C 160 160, 340 240, 640 180" strokeWidth="10" />
      <path d="M200 -20 C 220 120, 160 240, 220 380" strokeWidth="10" />
      <path d="M480 -20 L 520 380" strokeWidth="6" />
    </>
  ),
} as const;

const TONES = {
  light: "var(--fd-pattern-light)",
  dark: "var(--fd-pattern-dark)",
  amber: "var(--fd-pattern-amber)",
} as const;

export function RoadPattern({
  layout = "a",
  tone = "light",
}: {
  layout?: keyof typeof LAYOUTS;
  tone?: keyof typeof TONES;
}) {
  return (
    <svg
      className="road-pattern"
      viewBox="0 0 600 360"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke={TONES[tone]}
      aria-hidden="true"
      focusable="false"
    >
      {LAYOUTS[layout]}
    </svg>
  );
}
