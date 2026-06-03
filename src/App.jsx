import React, { useRef, useState, useEffect } from 'react'
import { Routes, Route as RRoute, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import RoutePage from './RoutePage.jsx'
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  CreditCard,
  Package,
  ChevronDown,
  Route,
  Shield,
  ShieldCheck,
  Star,
  Truck,
  X,
  Zap,
} from 'lucide-react'
import './App.css'
import ScrollJourneySection from './ScrollJourneySection'

const WA = 'https://wa.me/59898534165?text=Hola%2C%20quiero%20consultar%20por%20Movantia'
const WA_ENVIAR = 'https://wa.me/59898534165?text=Hola%2C%20quiero%20enviar%20carga%20%E2%80%94%20Carga%20en%20ruta'
const WA_LLEVAR = 'https://wa.me/59898534165?text=Hola%2C%20tengo%20cami%C3%B3n%20y%20quiero%20sumarme%20a%20Movantia'
const WA_EXPRESS = 'https://wa.me/59898534165?text=Hola%2C%20necesito%20un%20flete%20express%20%E2%80%94%20Movantia'

const ROUTES = [
  'Montevideo - Maldonado',
  'Montevideo - Colonia',
  'Montevideo - Paysandu',
  'Montevideo - Rivera',
  'Montevideo - Punta del Este',
]

const ENVIAR_STEPS = [
  {
    icon: <Package size={22}/>, num:'01', title:'Publicás tu carga',
    text:'Completás origen, destino, peso, tipo de mercadería y fecha. Tarda 2 minutos.',
    detail: {
      how: 'Entrás a la plataforma y completás un formulario simple: ciudad de origen, ciudad de destino, fecha aproximada, peso o volumen de la carga, y tipo de mercadería (pallets, caja, granel, etc.).',
      tips: [
        'Cuanto más preciso el peso, mejor el match — los transportistas filtran por capacidad.',
        'Podés publicar con hasta 7 días de anticipación para tener más opciones.',
        'No necesitás cuenta bancaria ni datos de pago en este paso.',
      ],
      time: '2 minutos',
    }
  },
  {
    icon: <Zap size={22}/>, num:'02', title:'Recibís un match',
    text:'Movantia cruza tu carga con transportistas que ya tienen ruta planificada hacia tu destino.',
    detail: {
      how: 'El algoritmo de Movantia busca transportistas con rutas ya confirmadas que pasan por tu destino. Recibís una notificación con el perfil del transportista, su calificación, tipo de camión y precio estimado.',
      tips: [
        'El transportista ya tiene su viaje planificado — no es un desvío, es su ruta habitual.',
        'Podés ver valoraciones de otros clientes antes de aceptar.',
        'Si no hay match inmediato, quedás en cola y te avisamos cuando aparezca uno.',
      ],
      time: 'Minutos a horas según la ruta',
    }
  },
  {
    icon: <CreditCard size={22}/>, num:'03', title:'Pagás seguro',
    text:'Pagás con tarjeta. El dinero queda retenido en escrow hasta confirmar la entrega.',
    detail: {
      how: 'Una vez aceptado el match, pagás el monto acordado con tarjeta de crédito o débito. El dinero NO va directo al transportista — queda retenido en una cuenta escrow hasta que vos confirmés que la mercadería llegó bien.',
      tips: [
        'Si la entrega falla o hay daños, el dinero se devuelve automáticamente.',
        'El transportista sabe que el pago está garantizado, por eso acepta con confianza.',
        'Aceptamos Visa, Mastercard y débito uruguayo.',
      ],
      time: '1 minuto para completar el pago',
    }
  },
  {
    icon: <CheckCircle2 size={22}/>, num:'04', title:'Confirmación de entrega',
    text:'El transportista confirma entrega. El pago se libera automáticamente. Listo.',
    detail: {
      how: 'Al llegar al destino, el transportista sube una foto o escaneá un QR para confirmar la entrega. Vos recibís una notificación. Si todo está bien, confirmás y el pago se libera. Si hay un problema, abrís una disputa.',
      tips: [
        'Tenés 24 horas para confirmar o disputar la entrega.',
        'Sin tu confirmación, el dinero no se libera.',
        'El historial de entregas queda guardado para futuras auditorías.',
      ],
      time: 'Confirmación en segundos desde el celular',
    }
  },
]

