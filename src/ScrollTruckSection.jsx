import { motion } from 'framer-motion'

// Road dashes config
const DASHES = Array.from({ length: 22 })

export default function ScrollTruckSection() {
  return (
    <section className="ambient-section" aria-hidden="true">
      {/* Road + truck — purely decorative background */}
      <div className="ambient-road">
        {/* Road surface */}
        <svg
          className="ambient-road-svg"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Asphalt band */}
          <rect y="12" width="1440" height="66" fill="#0f172a" />

          {/* Shoulder lines */}
          <rect y="12" width="1440" height="2" fill="#fbbf24" opacity="0.18" />
          <rect y="76" width="1440" height="2" fill="#fbbf24" opacity="0.18" />

          {/* Center lane dashes */}
          {DASHES.map((_, i) => (
            <rect
              key={i}
              x={i * 68}
              y="43"
              width="40"
              height="4"
              rx="2"
              fill="white"
              opacity="0.14"
            />
          ))}

          {/* Subtle road fade edges */}
          <rect
            y="12"
            width="1440"
            height="66"
            fill="url(#roadFade)"
          />
          <defs>
            <linearGradient id="roadFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#060b14" stopOpacity="0.55" />
              <stop offset="20%" stopColor="transparent" stopOpacity="0" />
              <stop offset="80%" stopColor="transparent" stopOpacity="0" />
              <stop offset="100%" stopColor="#060b14" stopOpacity="0.55" />
            </linearGradient>
          </defs>
        </svg>

        {/* Animated truck */}
        <motion.div
          className="ambient-truck"
          animate={{ x: ['-120px', 'calc(100vw + 120px)'] }}
          transition={{
            duration: 14,
            ease: 'linear',
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
          aria-hidden="true"
        >
          <TruckSVG />
        </motion.div>
      </div>
    </section>
  )
}

function TruckSVG() {
  return (
    <svg viewBox="0 0 110 52" className="ambient-truck-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Exhaust smoke (subtle) */}
      <ellipse cx="6" cy="4" rx="4" ry="3" fill="rgba(148,163,184,0.18)" />
      <ellipse cx="10" cy="2" rx="3" ry="2.5" fill="rgba(148,163,184,0.12)" />

      {/* Trailer */}
      <rect x="1" y="8" width="66" height="28" rx="3" fill="#111827" stroke="rgba(251,191,36,0.35)" strokeWidth="1.5" />
      {/* Trailer ribbing */}
      <line x1="19" y1="8" x2="19" y2="36" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="35" y1="8" x2="35" y2="36" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="51" y1="8" x2="51" y2="36" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* MOVANTIA text on trailer */}
      <text x="33" y="25" fontSize="7" fontWeight="800" fill="rgba(251,191,36,0.35)" textAnchor="middle" letterSpacing="2">
        MOVANTIA
      </text>

      {/* Cab */}
      <rect x="67" y="4" width="38" height="32" rx="4" fill="#1e2d3d" stroke="#fbbf24" strokeWidth="1.5" />
      {/* Windshield */}
      <rect x="73" y="8" width="18" height="12" rx="2" fill="rgba(56,189,248,0.65)" />
      {/* Cab detail — door line */}
      <line x1="87" y1="4" x2="87" y2="36" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Exhaust pipe */}
      <rect x="68" y="2" width="4" height="8" rx="1" fill="#0f172a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Wheels */}
      <circle cx="22" cy="40" r="8" fill="#0f172a" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      <circle cx="48" cy="40" r="8" fill="#0f172a" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      <circle cx="84" cy="40" r="8" fill="#0f172a" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      {/* Hubcaps */}
      <circle cx="22" cy="40" r="3" fill="rgba(255,255,255,0.15)" />
      <circle cx="48" cy="40" r="3" fill="rgba(255,255,255,0.15)" />
      <circle cx="84" cy="40" r="3" fill="rgba(255,255,255,0.15)" />

      {/* Headlight */}
      <circle cx="106" cy="16" r="3.5" fill="#fbbf24" />
      <ellipse cx="106" cy="16" rx="7" ry="5" fill="rgba(251,191,36,0.18)" />
      {/* Running light */}
      <rect x="103" y="28" width="5" height="3" rx="1" fill="rgba(251,191,36,0.5)" />
    </svg>
  )
}
