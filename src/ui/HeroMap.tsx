/**
 * Decorative hero visual: a stylised Lagos route with an example driver and booking.
 * Sample content only — not live data, GPS or a real driver (design/DESIGN_HANDOFF.md §6).
 */
export function HeroMap() {
  return (
    <div
      className="hero-visual"
      role="img"
      aria-label="Illustration of an example booking on a stylised Lagos map"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 600 640"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M0 470 C 120 440, 220 520, 340 480 S 520 400, 600 430 L600 640 L0 640 Z"
          fill="#0F2131"
        />
        <g fill="none" stroke="#1E2732">
          <path d="M-20 120 C 140 160, 260 60, 420 110 S 580 200, 640 170" strokeWidth="16" />
          <path d="M80 -20 C 110 160, 60 300, 140 420 S 230 600, 210 680" strokeWidth="16" />
          <path d="M-20 330 C 160 300, 320 360, 640 300" strokeWidth="12" />
          <path d="M430 -20 C 400 140, 470 260, 440 420" strokeWidth="12" />
        </g>
        <g fill="none" stroke="#19212B" strokeWidth="6">
          <path d="M260 -20 L 300 640" />
          <path d="M-20 230 L 640 250" />
          <path d="M520 -20 L 560 640" />
          <path d="M-20 560 L 640 520" />
        </g>
        <path
          d="M140 420 C 200 360, 260 340, 330 345 S 420 300, 440 230 S 470 140, 470 110"
          stroke="#F5B53D"
          strokeOpacity="0.25"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
        />
        <path
          className="route-line"
          d="M140 420 C 200 360, 260 340, 330 345 S 420 300, 440 230 S 470 140, 470 110"
          stroke="#F5B53D"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="140" cy="420" r="13" fill="#FFFFFF" />
        <circle cx="140" cy="420" r="5" fill="#0B0F14" />
        <circle cx="470" cy="110" r="22" fill="#F5B53D" fillOpacity="0.25" />
        <circle cx="470" cy="110" r="11" fill="#F5B53D" />
        <g fill="#6B7685" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="500">
          <text x="96" y="458">
            Lekki
          </text>
          <text x="380" y="82">
            Ikeja
          </text>
          <text x="300" y="380">
            Victoria Island
          </text>
        </g>
      </svg>

      <div className="float-card float-driver" aria-hidden="true">
        <span className="blur-avatar" />
        <span>
          <strong>Tunde</strong> · 9 yrs
          <br />
          <span className="ok">Verified driver</span>
        </span>
      </div>

      <div className="float-card float-trip" aria-hidden="true">
        <div className="top">
          <div>
            <p>Example · Full-day · 08:00</p>
            <p className="route">Lekki → Ikeja → Lekki</p>
          </div>
          <span className="pill-ok">Confirmed</span>
        </div>
        <div className="bars">
          <span />
          <span />
          <span />
          <span />
        </div>
        <p>Driver accepted · Payment verified · Handler assigned</p>
      </div>
    </div>
  );
}