const LLEVAR_STEPS = [
  {
    icon: <Route size={22}/>, num:'01', title:'Publicás tu retorno',
    text:'Indicás tu ruta de vuelta, fecha, tipo de camión y espacio disponible.',
    detail: {
      how: 'Antes de salir de viaje, publicás tu ruta de regreso: ciudad de origen, destino, fecha, tipo de camión (caja seca, refrigerado, plataforma) y el espacio disponible en toneladas o m³.',
      tips: [
        'Publicá el retorno antes de salir — cuanto antes, más chances de match.',
        'Podés indicar restricciones: no líquidos, no animales, solo pallets, etc.',
        'No estás obligado a aceptar ninguna carga hasta que vos la confirmes.',
      ],
      time: '3 minutos completar el formulario',
    }
  },
  {
    icon: <Zap size={22}/>, num:'02', title:'Match con carga disponible',
    text:'Te mostramos cargas compatibles con tu ruta que ya pagaron o están listas para pagar.',
    detail: {
      how: 'Movantia filtra cargas publicadas que coinciden con tu ruta, fechas y tipo de camión. Solo ves cargas donde el cliente ya pagó o tiene el pago aprobado — no perdés tiempo con consultas sin fondo.',
      tips: [
        'Las cargas aparecen ordenadas por compatibilidad con tu ruta exacta.',
        'Podés ver la distancia de desvío si el punto de retiro está levemente fuera de ruta.',
        'El precio ya está acordado — sin negociación.',
      ],
      time: 'Notificación inmediata cuando hay match',
    }
  },
  {
    icon: <Shield size={22}/>, num:'03', title:'Confirmás y cargás',
    text:'Aceptás las condiciones y retirás la mercadería. El pago queda garantizado.',
    detail: {
      how: 'Aceptás la carga desde la app, te llega la dirección exacta de retiro con contacto del cliente. Retirás la mercadería, firmás el remito digital y el pago queda bloqueado a tu favor.',
      tips: [
        'Fotografiá la mercadería al cargarla — protección ante disputas.',
        'El remito digital queda en tu historial para cualquier reclamo.',
        'El dinero ya está reservado: no podés salir sin cobrar.',
      ],
      time: 'Confirmación en la app en 1 minuto',
    }
  },
  {
    icon: <BarChart3 size={22}/>, num:'04', title:'Cobrás al entregar',
    text:'Entregás, confirmás en la app y el pago se libera. Retorno que antes no facturabas.',
    detail: {
      how: 'Al llegar al destino, el cliente o vos confirman la entrega. El pago se libera automáticamente a tu cuenta en 1-2 días hábiles. Sin facturas manuales, sin cobros pendientes.',
      tips: [
        'El pago llega a tu cuenta bancaria uruguaya directamente.',
        'Movantia cobra una comisión del 8% solo si el viaje se completa.',
        'Cada entrega suma a tu reputación y mejora tu posición en los matches futuros.',
      ],
      time: 'Acreditación en 1-2 días hábiles',
    }
  },
]

