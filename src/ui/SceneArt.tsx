/**
 * Illustrated stand-ins for photography. Flydrive has no licensed photos yet, so every image slot
 * renders one of these warm, abstract scenes. To use real photos, put them in /public/images and
 * set the paths in src/ui/Media.tsx — the slot switches to the photo automatically.
 */
export function RoadScene({ title }: { title?: string }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMaxYMid slice"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id="rs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e3c8" />
          <stop offset="0.55" stopColor="#f2cf9a" />
          <stop offset="1" stopColor="#e7b47a" />
        </linearGradient>
        <linearGradient id="rs-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b98a5b" />
          <stop offset="1" stopColor="#6f5038" />
        </linearGradient>
        <linearGradient id="rs-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d5148" />
          <stop offset="1" stopColor="#2f2924" />
        </linearGradient>
        <radialGradient id="rs-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#rs-sky)" />
      <circle cx="1120" cy="430" r="260" fill="url(#rs-sun)" />
      <circle cx="1120" cy="430" r="70" fill="#fff3d1" />
      {/* distant skyline */}
      <g fill="#c99a6c" opacity="0.75">
        <rect x="760" y="380" width="40" height="120" />
        <rect x="806" y="340" width="54" height="160" />
        <rect x="866" y="400" width="34" height="100" />
        <rect x="1260" y="360" width="46" height="140" />
        <rect x="1312" y="320" width="36" height="180" />
        <rect x="1354" y="390" width="60" height="110" />
        <rect x="1420" y="350" width="30" height="150" />
      </g>
      {/* hills */}
      <path
        d="M0 520 Q300 420 620 500 T1240 470 T1600 490 V900 H0 Z"
        fill="#c8945f"
        opacity="0.8"
      />
      <path d="M0 560 Q380 480 760 540 T1600 530 V900 H0 Z" fill="url(#rs-ground)" />
      {/* road */}
      <path d="M1040 540 L1110 540 L1600 900 L520 900 Z" fill="url(#rs-road)" />
      <g stroke="#f6d27a" strokeWidth="10" strokeLinecap="round">
        <line x1="1078" y1="560" x2="1086" y2="590" />
        <line x1="1096" y1="630" x2="1110" y2="685" />
        <line x1="1124" y1="740" x2="1146" y2="830" />
      </g>
      {/* car */}
      <g transform="translate(1180 700)">
        <path
          d="M0 70 V48 L30 40 L68 6 H170 L210 40 L250 48 V70 Z"
          fill="#0e1a2b"
          stroke="#0e1a2b"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <path d="M80 14 L60 40 H200 L170 14 Z" fill="#f2cf9a" opacity="0.55" />
        <circle cx="62" cy="74" r="20" fill="#0e1a2b" />
        <circle cx="62" cy="74" r="8" fill="#b98a5b" />
        <circle cx="194" cy="74" r="20" fill="#0e1a2b" />
        <circle cx="194" cy="74" r="8" fill="#b98a5b" />
      </g>
      {/* palms */}
      <g fill="#4b3a2c">
        <rect x="300" y="380" width="8" height="190" />
        <path d="M304 384 q-60 -10 -96 30 q50 -18 96 -24 q-40 -40 -90 -30 q60 0 90 24 q20 -50 70 -60 q-40 30 -66 60 q50 -20 100 0 q-50 -6 -104 0z" />
        <rect x="370" y="420" width="7" height="150" />
        <path d="M373 424 q-48 -8 -78 24 q40 -14 78 -20 q-32 -32 -72 -24 q48 0 72 20 q16 -40 56 -48 q-32 24 -52 48 q40 -16 80 0 q-40 -5 -84 0z" />
      </g>
    </svg>
  );
}

export function CityScene({ title }: { title?: string }) {
  return (
    <svg
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid slice"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id="cs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfcfc4" />
          <stop offset="0.6" stopColor="#e9d9b8" />
          <stop offset="1" stopColor="#e3b98a" />
        </linearGradient>
        <linearGradient id="cs-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fb0a3" />
          <stop offset="1" stopColor="#5f6e66" />
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#cs-sky)" />
      <ellipse cx="560" cy="220" rx="130" ry="34" fill="#fff" opacity="0.5" />
      <ellipse cx="220" cy="300" rx="90" ry="22" fill="#fff" opacity="0.4" />
      <g fill="#6f6a5f" opacity="0.85">
        <rect x="40" y="470" width="60" height="230" />
        <rect x="108" y="420" width="44" height="280" />
        <rect x="160" y="500" width="70" height="200" />
        <rect x="470" y="440" width="52" height="260" />
        <rect x="530" y="380" width="64" height="320" />
        <rect x="602" y="480" width="48" height="220" />
        <rect x="658" y="430" width="70" height="270" />
      </g>
      <rect y="700" width="800" height="300" fill="url(#cs-water)" />
      {/* bridge */}
      <g stroke="#3d3a33" strokeWidth="10" fill="none">
        <path d="M0 640 Q400 600 800 640" />
        <line x1="0" y1="660" x2="800" y2="660" />
      </g>
      <g fill="#3d3a33">
        {[60, 160, 260, 360, 460, 560, 660, 760].map((x) => (
          <rect key={x} x={x - 5} y="660" width="10" height="60" />
        ))}
      </g>
      <g fill="#f5b53d">
        <rect x="300" y="646" width="26" height="10" rx="3" />
        <rect x="520" y="646" width="26" height="10" rx="3" />
      </g>
      <g stroke="#e9dcc6" strokeWidth="3" opacity="0.5">
        <line x1="120" y1="790" x2="260" y2="790" />
        <line x1="420" y1="840" x2="620" y2="840" />
        <line x1="200" y1="900" x2="320" y2="900" />
      </g>
    </svg>
  );
}
