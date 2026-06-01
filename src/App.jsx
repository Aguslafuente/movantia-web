import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowDown,
  BarChart3,
  Building2,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  PhoneCall,
  Route,
  Shield,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react'
import './App.css'
import ScrollTruckSection from './ScrollTruckSection'

const WA = 'https://wa.me/59898534165?text=Hola%2C%20quiero%20consultar%20por%20Movantia%20Cargo'
const WA_ENVIAR = 'https://wa.me/59898534165?text=Hola%2C%20quiero%20enviar%20una%20carga%20con%20Movantia'
const WA_LLEVAR = 'https://wa.me/59898534165?text=Hola%2C%20quiero%20llevar%20carga%20con%20Movantia'

const ROUTES = [
  'Montevideo - Maldonado',
  'Montevideo - Colonia',
  'Montevideo - Paysandu',
  'Montevideo - Rivera',
  'Montevideo - Punta del Este',
]

const ENVIAR_STEPS = [
  { icon: <Package size={22}/>, num:'01', title:'Publicás tu carga', text:'Completás origen, destino, peso, tipo de mercadería y fecha. Tarda 2 minutos.' },
  { icon: <Zap size={22}/>, num:'02', title:'Recibís un match', text:'Movantia cruza tu carga con transportistas que ya tienen ruta planificada hacia tu destino.' },
  { icon: <CreditCard size={22}/>, num:'03', title:'Pagás seguro', text:'Pagás con tarjeta. El dinero queda retenido en escrow hasta confirmar la entrega.' },
  { icon: <CheckCircle2 size={22}/>, num:'04', title:'Confirmación de entrega', text:'El transportista confirma entrega. El pago se libera automáticamente. Listo.' },
]

const LLEVAR_STEPS = [
  { icon: <Route size={22}/>, num:'01', title:'Publicás tu retorno', text:'Indicás tu ruta de vuelta, fecha, tipo de camión y espacio disponible.' },
  { icon: <Zap size={22}/>, num:'02', title:'Match con carga disponible', text:'Te mostramos cargas compatibles con tu ruta que ya pagaron o están listas para pagar.' },
  { icon: <Shield size={22}/>, num:'03', title:'Confirmás y cargás', text:'Aceptás las condiciones y retirás la mercadería. El pago queda garantizado.' },
  { icon: <BarChart3 size={22}/>, num:'04', title:'Cobrás al entregar', text:'Entregás, confirmás en la app y el pago se libera. Retorno que antes no facturabas.' },
]