const EXPRESS_STEPS = [
  {
    icon: <Package size={22}/>, num:'01', title:'Publicás tu pedido',
    text:'Describís qué necesitás mover, desde dónde, hacia dónde y cuándo. Tarda 2 minutos.',
    detail: {
      how: 'Completás un formulario simple: qué es lo que querés mover (muebles, cajas, mercadería, etc.), punto de retiro, punto de entrega, fecha y cualquier detalle especial (frágil, pesado, requiere ayuda para carga).',
      tips: [
        'Podés pedir para hoy mismo o programar con anticipación.',
        'Incluí fotos si el objeto es grande o irregular — ayuda a cotizar mejor.',
        'No necesitás saber el precio de antemano, eso lo definen los transportistas.',
      ],
      time: '2 minutos completar el pedido',
    }
  },
  {
    icon: <Zap size={22}/>, num:'02', title:'Recibís cotizaciones',
    text:'Transportistas disponibles en tu zona ven el pedido y te mandan su precio.',
    detail: {
      how: 'Los transportistas registrados en Movantia con camionetas, furgones o camiones chicos ven tu pedido y envían su cotización con precio, tiempo estimado y perfil verificado.',
      tips: [
        'Podés ver la calificación y experiencia de cada transportista antes de elegir.',
        'Las cotizaciones llegan en minutos durante el horario activo.',
        'No estás obligado a aceptar ninguna si no te convence.',
      ],
      time: 'Cotizaciones en minutos',
    }
  },
  {
    icon: <CreditCard size={22}/>, num:'03', title:'Elegís y pagás seguro',
    text:'Seleccionás la cotización que más te cierra. El pago queda en escrow hasta la entrega.',
    detail: {
      how: 'Elegís al transportista que preferas por precio, calificación o disponibilidad. Pagás con tarjeta o débito. El dinero queda retenido en escrow — solo se libera cuando confirmás que recibiste todo bien.',
      tips: [
        'Si hay algún problema con la entrega, el dinero se devuelve.',
        'El transportista sabe que el pago está garantizado antes de salir.',
        'Aceptamos Visa, Mastercard y débito uruguayo.',
      ],
      time: '1 minuto para confirmar y pagar',
    }
  },
  {
    icon: <CheckCircle2 size={22}/>, num:'04', title:'Recibís y confirmás',
    text:'El transportista llega, entrega todo bien. Confirmás y el pago se libera. Listo.',
    detail: {
      how: 'Al recibir tu encargo, confirmás la entrega desde la app o por WhatsApp. El pago se libera al transportista automáticamente. Si algo está mal, abrís una disputa y el dinero queda retenido.',
      tips: [
        'Tenés 24 horas para confirmar o disputar después de la entrega.',
        'Podés calificar al transportista para ayudar a la comunidad.',
        'El historial de todos tus fletes queda guardado en tu cuenta.',
      ],
      time: '1 click para confirmar la entrega',
    }
  },
]

/* ──────────────────────────────────────
   BRAND MARK — inline SVG isotipo
────────────────────────────────────── */
function BrandMark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" style={{ width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="bmG" x1="20" y1="3" x2="20" y2="31" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#ffd166"/>
          <stop offset="55%"  stopColor="#f0a500"/>
          <stop offset="100%" stopColor="#c07800"/>
        </linearGradient>
        <filter id="bmGlow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect x="2"  y="3" width="5" height="26" rx="2.5" fill="url(#bmG)"/>
      <rect x="33" y="3" width="5" height="26" rx="2.5" fill="url(#bmG)"/>
      <polygon points="8,3 13,3 20,31"  fill="url(#bmG)"/>
      <polygon points="27,3 32,3 20,31" fill="url(#bmG)"/>
      <circle cx="20" cy="31" r="4" fill="#f0a500" opacity="0.18" filter="url(#bmGlow)"/>
    </svg>
  )
}

function RoutePageWrapper() {
  const { slug } = useParams()
  return <RoutePage slug={slug} />
}

