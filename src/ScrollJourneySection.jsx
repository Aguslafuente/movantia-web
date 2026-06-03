import { useRef, useState, useEffect } from 'react'
import { Package, Zap, Lock, CheckCircle2 } from 'lucide-react'

const PATH_D = 'M 60,88 C 220,14 540,14 700,88'

// Linear interpolation
function lerp(t, a, b) {
  return a + (b - a) * Math.min(1, Math.max(0, t))
}
// Map progress [in0,in1] → [out0,out1]
function mapRange(p, in0, in1, out0, out1) {
  const t = Math.min(1, Math.max(0, (p - in0) / (in1 - in0)))
  return lerp(t, out0, out1)
}

const EVENTS = [
  { Icon: Package,      label: 'Carga publicada',    sub: '8 pallets · Maldonado', col: '#f0a500', start: 0.00, end: 0.10 },
  { Icon: Zap,          label: 'Match detectado',    sub: 'Transportista en ruta',  col: '#a78bfa', start: 0.03, end: 0.16 },
  { Icon: Lock,         label: 'Pago protegido',     sub: 'USD 130 retenido',      col: '#38bdf8', start: 0.17, end: 0.30 },
  { Icon: CheckCircle2, label: 'Entrega confirmada', sub: 'Pago liberado',         col: '#00d68f', start: 0.32, end: 0.46 },
]

export default function ScrollJourneySection() {
  const outerRef = useRef(null)
  const [p, setP] = useState(0) // 0–1 progress

  useEffect(() => {
    function onScroll() {
      const el = outerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrollable = el.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      // How far we've scrolled into the outer div
      const scrolled = -rect.top
      const progress = Math.min(1, Math.max(0, scrolled / scrollable))
      setP(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const pathLen   = mapRange(p, 0.0,  0.26, 0, 1)
  const truckLeft = mapRange(p, 0.0,  0.42, 2, 86)
  const truckOp   = mapRange(p, 0.0,  0.08, 0, 1)
  const revOp     = mapRange(p, 0.37, 0.52, 0, 1)
  const revY      = mapRange(p, 0.37, 0.52, 16, 0)
  const revSc     = mapRange(p, 0.37, 0.52, 0.93, 1)

  return (
    <div ref={outerRef} className="journey-outer">
      <div className="journey-sticky">

        {/* Heading */}
        <div className="journey-head container anim-fadein">
          <p className="section-eyebrow">Así funciona un match</p>
          <h2 className="journey-title">
            De retorno vacío<br />a ingreso confirmado
          </h2>
        </div>

        {/* Route map */}
        <div className="journey-map-wrap container">
          <svg
            viewBox="0 0 760 108"
            className="journey-svg"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="jGlow" x="-20%" y="-100%" width="140%" height="300%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ghost dashed path */}
            <path
              d={PATH_D}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="2"
              strokeDasharray="7 12"
              strokeLinecap="round"
            />

            {/* Animated path via strokeDashoffset */}
            <path
              d={PATH_D}
              stroke="#f0a500"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#jGlow)"
              style={{
                strokeDasharray: 800,
                strokeDashoffset: 800 * (1 - pathLen),
              }}
            />

            {/* Origin dot */}
            <circle cx="60" cy="88" r="7" fill="#020509" stroke="#f0a500" strokeWidth="2" />
            <circle cx="60" cy="88" r="3" fill="#f0a500" />

            {/* Destination dot */}
            <circle cx="700" cy="88" r="7" fill="#020509" stroke="#00d68f" strokeWidth="2" />
            <circle cx="700" cy="88" r="3" fill="#00d68f" />
          </svg>

          {/* City labels */}
          <div className="journey-labels">
            <span className="journey-city-lbl" style={{ color: '#f0a500' }}>Maldonado</span>
            <span className="journey-city-lbl" style={{ color: '#00d68f' }}>Montevideo</span>
          </div>

          {/* Truck */}
          <div
            className="journey-truck"
            style={{ left: `${truckLeft}%`, opacity: truckOp }}
            aria-hidden="true"
          >
            <TruckMini />
          </div>
        </div>

        {/* Events */}
        <div className="journey-events container">
          {EVENTS.map((ev, i) => {
            const op  = mapRange(p, ev.start, ev.end, 0, 1)
            const ty  = mapRange(p, ev.start, ev.end, 12, 0)
            return (
              <div
                key={i}
                className="journey-event"
                style={{ opacity: op, transform: `translateY(${ty}px)` }}
              >
                <div className="journey-event-icon" style={{ color: ev.col, borderColor: ev.col }}>
                  <ev.Icon size={15} />
                </div>
                <p className="journey-event-label">{ev.label}</p>
                <span className="journey-event-sub">{ev.sub}</span>
              </div>
            )
          })}
        </div>

        {/* Revenue */}
        <div
          className="journey-revenue-wrap container"
          style={{
            opacity: revOp,
            transform: `translateY(${revY}px) scale(${revSc})`,
          }}
        >
          <div className="journey-revenue">
            <span>Ingreso generado en este retorno</span>
            <strong>USD 130</strong>
            <p>Por un viaje que antes no facturabas</p>
          </div>
        </div>

      </div>
    </div>
  )
}

function TruckMini() {
  return (
    <svg viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="36">
      <rect x="1" y="4" width="47" height="21" rx="2" fill="#111827" stroke="rgba(240,165,0,0.25)" strokeWidth="1.2" />
      <line x1="17" y1="4" x2="17" y2="25" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <line x1="32" y1="4" x2="32" y2="25" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="48" y="1" width="29" height="24" rx="3" fill="#1e2d3d" stroke="#f0a500" strokeWidth="1.2" />
      <rect x="53" y="4" width="14" height="10" rx="1.5" fill="rgba(56,189,248,0.55)" />
      <rect x="49" y="0" width="3" height="6" rx="1" fill="#0f172a" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
      <circle cx="15" cy="30" r="5" fill="#0f172a" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" />
      <circle cx="31" cy="30" r="5" fill="#0f172a" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" />
      <circle cx="62" cy="30" r="5" fill="#0f172a" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" />
      <circle cx="15" cy="30" r="2" fill="rgba(255,255,255,0.1)" />
      <circle cx="31" cy="30" r="2" fill="rgba(255,255,255,0.1)" />
      <circle cx="62" cy="30" r="2" fill="rgba(255,255,255,0.1)" />
      <circle cx="77" cy="10" r="2.5" fill="#f0a500" />
      <ellipse cx="77" cy="10" rx="5" ry="3.5" fill="rgba(240,165,0,0.14)" />
    </svg>
  )
}