export default function App() {
  const [role, setRole] = useState(null)
  const roleRef = useRef(null)
  const howRef = useRef(null)

  const pickRole = (r) => {
    setRole(r)
    setTimeout(() => howRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  return (
    <div className="site-shell">
      <div className="page-bg" aria-hidden="true">
        <div className="page-bg-grid" />
      </div>

      {/* HEADER */}
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#" aria-label="Movantia inicio">
            <span className="brand-mark" aria-hidden="true">
              <img src="/movantia-logo-crop.png" alt="" />
            </span>
            <span>
              <span className="brand-name">Movantia</span>
              <span className="brand-tagline">Cargo Matching</span>
            </span>
          </a>
          <nav className="nav-links">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#rutas">Rutas</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <a href={WA} className="button button-primary" target="_blank" rel="noopener">
            Hablar con nosotros
          </a>
        </div>
      </header>

      <main>
        {/* ══════════════════════════════════════
            HERO — hook inmediato
        ══════════════════════════════════════ */}
        <section className="v2-hero container">
          <motion.div
            className="v2-hero-copy"
            initial={{ opacity:0, y:36 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:.7, ease:[.22,1,.36,1] }}
          >
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <Route size={15} />
              Freight matching · Uruguay
            </div>

            <h1 className="v2-hero-h1">
              El camión<br/>
              vuelve vacío.<br/>
              <span className="h1-accent">Lo llenamos.</span>
            </h1>

            <p className="v2-hero-sub">
              Movantia conecta mercadería que necesita moverse con camiones
              que ya tienen ruta planificada. Menos costos, más margen,
              pago garantizado.
            </p>

            <div className="v2-hero-stats">
              <div className="v2-stat"><strong>B2B</strong><span>Sin delivery masivo</span></div>
              <div className="v2-stat-div" />
              <div className="v2-stat"><strong>Escrow</strong><span>Pago garantizado</span></div>
              <div className="v2-stat-div" />
              <div className="v2-stat"><strong>UY</strong><span>Rutas activas</span></div>
            </div>

            <a href="#elegir" className="v2-scroll-cta" onClick={e=>{ e.preventDefault(); roleRef.current?.scrollIntoView({behavior:'smooth'}) }}>
              <span>Ver cómo funciona</span>
              <ArrowDown size={18} />
            </a>
          </motion.div>

          <motion.div
            className="v2-hero-visual"
            initial={{ opacity:0, y:48 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:.8, delay:.2, ease:[.22,1,.36,1] }}
          >
            <RouteCard />
          </motion.div>
        </section>

        <ScrollTruckSection />

        {/* ══════════════════════════════════════
            ROLE CHOOSER
        ══════════════════════════════════════ */}
        <section id="elegir" ref={roleRef} className="v2-chooser container">
          <motion.div
            className="v2-chooser-head"
            initial={{ opacity:0, y:28 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, margin:'-80px' }}
            transition={{ duration:.6, ease:[.22,1,.36,1] }}
          >
            <p className="section-eyebrow">Elegí tu rol</p>
            <h2 className="v2-chooser-title">¿Qué querés hacer?</h2>
            <p className="v2-chooser-sub">
              Dos lados del mismo match. Elegí el tuyo para ver cómo funciona.
            </p>
          </motion.div>

          <div className="v2-chooser-cards">
            <ChooserCard
              active={role === 'enviar'}
              color="gold"
              icon={<Package size={36} />}
              label="Enviar carga"
              desc="Tengo mercadería y necesito transportarla a otro punto del país sin pagar flete completo."
              cta="Quiero enviar"
              onClick={() => pickRole('enviar')}
            />
            <ChooserCard
              active={role === 'llevar'}
              color="green"
              icon={<Truck size={36} />}
              label="Llevar carga"
              desc="Tengo un camión con espacio libre en el retorno y quiero convertir esos kilómetros en ingreso."
              cta="Quiero llevar"
              onClick={() => pickRole('llevar')}
            />
          </div>
        </section>

        {/* ══════════════════════════════════════
            HOW IT WORKS (role-specific)
        ══════════════════════════════════════ */}
        <div ref={howRef} id="como-funciona">
          <AnimatePresence mode="wait">
            {role && (
              <motion.section
                key={role}
                className="v2-how container section-block"
                initial={{ opacity:0, y:40 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-20 }}
                transition={{ duration:.55, ease:[.22,1,.36,1] }}
              >
                {/* toggle */}
                <div className="v2-how-toggle">
                  <button className={`role-btn${role==='enviar'?' active':''}`} onClick={()=>setRole('enviar')}>
                    <Package size={15}/> Enviar carga
                  </button>
                  <button className={`role-btn${role==='llevar'?' active':''}`} onClick={()=>setRole('llevar')}>
                    <Truck size={15}/> Llevar carga
                  </button>
                </div>

                <div className="v2-how-inner">
                  {/* Left: animated demo */}
                  <div className="v2-how-demo">
                    {role === 'enviar' ? <EnviarDemo /> : <LlevarDemo />}
                  </div>

                  {/* Right: steps */}
                  <div className="v2-how-steps">
                    <p className="section-eyebrow">{role === 'enviar' ? 'Para clientes' : 'Para transportistas'}</p>
                    <h2 className="v2-how-title">
                      {role === 'enviar'
                        ? 'Tu carga llega. Simple y seguro.'
                        : 'Tu retorno empieza a facturar.'}
                    </h2>
                    <div className="v2-steps-list">
                      {(role === 'enviar' ? ENVIAR_STEPS : LLEVAR_STEPS).map((s, i) => (
                        <motion.div
                          key={s.num}
                          className="v2-step"
                          initial={{ opacity:0, x:24 }}
                          animate={{ opacity:1, x:0 }}
                          transition={{ delay: i * 0.1 + .15, duration:.5, ease:[.22,1,.36,1] }}
                        >
                          <div className={`v2-step-icon ${role}`}>{s.icon}</div>
                          <div>
                            <span className="v2-step-num">{s.num}</span>
                            <h3>{s.title}</h3>
                            <p>{s.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <a
                      href={role === 'enviar' ? WA_ENVIAR : WA_LLEVAR}
                      className="button button-primary v2-how-cta"
                      target="_blank" rel="noopener"
                    >
                      {role === 'enviar' ? 'Publicar mi carga' : 'Publicar mi ruta'}
                      <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* ══════════════════════════════════════
            RUTAS
        ══════════════════════════════════════ */}
        <section id="rutas" className="container section-block">
          <div className="companies-panel">
            <div>
              <p className="section-eyebrow">Rutas activas</p>
              <h2>Para rutas repetidas donde hoy se pierde margen.</h2>
              <p>
                Pensado para empresas que mueven mercadería recurrente y flotas
                con espacio libre en rutas ya planificadas.
              </p>
            </div>
            <div className="route-list">
              {ROUTES.map(r => (
                <div className="route-item" key={r}>
                  <CheckCircle2 size={19} />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA FINAL
        ══════════════════════════════════════ */}
        <section id="contacto" className="container contact-section">
          <h2>¿Tenés una ruta con kilómetros vacíos?</h2>
          <p>
            Mandanos origen, destino y fecha. Te decimos si hay carga o camión
            disponible para validar el primer match.
          </p>
          <a href={WA} className="button button-primary" target="_blank" rel="noopener">
            Cotizar por WhatsApp
            <ArrowRight size={18} />
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>2026 Movantia. Cargo Matching.</p>
          <p>Uruguay · Transporte B2B · Retornos vacíos</p>
        </div>
      </footer>
    </div>
  )
}

/* ──────────────────────────────────────
   CHOOSER CARD
────────────────────────────────────── */
function ChooserCard({ active, color, icon, label, desc, cta, onClick }) {
  return (
    <motion.button
      className={`v2-chooser-card v2-chooser-card--${color}${active ? ' active' : ''}`}
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity:0, y:32 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ duration:.55, ease:[.22,1,.36,1] }}
    >
      <div className="v2-chooser-card-icon">{icon}</div>
      <strong>{label}</strong>
      <span>{desc}</span>
      <div className="v2-chooser-card-cta">
        {cta} <ArrowRight size={15} />
      </div>
      {active && <div className="v2-chooser-card-active-bar" />}
    </motion.button>
  )
}

/* ──────────────────────────────────────
   ENVIAR DEMO — animated flow
────────────────────────────────────── */
function EnviarDemo() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % 4), 2000)
    return () => clearInterval(t)
  }, [])

  const DEMO_STEPS = [
    { icon: <Package size={28}/>, label: 'Publicás tu carga', sub: 'Origen · Destino · Peso', color: '#fbbf24' },
    { icon: <Zap size={28}/>,     label: 'Match detectado',   sub: 'Transportista disponible', color: '#a78bfa' },
    { icon: <CreditCard size={28}/>, label: 'Pago en escrow', sub: 'Dinero retenido seguro', color: '#38bdf8' },
    { icon: <CheckCircle2 size={28}/>, label: '¡Entregado!',  sub: 'Pago liberado', color: '#4ade80' },
  ]

  return (
    <div className="v2-demo v2-demo--enviar">
      <div className="v2-demo-phone">
        <div className="v2-demo-phone-bar">
          <span className="v2-demo-phone-dot" />
          <span className="v2-demo-phone-dot" />
          <span className="v2-demo-phone-dot" />
        </div>

        <div className="v2-demo-header">
          <span className="v2-demo-badge gold">Enviar carga</span>
          <p className="v2-demo-header-title">Nueva solicitud</p>
        </div>

        <div className="v2-demo-flow">
          {DEMO_STEPS.map((s, i) => (
            <div key={i} className={`v2-demo-flow-step${step === i ? ' active' : step > i ? ' done' : ''}`}>
              <div className="v2-demo-flow-icon" style={{ '--demo-color': s.color }}>
                {step > i ? <CheckCircle2 size={20}/> : s.icon}
              </div>
              <div className="v2-demo-flow-text">
                <strong>{s.label}</strong>
                <span>{s.sub}</span>
              </div>
              <div className="v2-demo-flow-status">
                {step > i && <span className="v2-demo-ok">✓</span>}
                {step === i && <span className="v2-demo-spinner" />}
              </div>
              {i < 3 && <div className={`v2-demo-flow-line${step > i ? ' done' : ''}`} />}
            </div>
          ))}
        </div>

        {step === 3 && (
          <div className="v2-demo-success">
            <strong>USD 260 liberado</strong>
            <span>Entrega confirmada · Maldonado</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────
   LLEVAR DEMO — animated route fill
────────────────────────────────────── */
function LlevarDemo() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % 4), 2200)
    return () => clearInterval(t)
  }, [])

  const LABELS = ['Publicás retorno', 'Match encontrado', 'Carga confirmada', 'Cobro liberado']
  const COLORS = ['#64748b', '#a78bfa', '#fbbf24', '#4ade80']

  return (
    <div className="v2-demo v2-demo--llevar">
      <div className="v2-demo-phone">
        <div className="v2-demo-phone-bar">
          <span className="v2-demo-phone-dot" />
          <span className="v2-demo-phone-dot" />
          <span className="v2-demo-phone-dot" />
        </div>

        <div className="v2-demo-header">
          <span className="v2-demo-badge green">Llevar carga</span>
          <p className="v2-demo-header-title">Retorno activo</p>
        </div>

        {/* Route visual */}
        <div className="v2-demo-route">
          <svg viewBox="0 0 260 100" className="v2-demo-route-svg">
            <defs>
              <linearGradient id="rGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24"/>
                <stop offset="100%" stopColor="#22c55e"/>
              </linearGradient>
              <filter id="rGlow">
                <feGaussianBlur stdDeviation="2" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <path d="M 16 72 C 60 28 200 28 244 72" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="5 8"/>
            <path id="rPath" d="M 16 72 C 60 28 200 28 244 72" fill="none" stroke="url(#rGrad)" strokeWidth="2.5" strokeLinecap="round" filter="url(#rGlow)"/>
            <circle cx="16" cy="72" r="5" fill="#0b1018" stroke="#fbbf24" strokeWidth="1.5"/>
            <circle cx="16" cy="72" r="2" fill="#fbbf24"/>
            <text x="16" y="88" fill="#475569" fontSize="7" fontWeight="700" textAnchor="middle">ORIGEN</text>
            <circle cx="244" cy="72" r="5" fill="#0b1018" stroke="#22c55e" strokeWidth="1.5"/>
            <circle cx="244" cy="72" r="2" fill="#22c55e"/>
            <text x="244" y="88" fill="#475569" fontSize="7" fontWeight="700" textAnchor="middle">DESTINO</text>
            <g>
              <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
                <mpath href="#rPath"/>
              </animateMotion>
              <rect x="-13" y="-5" width="18" height="9" rx="1.5" fill="#111827" stroke="rgba(251,191,36,0.4)" strokeWidth="1"/>
              <rect x="5" y="-6.5" width="10" height="11" rx="2" fill="#1e2d3d" stroke="#fbbf24" strokeWidth="1.2"/>
              <rect x="6.5" y="-5" width="5" height="3.5" rx="0.8" fill="rgba(56,189,248,0.7)"/>
              <circle cx="-5" cy="5.5" r="2.5" fill="#0f172a" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              <circle cx="6"  cy="5.5" r="2.5" fill="#0f172a" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            </g>
          </svg>

          <div className="v2-demo-route-info">
            <div className="v2-demo-route-stat">
              <span>Estado</span>
              <strong style={{ color: COLORS[step] }}>{LABELS[step]}</strong>
            </div>
            <div className="v2-demo-route-stat">
              <span>Ingreso est.</span>
              <strong>USD {[0, 0, 130, 130][step] || 0}</strong>
            </div>
          </div>
        </div>

        {/* Progress steps */}
        <div className="v2-demo-progress">
          {LABELS.map((l, i) => (
            <div key={i} className={`v2-demo-prog-step${i <= step ? ' done' : ''}`}>
              <div className="v2-demo-prog-dot" />
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────
   ROUTE CARD (hero)
────────────────────────────────────── */
function RouteCard() {
  return (
    <div className="route-card" style={{ animation: 'floatCard 7s ease-in-out infinite 1s' }}>
      <div className="route-card-header">
        <div>
          <p>Retorno vacío detectado</p>
          <h2>Maldonado → Montevideo</h2>
        </div>
        <span className="live-badge">
          <span className="live-dot" />
          Match activo
        </span>
      </div>
      <div className="route-map">
        <RouteMapSVG />
      </div>
      <div className="info-list">
        <InfoRow icon={<Truck />}      label="Viaje"  value="Vuelve vacío" />
        <InfoRow icon={<Building2 />}  label="Carga"  value="8 pallets" />
        <InfoRow icon={<CreditCard />} label="Pago"   value="Tarjeta / escrow" />
        <InfoRow icon={<ShieldCheck />}label="Seguro" value="Verificado" />
      </div>
      <div className="revenue-box">
        <p>Ingreso recuperado estimado</p>
        <strong>USD 130</strong>
        <span>por una vuelta que antes no facturabas</span>
      </div>
    </div>
  )
}

function RouteMapSVG() {
  return (
    <svg viewBox="0 0 400 175" className="route-map-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <filter id="rmGlow" x="-10%" y="-100%" width="120%" height="300%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {[40,80,120,160,200,240,280,320,360].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="175" stroke="rgba(255,255,255,0.035)" strokeWidth="1"/>
      ))}
      {[35,70,105,140].map(y => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.035)" strokeWidth="1"/>
      ))}
      <path d="M 26 128 C 80 50 320 50 374 128" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round"/>
      <path id="rmPath" d="M 26 128 C 80 50 320 50 374 128" fill="none" stroke="url(#rmGrad)" strokeWidth="3" strokeLinecap="round" filter="url(#rmGlow)"/>
      <circle cx="26" cy="128" r="8" fill="rgba(11,16,24,0.9)" stroke="#fbbf24" strokeWidth="1.5"/>
      <circle cx="26" cy="128" r="3" fill="#fbbf24"/>
      <text x="26" y="152" fill="#64748b" fontSize="9" fontWeight="700" letterSpacing="0.8" textAnchor="middle">MALDONADO</text>
      <circle cx="374" cy="128" r="8" fill="rgba(11,16,24,0.9)" stroke="#22c55e" strokeWidth="1.5"/>
      <circle cx="374" cy="128" r="3" fill="#22c55e"/>
      <text x="374" y="152" fill="#64748b" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="0.8">MONTEVIDEO</text>
      <g>
        <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" calcMode="linear">
          <mpath href="#rmPath"/>
        </animateMotion>
        <rect x="-20" y="-7" width="26" height="13" rx="2" fill="#111827" stroke="rgba(251,191,36,0.4)" strokeWidth="1"/>
        <line x1="-12" y1="-7" x2="-12" y2="6" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
        <line x1="-4"  y1="-7" x2="-4"  y2="6" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
        <rect x="6" y="-9" width="14" height="16" rx="2.5" fill="#1e2d3d" stroke="#fbbf24" strokeWidth="1.5"/>
        <rect x="9" y="-7" width="7" height="5" rx="1" fill="rgba(56,189,248,0.75)"/>
        <circle cx="-10" cy="8" r="3.5" fill="#0f172a" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
        <circle cx="8"   cy="8" r="3.5" fill="#0f172a" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
        <circle cx="-10" cy="8" r="1.2" fill="rgba(255,255,255,0.18)"/>
        <circle cx="8"   cy="8" r="1.2" fill="rgba(255,255,255,0.18)"/>
        <circle cx="21" cy="-1.5" r="1.8" fill="#fbbf24"/>
        <ellipse cx="21" cy="-1.5" rx="5" ry="3.5" fill="rgba(251,191,36,0.15)"/>
      </g>
    </svg>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="info-row">
      <div>
        {React.cloneElement(icon, { size: 17, 'aria-hidden': true })}
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </div>
  )
}