export default function App() {
  const [role, setRole] = useState(null)
  const roleRef = useRef(null)
  const howRef = useRef(null)

  const pickRole = (r) => {
    setRole(r)
    setTimeout(() => howRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  return (
    <Routes>
      <RRoute path="/:slug" element={<RoutePageWrapper />} />
      <RRoute path="/" element={<MainPage role={role} setRole={setRole} roleRef={roleRef} howRef={howRef} pickRole={pickRole} />} />
    </Routes>
  )
}

function MainPage({ role, setRole, roleRef, howRef, pickRole }) {
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
              <BrandMark />
            </span>
            <span>
              <span className="brand-name">Movantia</span>
              <span className="brand-tagline">Fill Empty Miles</span>
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
          <div className="v2-hero-copy anim-fadein">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <Route size={15} />
              Marketplace de transporte · Uruguay
            </div>

            <h1 className="v2-hero-h1">
              Mové lo que<br/>
              necesitás.<br/>
              <span className="h1-accent">Cuando lo necesitás.</span>
            </h1>

            <p className="v2-hero-sub">
              Fletes largos, mudanzas, cargas chicas. Conectamos a quien necesita
              mover algo con el transportista indicado. Match en minutos, pago garantizado.
            </p>

            <div className="v2-hero-stats">
              <div className="v2-stat"><strong>&lt; 2h</strong><span>Tiempo al primer match</span></div>
              <div className="v2-stat-div" />
              <div className="v2-stat"><strong>8%</strong><span>Comisión por entrega</span></div>
              <div className="v2-stat-div" />
              <div className="v2-stat"><strong>Escrow</strong><span>Pago garantizado</span></div>
            </div>

            <div className="v2-hero-ctas">
              <a href={WA_ENVIAR} className="button button-primary" target="_blank" rel="noopener">
                Necesito un flete <ArrowRight size={17} />
              </a>
              <a href={WA_LLEVAR} className="button button-secondary" target="_blank" rel="noopener">
                Soy transportista
              </a>
            </div>
          </div>

          <div className="v2-hero-visual anim-fadein anim-fadein-delay">
            <RouteCard />
          </div>
        </section>

        <ScrollJourneySection />

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
              label="Carga en ruta"
              desc="Tengo mercadería para mover en ruta larga. Quiero un camión que ya va hacia ese destino."
              cta="Quiero enviar"
              onClick={() => pickRole('enviar')}
            />
            <ChooserCard
              active={role === 'express'}
              color="blue"
              icon={<Zap size={36} />}
              label="Flete express"
              desc="Necesito una mudanza, envío chico o flete puntual. Subo el pedido y recibo cotizaciones."
              cta="Pedir cotización"
              onClick={() => pickRole('express')}
            />
            <ChooserCard
              active={role === 'llevar'}
              color="green"
              icon={<Truck size={36} />}
              label="Soy transportista"
              desc="Tengo camión, camioneta o utilitario. Quiero recibir pedidos y no volver vacío nunca más."
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
                    <Package size={15}/> Carga en ruta
                  </button>
                  <button className={`role-btn${role==='express'?' active':''}`} onClick={()=>setRole('express')}>
                    <Zap size={15}/> Flete express
                  </button>
                  <button className={`role-btn${role==='llevar'?' active':''}`} onClick={()=>setRole('llevar')}>
                    <Truck size={15}/> Transportista
                  </button>
                </div>

                <div className="v2-how-inner">
                  {/* Left: animated demo */}
                  <div className="v2-how-demo">
                    {role === 'enviar' ? <EnviarDemo /> : <LlevarDemo />}
                  </div>

                  {/* Right: steps */}
                  <div className="v2-how-steps">
                    <p className="section-eyebrow">
                      {role === 'enviar' ? 'Carga en ruta' : role === 'express' ? 'Flete express' : 'Para transportistas'}
                    </p>
                    <h2 className="v2-how-title">
                      {role === 'enviar'
                        ? 'Tu carga llega. Simple y seguro.'
                        : role === 'express'
                        ? 'Pedís, cotizás, confirmás.'
                        : 'Tu retorno empieza a facturar.'}
                    </h2>
                    <StepList steps={role === 'enviar' ? ENVIAR_STEPS : role === 'express' ? EXPRESS_STEPS : LLEVAR_STEPS} role={role} />

                    <a
                      href={role === 'enviar' ? WA_ENVIAR : role === 'express' ? WA_EXPRESS : WA_LLEVAR}
                      className="button button-primary v2-how-cta"
                      target="_blank" rel="noopener"
                    >
                      {role === 'enviar' ? 'Publicar mi carga' : role === 'express' ? 'Pedir cotización' : 'Publicar mi ruta'}
                      <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* ══════════════════════════════════════
            PRICING CLARITY
        ══════════════════════════════════════ */}
        <section className="container">
          <PricingBanner />
        </section>

        {/* Mid-page CTA */}
        <div className="container mid-cta">
          <a href={WA} className="button button-primary" target="_blank" rel="noopener">
            Empezar ahora — es gratis <ArrowRight size={17}/>
          </a>
          <p className="mid-cta-note">Sin suscripción. Solo pagás cuando hay match confirmado.</p>
        </div>

        {/* ══════════════════════════════════════
            POR QUÉ MOVANTIA
        ══════════════════════════════════════ */}
        <section className="container section-block">
          <WhyMovantia />
        </section>

        {/* ══════════════════════════════════════
            TESTIMONIALES
        ══════════════════════════════════════ */}
        <section className="container section-block">
          <Testimonials />
        </section>

        {/* ══════════════════════════════════════
            FAQ
        ══════════════════════════════════════ */}
        <section className="container section-block">
          <FAQ />
        </section>

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
          <h2>¿Necesitás mover algo o tenés vehículo disponible?</h2>
          <p>
            Mandanos un mensaje por WhatsApp. En minutos te conectamos con
            la otra parte del match.
          </p>
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', justifyContent:'center' }}>
            <a href={WA_EXPRESS} className="button button-primary" target="_blank" rel="noopener">
              Necesito un flete <ArrowRight size={18} />
            </a>
            <a href={WA_LLEVAR} className="button button-secondary" target="_blank" rel="noopener">
              Soy transportista
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>2026 Movantia. Fill Empty Miles.</p>
          <p>Uruguay · Fletes largos · Fletes express · Retornos vacíos</p>
        </div>
      </footer>

      <FloatingWA />
    </div>
  )
}

