/** Small inline icons from the Flydrive design. Decorative: always aria-hidden. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#FFC83D" />
      <path
        d="M9 21 L16 9 L23 21"
        fill="none"
        stroke="#24201B"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 17 H20" stroke="#24201B" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Tick() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2F7A4F"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 12l5 5 9-10" />
    </svg>
  );
}

export function Clock() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#24201B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "#24201B",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PersonIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </svg>
  );
}

export function CarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M3 16v-4l2-5h14l2 5v4z" />
      <path d="M3 12h18" />
      <circle cx="7.5" cy="16.5" r="1.8" />
      <circle cx="16.5" cy="16.5" r="1.8" />
    </svg>
  );
}

const art = { ...stroke, strokeWidth: 3 };

export function SaloonArt() {
  return (
    <svg width="150" height="70" viewBox="0 0 150 70" {...art} aria-hidden="true">
      <path d="M8 50 V40 L28 36 L48 18 H100 L120 36 L142 40 V50 Z" />
      <path d="M54 22 L44 36 H114 L98 22 Z" />
      <circle cx="38" cy="52" r="9" fill="#ECE2D2" />
      <circle cx="114" cy="52" r="9" fill="#ECE2D2" />
    </svg>
  );
}

export function SuvArt() {
  return (
    <svg width="150" height="76" viewBox="0 0 150 76" {...art} aria-hidden="true">
      <path d="M8 56 V40 L26 34 L40 14 H112 L126 34 L142 40 V56 Z" />
      <path d="M46 18 L38 34 H118 L108 18 Z" />
      <path d="M76 18 V34" />
      <circle cx="38" cy="58" r="10" fill="#ECE2D2" />
      <circle cx="114" cy="58" r="10" fill="#ECE2D2" />
    </svg>
  );
}

export function MinivanArt() {
  return (
    <svg width="150" height="76" viewBox="0 0 150 76" {...art} aria-hidden="true">
      <path d="M8 56 V22 Q8 12 20 12 H118 L142 34 V56 Z" />
      <path d="M20 20 H52 V34 H20 Z" />
      <path d="M60 20 H92 V34 H60 Z" />
      <path d="M100 20 H116 L130 34 H100 Z" />
      <circle cx="38" cy="58" r="10" fill="#ECE2D2" />
      <circle cx="114" cy="58" r="10" fill="#ECE2D2" />
    </svg>
  );
}
