import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Package, Zap, Lock, CheckCircle2 } from 'lucide-react'

const PATH_D = 'M 60,88 C 220,14 540,14 700,88'

export default function ScrollJourneySection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Path drawing
  const pathLen  = useTransform(scrollYProgress, [0.06, 0.68], [0, 1])

  // Truck slides left→right
  const truckLeft = useTransform(scrollYProgress, [0.10, 0.86], ['2%', '86%'])
  const truckOp   = useTransform(scrollYProgress, [0.08, 0.17], [0, 1])

  // Section heading
  const headOp = useTransform(scrollYProgress, [0.0, 0.08], [0, 1])
  const headY  = useTransform(scrollYProgress, [0.0, 0.08], [22, 0])

  // Events — each pops in at a different threshold
  const e1op = useTransform(scrollYProgress, [0.18, 0.28], [0, 1])
  const e1y  = useTransform(scrollYProgress, [0.18, 0.28], [14, 0])
  const e2op = useTransform(scrollYProgress, [0.36, 0.46], [0, 1])
  const e2y  = useTransform(scrollYProgress, [0.36, 0.46], [14, 0])
  const e3op = useTransform(scrollYProgress, [0.54, 0.64], [0, 1])
  const e3y  = useTransform(scrollYProgress, [0.54, 0.64], [14, 0])
  const e4op = useTransform(scrollYProgress, [0.72, 0.82], [0, 1])
  const e4y  = useTransform(scrollYProgress, [0.72, 0.82], [14, 0])

  // Revenue appears last
  const revOp = useTransform(scrollYProgress, [0.82, 0.93], [0, 1])
  const revY  = useTransform(scrollYProgress, [0.82, 0.93], [20, 0])
  const revSc = useTransform(scrollYProgress, [0.82, 0.93], [0.92, 1])

  const EVENTS = [
    {
      op: e1op, y: e1y, Icon: Package,
      label: 'Carga publicada',
      sub: '8 pallets · Maldonado',
      col: 'var(--gold)',
    },
    {
      op: e2op, y: e2y, Icon: Zap,
      label: 'Match detectado',
      sub: 'Transportista en ruta',
      col: '#a78bfa',
    },
    {
      op: e3op, y: e3y, Icon: Lock,
      label: 'Pago en escrow',
      sub: 'USD 130 retenido',
      col: '#38bdf8',
    },
    {
      op: e4op, y: e4y, Icon: CheckCircle2,
      label: 'Entrega confirmada',
      sub: 'Pago liberado',
      col: 'var(--green)',
    },
  ]

  return (
    <div ref={ref} className="journey-outer">
      <div className="journey-sticky">

        {/* Heading */}
        <motion.div
          className="journey-head container"
          style={{ opacity: headOp, y: headY }}
        >
          <p className="section-eyebrow">Así funciona un match</p>
          <h2 className="journey-title">
            De retorno vacío<br />a ingreso confirmado
          </h2>
        </motion.div>

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
              <linearGradient id="jGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#f0a500" />
                <stop offset="100%" stopColor="#00d68f" />
              </linearGradient>
              <filter id="jGlow" x="-20%" y="-100%" width="140%" height="300%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ghost path */}
            <path
              d={PATH_D}
              stroke="rgba(255,255,255,0.055)"
              strokeWidth="2"
              strokeDasharray="7 12"
              strokeLinecap="round"
            />

            {/* Animated drawn path */}
            <motion.path
              d={PATH_D}
              stroke="url(#jGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#jGlow)"
              style={{ pathLength: pathLen }}
            />

            {/* Origin dot — Maldonado */}
            <circle cx="60" cy="88" r="7" fill="rgba(2,5,9,0.95)" stroke="#f0a500" strokeWidth="2" />
            <circle cx="60" cy="88" r="3" fill="#f0a500" />

            {/* Destination dot — Montevideo */}
            <circle cx="700" cy="88" r="7" fill="rgba(2,5,9,0.95)" stroke="#00d68f" strokeWidth="2" />
            <circle cx="700" cy="88" r="3" fill="#00d68f" />
          </svg>

          {/* City labels */}
          <div className="journey-labels">
            <span className="journey-city-lbl" style={{ color: 'var(--gold)' }}>
              Maldonado
            </span>
            <span className="journey-city-lbl" style={{ color: 'var(--green)' }}>
              Montevideo
            </span>
          </div>

          {/* Truck */}
          <motion.div
            className="journey-truck"
            style={{ left: truckLeft, opacity: truckOp }}
            aria-hidden="true"
          >
            <TruckMini />
          </motion.div>
        </div>

        {/* Events */}
        <div className="journey-events container">
          {EVENTS.map((ev, i) => (
            <motion.div
              key={i}
              className="journey-event"
              style={{ opacity: ev.op, y: ev.y }}
            >
              <div
                className="journey-event-icon"
                style={{ color: ev.col, borderColor: ev.col }}
              >
                <ev.Icon size={15} />
              </div>
              <p className="journey-event-label">{ev.label}</p>
              <span className="journey-event-sub">{ev.sub}</span>
            </motion.div>
          ))}
        </div>

        {/* Revenue reveal */}
        <motion.div
          className="journey-revenue-wrap container"
          style={{ opacity: revOp, y: revY, scale: revSc }}
        >
          <div className="journey-revenue">
            <span>Ingreso generado en este retorno</span>
            <strong>USD 130</strong>
            <p>Por un viaje que antes no facturabas</p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

function TruckMini() {
  return (
    <svg viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="36">
      {/* Trailer */}
      <rect x="1" y="4" width="47" height="21" rx="2" fill="#111827" stroke="rgba(240,165,0,0.25)" strokeWidth="1.2" />
      <line x1="17" y1="4" x2="17" y2="25" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <line x1="32" y1="4" x2="32" y2="25" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {/* Cab */}
      <rect x="48" y="1" width="29" height="24" rx="3" fill="#1e2d3d" stroke="#f0a500" strokeWidth="1.2" />
      <rect x="53" y="4" width="14" height="10" rx="1.5" fill="rgba(56,189,248,0.55)" />
      {/* Exhaust */}
      <rect x="49" y="0" width="3" height="6" rx="1" fill="#0f172a" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
      {/* Wheels */}
      <circle cx="15" cy="30" r="5" fill="#0f172a" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" />
      <circle cx="31" cy="30" r="5" fill="#0f172a" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" />
      <circle cx="62" cy="30" r="5" fill="#0f172a" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" />
      <circle cx="15" cy="30" r="2" fill="rgba(255,255,255,0.1)" />
      <circle cx="31" cy="30" r="2" fill="rgba(255,255,255,0.1)" />
      <circle cx="62" cy="30" r="2" fill="rgba(255,255,255,0.1)" />
      {/* Headlight */}
      <circle cx="77" cy="10" r="2.5" fill="#f0a500" />
      <ellipse cx="77" cy="10" rx="5" ry="3.5" fill="rgba(240,165,0,0.14)" />
    </svg>
  )
}