/* ──────────────────────────────────────
   STEP LIST — expandable on click
────────────────────────────────────── */
function StepList({ steps, role }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="v2-steps-list">
      {steps.map((s, i) => (
        <motion.div
          key={s.num}
          className={`v2-step v2-step--clickable v2-step--${role}${open === i ? ' v2-step--open' : ''}`}
          initial={{ opacity:0, x:24 }}
          animate={{ opacity:1, x:0 }}
          transition={{ delay: i * 0.1 + .15, duration:.5, ease:[.22,1,.36,1] }}
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div className={`v2-step-icon ${role}`}>{s.icon}</div>
          <div className="v2-step-body">
            <div className="v2-step-header">
              <span className="v2-step-num">{s.num}</span>
              <h3>{s.title}</h3>
              <span className={`v2-step-chevron${open === i ? ' open' : ''}`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            <p className="v2-step-summary">{s.text}</p>

            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  className="v2-step-detail"
                  initial={{ height:0, opacity:0 }}
                  animate={{ height:'auto', opacity:1 }}
                  exit={{ height:0, opacity:0 }}
                  transition={{ duration:.35, ease:[.22,1,.36,1] }}
                >
                  <div className="v2-step-detail-inner">
                    <div className="v2-step-how">
                      <span className="v2-step-detail-label">Cómo funciona</span>
                      <p>{s.detail.how}</p>
                    </div>
                    <div className="v2-step-tips">
                      <span className="v2-step-detail-label">A tener en cuenta</span>
                      <ul>
                        {s.detail.tips.map((t, ti) => <li key={ti}>{t}</li>)}
                      </ul>
                    </div>
                    <div className="v2-step-time">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M6.5 3.5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                      {s.detail.time}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
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
    if (step >= 3) return
    const t = setTimeout(() => setStep(s => s + 1), 2000)
    return () => clearTimeout(t)
  }, [step])

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
    if (step >= 3) return
    const t = setTimeout(() => setStep(s => s + 1), 2200)
    return () => clearTimeout(t)
  }, [step])

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
   FLOATING WHATSAPP
────────────────────────────────────── */
function FloatingWA() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={WA}
          target="_blank"
          rel="noopener"
          className="wa-float"
          initial={{ opacity:0, scale:.7, y:20 }}
          animate={{ opacity:1, scale:1, y:0 }}
          exit={{ opacity:0, scale:.7, y:20 }}
          transition={{ duration:.3, ease:[.22,1,.36,1] }}
          aria-label="Contactar por WhatsApp"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>¿Consultas?</span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}

