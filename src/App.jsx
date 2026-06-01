import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  CreditCard,
  PhoneCall,
  Route,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import './App.css'
import ScrollTruckSection from './ScrollTruckSection'

const WHATSAPP_URL =
  'https://wa.me/59898534165?text=Hola%2C%20quiero%20consultar%20por%20Movantia%20Cargo'

const ROUTES = [
  'Montevideo - Maldonado',
  'Montevideo - Colonia',
  'Montevideo - Paysandu',
  'Montevideo - Rivera',
  'Montevideo - Punta del Este',
]

/* Animated counter hook */
function useCounter(target, duration = 1200, delay = 800) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setTimeout(() => {
          const start = performance.now()
          const tick = (now) => {
            const pct = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - pct, 3)
            setValue(Math.round(ease * target))
            if (pct < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }, delay)
      },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, delay])

  return [value, ref]
}

export default function App() {
  return (
    <div className="site-shell">
      <div className="page-bg" aria-hidden="true">
        <div className="page-bg-grid" />
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#inicio" aria-label="Movantia inicio">
            <span className="brand-mark" aria-hidden="true">
              <img src="/movantia-logo-crop.png" alt="" />
            </span>
            <span>
              <span className="brand-name">Movantia</span>
              <span className="brand-tagline">Cargo Matching</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Secciones principales">
            <a href="#como-funciona">Como funciona</a>
            <a href="#beneficios">Beneficios</a>
            <a href="#empresas">Empresas</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <a href={WHATSAPP_URL} className="button button-primary">
            Cotizar ruta
          </a>
        </div>
      </header>

      <main id="inicio">
        <section className="container hero-section">
          <div className="hero-copy">
            <img
              className="hero-logo"
              src="/movantia-logo-crop.png"
              alt="Movantia - Fill Empty Miles"
            />

            <div className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              <Route size={16} aria-hidden="true" />
              Freight matching para kilometros vacios.
            </div>

            <h1>Que cada retorno vuelva facturando.</h1>

            <p className="hero-text">
              Movantia conecta empresas con transportistas que ya tienen ruta
              planificada. Menos combustible desperdiciado, mas utilizacion de
              flota y pagos retenidos hasta confirmar la entrega.
            </p>

            <div className="hero-actions">
              <a href={WHATSAPP_URL} className="button button-primary">
                Cotizar por WhatsApp
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a href="#como-funciona" className="button button-secondary">
                Ver como funciona
              </a>
            </div>

            <div className="metrics" aria-label="Indicadores Movantia">
              <Metric number="B2B" text="no delivery" />
              <Metric number="+$" text="por retorno" />
              <Metric number="UY" text="rutas activas" />
            </div>
          </div>

          <div className="hero-visual" aria-label="Ejemplo de carga disponible">
            <div className="route-card">
              <div className="route-card-header">
                <div>
                  <p>Retorno vacio detectado</p>
                  <h2>Maldonado → Montevideo</h2>
                </div>
                <span className="live-badge">
                  <span className="live-dot" aria-hidden="true" />
                  Match activo
                </span>
              </div>

              <div className="route-map" aria-hidden="true">
                <RouteMapSVG />
              </div>

              <div className="info-list">
                <InfoRow icon={<Truck />} label="Viaje" value="Vuelve vacio" />
                <InfoRow icon={<Building2 />} label="Carga" value="8 pallets" />
                <InfoRow
                  icon={<CreditCard />}
                  label="Pago"
                  value="Tarjeta / escrow"
                />
                <InfoRow icon={<ShieldCheck />} label="Seguro" value="Verificado" />
              </div>

              <div className="revenue-box">
                <p>Ingreso recuperado estimado</p>
                <RevenueDisplay />
                <span>por una vuelta que antes no facturaba</span>
              </div>
            </div>
          </div>
        </section>

        <ScrollTruckSection />

        <section id="como-funciona" className="container section-block">
          <SectionTitle
            eyebrow="Como funciona"
            title="Marketplace simple. Pago retenido. Entrega confirmada."
          />

          <div className="step-grid">
            <Step
              number="01"
              title="Empresa publica carga"
              text="Origen, destino, peso, tipo de mercaderia, fecha y condiciones."
            />
            <Step
              number="02"
              title="Transportista publica viaje"
              text="Ruta, fecha, tipo de camion, espacio disponible y precio esperado."
            />
            <Step
              number="03"
              title="Match, pago y liberacion"
              text="Cliente paga con tarjeta. Movantia retiene. Se libera al entregar."
            />
          </div>
        </section>

        <section id="beneficios" className="container section-block benefits-section">
          <div>
            <p className="section-eyebrow">Beneficios</p>
            <h2>Mas margen por camion. Sin inventar viajes nuevos.</h2>
            <p>
              Cada kilometro vacio consume combustible y margen. Movantia
              convierte capacidad libre en facturacion adicional para flotas y
              mejores precios para empresas.
            </p>
          </div>

          <div className="benefit-list">
            <Benefit
              icon={<BarChart3 />}
              title="Ingreso adicional"
              text="La unidad ya tiene retorno. Ahora puede volver facturando."
            />
            <Benefit
              icon={<ShieldCheck />}
              title="Matching inteligente"
              text="Cruzamos carga, ruta, fecha, capacidad y tipo de camion."
            />
            <Benefit
              icon={<CreditCard />}
              title="Pago seguro"
              text="El cliente paga antes. El transportista cobra al entregar."
            />
            <Benefit
              icon={<PhoneCall />}
              title="Validacion rapida"
              text="Arrancamos por WhatsApp con control humano y matches reales."
            />
          </div>
        </section>

        <section id="empresas" className="container section-block">
          <div className="companies-panel">
            <div>
              <p className="section-eyebrow">Para empresas</p>
              <h2>Para rutas repetidas donde hoy se pierde margen.</h2>
              <p>
                Pensado para empresas que mueven mercaderia recurrente y flotas
                con espacio libre en rutas ya planificadas.
              </p>
            </div>

            <div className="route-list">
              {ROUTES.map((route) => (
                <div className="route-item" key={route}>
                  <CheckCircle2 size={19} aria-hidden="true" />
                  <span>{route}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="container contact-section">
          <h2>Tenes una ruta con kilometros vacios?</h2>
          <p>
            Mandanos origen, destino y fecha. Te decimos si hay carga o camion
            disponible para validar el primer match.
          </p>
          <a href={WHATSAPP_URL} className="button button-primary">
            Cotizar por WhatsApp
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>2026 Movantia. Cargo Matching.</p>
          <p>Uruguay · Transporte B2B · Retornos vacios</p>
        </div>
      </footer>
    </div>
  )
}

function RevenueDisplay() {
  const [val, ref] = useCounter(320, 1400, 900)
  return (
    <strong ref={ref}>USD {val}</strong>
  )
}

function RouteMapSVG() {
  return (
    <svg
      viewBox="0 0 400 175"
      className="route-map-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <filter id="rmGlow" x="-10%" y="-100%" width="120%" height="300%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="mapBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(30,41,59,0.6)" />
          <stop offset="100%" stopColor="rgba(9,13,21,0)" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <ellipse cx="200" cy="88" rx="160" ry="60" fill="url(#mapBg)" />

      {/* Grid lines */}
      {[40,80,120,160,200,240,280,320,360].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="175" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {[35,70,105,140].map(y => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* Ghost dashed background path */}
      <path
        d="M 26 128 C 80 50 320 50 374 128"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="2"
        strokeDasharray="6 10"
        strokeLinecap="round"
      />

      {/* Active gradient path */}
      <path
        id="rmPath"
        d="M 26 128 C 80 50 320 50 374 128"
        fill="none"
        stroke="url(#rmGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#rmGlow)"
      />

      {/* Origin — Maldonado */}
      <circle cx="26" cy="128" r="8" fill="rgba(11,16,24,0.9)" stroke="#fbbf24" strokeWidth="1.5" />
      <circle cx="26" cy="128" r="3" fill="#fbbf24" />
      <text x="26" y="152" fill="#64748b" fontSize="9" fontWeight="700" letterSpacing="0.8" textAnchor="middle">MALDONADO</text>

      {/* Destination — Montevideo */}
      <circle cx="374" cy="128" r="8" fill="rgba(11,16,24,0.9)" stroke="#22c55e" strokeWidth="1.5" />
      <circle cx="374" cy="128" r="3" fill="#22c55e" />
      <text x="374" y="152" fill="#64748b" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="0.8">MONTEVIDEO</text>

      {/* Truck */}
      <g>
        <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" calcMode="linear">
          <mpath href="#rmPath" />
        </animateMotion>
        {/* Trailer */}
        <rect x="-20" y="-7" width="26" height="13" rx="2" fill="#111827" stroke="rgba(251,191,36,0.4)" strokeWidth="1" />
        <line x1="-12" y1="-7" x2="-12" y2="6" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <line x1="-4"  y1="-7" x2="-4"  y2="6" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        {/* Cab */}
        <rect x="6" y="-9" width="14" height="16" rx="2.5" fill="#1e2d3d" stroke="#fbbf24" strokeWidth="1.5" />
        {/* Windshield */}
        <rect x="9" y="-7" width="7" height="5" rx="1" fill="rgba(56,189,248,0.75)" />
        {/* Wheels */}
        <circle cx="-10" cy="8" r="3.5" fill="#0f172a" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <circle cx="8"   cy="8" r="3.5" fill="#0f172a" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <circle cx="-10" cy="8" r="1.2" fill="rgba(255,255,255,0.18)" />
        <circle cx="8"   cy="8" r="1.2" fill="rgba(255,255,255,0.18)" />
        {/* Headlight */}
        <circle cx="21" cy="-1.5" r="1.8" fill="#fbbf24" />
        <ellipse cx="21" cy="-1.5" rx="5" ry="3.5" fill="rgba(251,191,36,0.15)" />
      </g>
    </svg>
  )
}

function Metric({ number, text }) {
  return (
    <div className="metric">
      <strong>{number}</strong>
      <span>{text}</span>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="info-row">
      <div>
        {React.cloneElement(icon, { size: 18, 'aria-hidden': true })}
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </div>
  )
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="section-title">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  )
}

function Step({ number, title, text }) {
  return (
    <article className="step-card">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}

function Benefit({ icon, title, text }) {
  return (
    <article className="benefit-card">
      <div className="benefit-icon">
        {React.cloneElement(icon, { size: 22, 'aria-hidden': true })}
      </div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  )
}
