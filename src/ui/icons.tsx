import type React from "react";
/** Small inline icons from the Flydrive design. Decorative: always aria-hidden. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect className="logo-bg" width="32" height="32" rx="9" fill="#0B0F14" />
      <path
        d="M9 21 L16 9 L23 21"
        fill="none"
        stroke="#F5B53D"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 17 H20" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
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
      stroke="#1A6B43"
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
      stroke="#0E1A2B"
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
  stroke: "#0E1A2B",
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
      <circle cx="38" cy="52" r="9" fill="#F4F5F7" />
      <circle cx="114" cy="52" r="9" fill="#F4F5F7" />
    </svg>
  );
}

export function SuvArt() {
  return (
    <svg width="150" height="76" viewBox="0 0 150 76" {...art} aria-hidden="true">
      <path d="M8 56 V40 L26 34 L40 14 H112 L126 34 L142 40 V56 Z" />
      <path d="M46 18 L38 34 H118 L108 18 Z" />
      <path d="M76 18 V34" />
      <circle cx="38" cy="58" r="10" fill="#F4F5F7" />
      <circle cx="114" cy="58" r="10" fill="#F4F5F7" />
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
      <circle cx="38" cy="58" r="10" fill="#F4F5F7" />
      <circle cx="114" cy="58" r="10" fill="#F4F5F7" />
    </svg>
  );
}

function Line({ children, size = 22 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function Chevron() {
  return (
    <svg
      className="chev"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ArrowRight({ size = 22 }: { size?: number }) {
  return (
    <Line size={size}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Line>
  );
}

export function ArrowLeft() {
  return (
    <Line size={16}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </Line>
  );
}

export function IdIcon() {
  return (
    <Line>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2.5" />
      <path d="M14 10h4M14 14h3" />
    </Line>
  );
}

export function LicenceIcon() {
  return (
    <Line>
      <path d="M4 7h16v10H4z" />
      <path d="M8 11h8M8 14h5" />
    </Line>
  );
}

export function GuarantorIcon() {
  return (
    <Line>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 11l2 2 4-4" />
    </Line>
  );
}

export function ShieldIcon() {
  return (
    <Line>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </Line>
  );
}

export function PhoneIcon() {
  return (
    <Line size={20}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </Line>
  );
}

export function MailIcon() {
  return (
    <Line size={20}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </Line>
  );
}

export function HoursIcon() {
  return (
    <Line size={20}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Line>
  );
}

export function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}