/* ──────────────────────────────────────
   PRICING BANNER
────────────────────────────────────── */
function PricingBanner() {
  return (
    <motion.div
      className="pricing-banner"
      initial={{ opacity:0, y:24 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ duration:.6, ease:[.22,1,.36,1] }}
    >
      <div className="pricing-item">
        <span className="pricing-label">Para quién envía</span>
        <strong>Sin costo fijo</strong>
        <p>Solo pagás el flete acordado cuando hay match confirmado. Sin suscripción, sin cargos ocultos.</p>
      </div>
      <div className="pricing-divider" />
      <div className="pricing-item">
        <span className="pricing-label">Para transportistas</span>
        <strong>8% de comisión</strong>
        <p>Solo cobramos si completás la entrega. Si no hay match o se cancela antes de cargar, no pagás nada.</p>
      </div>
      <div className="pricing-divider" />
      <div className="pricing-item pricing-item--highlight">
        <span className="pricing-label">Escrow incluido</span>
        <strong>Pago garantizado</strong>
        <p>El dinero queda retenido hasta confirmar entrega. Cero riesgo para ambos lados.</p>
      </div>
    </motion.div>
  )
}

/* ──────────────────────────────────────
   WHY MOVANTIA — comparison table
────────────────────────────────────── */
const COMPARE_ROWS = [
  { feature: 'Precio', traditional: 'Flete completo aunque el camión vuelva vacío', movantia: 'Pagás solo el espacio que usás' },
  { feature: 'Tiempo', traditional: 'Días buscando transportista por teléfono', movantia: 'Match en minutos o pocas horas' },
  { feature: 'Pago', traditional: 'Sin garantías, riesgo de impago', movantia: 'Escrow: el dinero está asegurado' },
  { feature: 'Transparencia', traditional: 'Sin trazabilidad ni historial', movantia: 'Remito digital, confirmación de entrega, historial' },
  { feature: 'Disponibilidad', traditional: 'Dependés de contactos conocidos', movantia: 'Red de transportistas con rutas activas en UY' },
]

function WhyMovantia() {
  return (
    <motion.div
      className="why-section"
      initial={{ opacity:0, y:28 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ duration:.6, ease:[.22,1,.36,1] }}
    >
      <div className="why-head">
        <p className="section-eyebrow">Comparativa</p>
        <h2>¿Por qué Movantia?</h2>
        <p>Lo que antes tomaba días y costaba de más, hoy tarda minutos y se paga justo.</p>
      </div>
      <div className="why-table">
        <div className="why-table-header">
          <div />
          <div className="why-col-label why-col-old">Flete tradicional</div>
          <div className="why-col-label why-col-new">Movantia</div>
        </div>
        {COMPARE_ROWS.map((r, i) => (
          <motion.div
            key={r.feature}
            className="why-row"
            initial={{ opacity:0, x:-16 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }}
            transition={{ delay: i * 0.07, duration:.45, ease:[.22,1,.36,1] }}
          >
            <div className="why-feature">{r.feature}</div>
            <div className="why-cell why-cell--old">
              <X size={14} className="why-x" />
              {r.traditional}
            </div>
            <div className="why-cell why-cell--new">
              <CheckCircle2 size={14} className="why-check" />
              {r.movantia}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ──────────────────────────────────────
   TESTIMONIALS
────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Juan P.',
    company: 'Distribuidora del Norte',
    role: 'Cliente',
    color: 'gold',
    text: 'Antes pagaba el camión completo para mandar 6 pallets a Paysandú. Con Movantia encontré match en 2 horas y pagué un tercio. No lo podía creer.',
    stars: 5,
  },
  {
    name: 'Marcelo R.',
    company: 'Transportes Río Uruguay',
    role: 'Transportista',
    color: 'green',
    text: 'Mis retornos desde Rivera eran siempre en vacío. En el primer mes llené 4 viajes de vuelta. Son USD 400 que antes literalmente tiraba.',
    stars: 5,
  },
  {
    name: 'Sofía M.',
    company: 'Importadora Costa Sur',
    role: 'Cliente',
    color: 'gold',
    text: 'Lo que más me importó fue el escrow. Muchas veces tuve problemas con pagos a transportistas. Acá el sistema lo maneja solo y sin drama.',
    stars: 5,
  },
]

function Testimonials() {
  return (
    <div className="testimonials-section">
      <motion.div
        className="testimonials-head"
        initial={{ opacity:0, y:24 }}
        whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true, margin:'-60px' }}
        transition={{ duration:.6, ease:[.22,1,.36,1] }}
      >
        <p className="section-eyebrow">Testimonios</p>
        <h2>Lo que dicen los primeros usuarios</h2>
      </motion.div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            className={`testimonial-card testimonial-card--${t.color}`}
            initial={{ opacity:0, y:32 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, margin:'-40px' }}
            transition={{ delay: i * 0.1, duration:.55, ease:[.22,1,.36,1] }}
          >
            <div className="testimonial-stars">
              {Array.from({ length: t.stars }).map((_, si) => (
                <Star key={si} size={13} fill="currentColor" />
              ))}
            </div>
            <p className="testimonial-text">"{t.text}"</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{t.name[0]}</div>
              <div>
                <strong>{t.name}</strong>
                <span>{t.company} · {t.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────
   FAQ
────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: '¿Qué pasa si mi carga llega dañada?',
    a: 'El dinero queda en escrow hasta que vos confirmás que la mercadería llegó en buen estado. Si hay daños, abrís una disputa desde la app. El pago queda retenido mientras se resuelve. En casos graves, coordinamos con el transportista para llegar a un acuerdo o devolvemos el importe.',
  },
  {
    q: '¿Cómo funciona el escrow exactamente?',
    a: 'Cuando aceptás un match y pagás, el dinero no va al transportista — queda retenido en una cuenta de tercero (escrow). Solo se libera cuando vos confirmás la entrega. El transportista sabe que el pago está garantizado, lo que mejora la confianza en ambos lados.',
  },
  {
    q: '¿Qué pasa si no hay match para mi carga?',
    a: 'Quedás en cola y te avisamos por WhatsApp o email cuando aparezca un transportista compatible. No pagás nada hasta que haya match y lo aceptés. Podés cancelar la publicación en cualquier momento sin costo.',
  },
  {
    q: '¿Los transportistas están verificados?',
    a: 'Sí. Antes de aparecer en la plataforma, cada transportista pasa por un proceso de verificación: documento de identidad, habilitación del vehículo y seguro vigente. Además, cada entrega suma o resta a su reputación pública.',
  },
  {
    q: '¿Qué tipos de mercadería puedo mover?',
    a: 'Cargas secas en pallets, cajas o granel son las más comunes. También manejamos refrigerados y plataformas según disponibilidad. No aceptamos materiales peligrosos, animales vivos ni mercadería ilegal.',
  },
  {
    q: '¿Cuánto tiempo tarda en aparecer un match?',
    a: 'Depende de la ruta y la fecha. Para rutas frecuentes como Montevideo-Maldonado o Montevideo-Colonia, los matches suelen aparecer en minutos a pocas horas. Para rutas menos frecuentes puede tardar 1-2 días. Publicar con anticipación mejora las chances.',
  },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <motion.div
      className="faq-section"
      initial={{ opacity:0, y:24 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ duration:.6, ease:[.22,1,.36,1] }}
    >
      <div className="faq-head">
        <p className="section-eyebrow">FAQ</p>
        <h2>Preguntas frecuentes</h2>
        <p>Las dudas que más nos llegan antes del primer match.</p>
      </div>
      <div className="faq-list">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className={`faq-item${open === i ? ' faq-item--open' : ''}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="faq-question">
              <span>{item.q}</span>
              <ChevronDown size={18} className={`faq-chevron${open === i ? ' open' : ''}`} />
            </div>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  className="faq-answer"
                  initial={{ height:0, opacity:0 }}
                  animate={{ height:'auto', opacity:1 }}
                  exit={{ height:0, opacity:0 }}
                  transition={{ duration:.32, ease:[.22,1,.36,1] }}
                >
                  <p>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
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
