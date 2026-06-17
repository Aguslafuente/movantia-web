import React, { useRef, useState, useEffect } from 'react'
import { Routes, Route as RRoute, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import RoutePage from './RoutePage.jsx'

// App pages
import AuthGuard from './components/app/AuthGuard.jsx'
import DevAccess from './pages/DevAccess.jsx'
import AppLayout from './components/app/AppLayout.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import RegisterCompany from './pages/auth/RegisterCompany.jsx'
import RegisterConsumer from './pages/auth/RegisterConsumer.jsx'
import TransporterDashboard from './pages/transporter/TransporterDashboard.jsx'
import NewReturn from './pages/transporter/NewReturn.jsx'
import TransporterBookings from './pages/transporter/TransporterBookings.jsx'
import Earnings from './pages/transporter/Earnings.jsx'
import Vehicles from './pages/transporter/Vehicles.jsx'
import FrequentRoutes from './pages/transporter/FrequentRoutes.jsx'
import TripDetail from './pages/transporter/TripDetail.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminCompanies from './pages/admin/AdminCompanies.jsx'
import AdminTrips from './pages/admin/AdminTrips.jsx'
import AdminBookings from './pages/admin/AdminBookings.jsx'
import AdminIncidents from './pages/admin/AdminIncidents.jsx'
import SendSearch from './pages/consumer/SendSearch.jsx'
import SendOptions from './pages/consumer/SendOptions.jsx'
import BookingConfirm from './pages/consumer/BookingConfirm.jsx'
import Tracking from './pages/consumer/Tracking.jsx'
import SendHistory from './pages/consumer/SendHistory.jsx'
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
    text:'Pagás con tarjeta. El dinero queda protegido hasta confirmar la entrega.',
    detail: {
      how: 'Una vez aceptado el match, pagás el monto acordado con tarjeta de crédito o débito. El dinero NO va directo al transportista — queda protegido hasta que vos confirmés que la mercadería llegó bien.',
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
    text:'Seleccionás la cotización que más te cierra. El pago queda protegido hasta la entrega.',
    detail: {
      how: 'Elegís al transportista que preferas por precio, calificación o disponibilidad. Pagás con tarjeta o débito. El dinero queda protegido — solo se libera cuando confirmás que recibiste todo bien.',
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
  return (
    <Routes>
      {/* Dev bypass */}
      <RRoute path="/dev" element={<DevAccess />} />

      {/* Auth */}
      <RRoute path="/app/auth/login" element={<Login />} />
      <RRoute path="/app/auth/register" element={<Register />} />
      <RRoute path="/app/auth/register/company" element={<RegisterCompany />} />
      <RRoute path="/app/auth/register/consumer" element={<RegisterConsumer />} />

      {/* Transporter app */}
      <RRoute path="/app/transporter" element={<AuthGuard requiredRole="transporter"><AppLayout><TransporterDashboard /></AppLayout></AuthGuard>} />
      <RRoute path="/app/transporter/new-return" element={<AuthGuard requiredRole="transporter"><AppLayout><NewReturn /></AppLayout></AuthGuard>} />
      <RRoute path="/app/transporter/bookings" element={<AuthGuard requiredRole="transporter"><AppLayout><TransporterBookings /></AppLayout></AuthGuard>} />
      <RRoute path="/app/transporter/earnings" element={<AuthGuard requiredRole="transporter"><AppLayout><Earnings /></AppLayout></AuthGuard>} />
      <RRoute path="/app/transporter/vehicles" element={<AuthGuard requiredRole="transporter"><AppLayout><Vehicles /></AppLayout></AuthGuard>} />
      <RRoute path="/app/transporter/routes" element={<AuthGuard requiredRole="transporter"><AppLayout><FrequentRoutes /></AppLayout></AuthGuard>} />
      <RRoute path="/app/transporter/trips/:id" element={<AuthGuard requiredRole="transporter"><AppLayout><TripDetail /></AppLayout></AuthGuard>} />

      {/* Admin app */}
      <RRoute path="/admin" element={<AuthGuard requiredRole="admin"><AppLayout><AdminDashboard /></AppLayout></AuthGuard>} />
      <RRoute path="/admin/companies" element={<AuthGuard requiredRole="admin"><AppLayout><AdminCompanies /></AppLayout></AuthGuard>} />
      <RRoute path="/admin/trips" element={<AuthGuard requiredRole="admin"><AppLayout><AdminTrips /></AppLayout></AuthGuard>} />
      <RRoute path="/admin/bookings" element={<AuthGuard requiredRole="admin"><AppLayout><AdminBookings /></AppLayout></AuthGuard>} />
      <RRoute path="/admin/incidents" element={<AuthGuard requiredRole="admin"><AppLayout><AdminIncidents /></AppLayout></AuthGuard>} />

      {/* Consumer app */}
      <RRoute path="/app/send" element={<AuthGuard requiredRole="consumer"><AppLayout><SendSearch /></AppLayout></AuthGuard>} />
      <RRoute path="/app/send/options" element={<AuthGuard requiredRole="consumer"><AppLayout><SendOptions /></AppLayout></AuthGuard>} />
      <RRoute path="/app/send/booking/:id" element={<AuthGuard requiredRole="consumer"><AppLayout><BookingConfirm /></AppLayout></AuthGuard>} />
      <RRoute path="/app/send/tracking/:id" element={<AuthGuard requiredRole="consumer"><AppLayout><Tracking /></AppLayout></AuthGuard>} />
      <RRoute path="/app/send/history" element={<AuthGuard requiredRole="consumer"><AppLayout><SendHistory /></AppLayout></AuthGuard>} />

      {/* Landing + SEO routes */}
      <RRoute path="/:slug" element={<RoutePageWrapper />} />
      <RRoute path="/" element={<MainPage />} />
    </Routes>
  )
}

function DevBar() {
  // No hooks — usa localStorage directo para evitar crashes de contexto
  function enter(role) {
    try { localStorage.setItem('dev_role', role) } catch (e) {}
    const paths = { transporter: '/app/transporter', consumer: '/app/send', admin: '/admin' }
    window.location.href = paths[role]
  }

  return (
    <div style={{
      background: 'rgba(212,168,67,0.06)',
      borderBottom: '1px solid rgba(212,168,67,0.15)',
      padding: '8px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: '11px', color: 'rgba(212,168,67,0.5)', fontWeight: 700, letterSpacing: '1px' }}>
        DEMO →
      </span>
      {[
        { role: 'transporter', label: '🚚 Transportista', color: '#D4A843' },
        { role: 'consumer',    label: '📦 Consumidor',    color: '#00D68F' },
        { role: 'admin',       label: '🛡️ Admin',         color: '#a78bfa' },
      ].map(({ role, label, color }) => (
        <button
          key={role}
          onClick={() => enter(role)}
          style={{
            background: 'transparent',
            border: `1px solid ${color}50`,
            color,
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${color}18`}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/* ── design tokens ───────────────────────── */
const S = {
  page:       { background: '#07090F', minHeight: '100vh', color: '#E8EDF5', fontFamily: "'Space Grotesk', sans-serif" },
  wrap:       { maxWidth: 1120, margin: '0 auto', padding: '0 24px' },
  eyebrow:    { color: '#D4A843', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 10px' },
  h2:         { fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: '#E8EDF5', letterSpacing: '-0.025em', margin: '0 0 12px' },
  muted:      { color: 'rgba(232,237,245,0.55)', fontSize: 15, lineHeight: 1.65 },
  card:       { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 24px' },
  divHr:      { borderTop: '1px solid rgba(255,255,255,0.07)' },
  sectionAlt: { background: 'rgba(255,255,255,0.025)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' },
}

/* ── nav anchor link ─────────────────────── */
function NavLink({ href, children }) {
  function handleClick(e) {
    if (href.startsWith('#')) {
      e.preventDefault()
      const id = href.slice(1)
      window.history.pushState(null, '', href)
      // Use setTimeout so React Router re-render finishes before we scroll
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          const offset = 68 // sticky header height
          const top = el.getBoundingClientRect().top + window.scrollY - offset
          window.scrollTo({ top, behavior: 'instant' })
        }
      }, 0)
    }
  }
  return (
    <a href={href} onClick={handleClick} style={{ color: 'rgba(232,237,245,0.6)', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 8, textDecoration: 'none', transition: 'color .15s, background .15s' }}
      onMouseEnter={e => { e.currentTarget.style.color = '#E8EDF5'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(232,237,245,0.6)'; e.currentTarget.style.background = 'transparent' }}
    >{children}</a>
  )
}

/* ── customer access button ─────────────── */
function AccessBtn({ role, path, primary, children }) {
  function go() { try { localStorage.setItem('dev_role', role) } catch(e) {} window.location.href = path }
  return (
    <button onClick={go} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: primary ? '#D4A843' : 'rgba(255,255,255,0.07)',
      color:      primary ? '#07090F' : '#E8EDF5',
      border:     primary ? 'none'    : '1px solid rgba(255,255,255,0.14)',
      borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700,
      cursor: 'pointer', transition: 'opacity .15s',
    }}
    onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >{children}</button>
  )
}

/* ── admin password modal ────────────────── */
const ADMIN_PW = 'agustin10'

function AdminModal({ onClose }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const inputRef = useRef(null)
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 60) }, [])

  function attempt() {
    if (pw === ADMIN_PW) {
      try { localStorage.setItem('dev_role', 'admin') } catch(e) {}
      window.location.href = '/admin'
    } else {
      setErr(true)
      setPw('')
      setTimeout(() => { setErr(false); inputRef.current?.focus() }, 1400)
    }
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div style={{
        background: '#131720', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 18, padding: '36px 32px', width: 340, maxWidth: '100%',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: 'rgba(212,168,67,0.1)',
            border: '1px solid rgba(212,168,67,0.25)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <ShieldCheck size={24} style={{ color: '#D4A843' }} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#E8EDF5', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Acceso Administrador</h3>
          <p style={{ ...S.muted, fontSize: 13, margin: 0 }}>Ingresá la contraseña para continuar</p>
        </div>

        <input
          ref={inputRef}
          type="password"
          value={pw}
          placeholder="Contraseña"
          onChange={e => { setPw(e.target.value); setErr(false) }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${err ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 9, padding: '12px 15px', fontSize: 15,
            color: '#E8EDF5', outline: 'none', marginBottom: 8,
            fontFamily: "'Space Grotesk', sans-serif",
            transition: 'border-color .2s',
          }}
        />
        {err && (
          <p style={{ color: '#ef4444', fontSize: 12, margin: '0 0 10px', textAlign: 'center', fontWeight: 600 }}>
            Contraseña incorrecta
          </p>
        )}

        <button onClick={attempt} style={{
          width: '100%', marginTop: err ? 0 : 8,
          background: '#D4A843', color: '#07090F', border: 'none',
          borderRadius: 9, padding: '12px', fontSize: 15, fontWeight: 800,
          cursor: 'pointer', transition: 'opacity .15s', marginBottom: 8,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >Entrar</button>

        <button onClick={onClose} style={{
          width: '100%', background: 'transparent',
          color: 'rgba(232,237,245,0.4)', border: 'none',
          borderRadius: 9, padding: '9px', fontSize: 13,
          cursor: 'pointer', transition: 'color .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(232,237,245,0.7)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(232,237,245,0.4)'}
        >Cancelar</button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────────── */
function MainPage() {
  const [adminModal, setAdminModal] = useState(false)

  return (
    <div style={{ background: '#07090F', minHeight: '100vh', color: '#E8EDF5', fontFamily: "'Space Grotesk', sans-serif", overflowX: 'hidden' }}>
      {adminModal && <AdminModal onClose={() => setAdminModal(false)} />}

      {/* ── NAV ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(7,9,15,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <span style={{ width: 26, height: 26, display: 'flex' }}><BrandMark /></span>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#E8EDF5', letterSpacing: '-0.02em' }}>Movantia</span>
          </a>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="#como-funciona" onClick={e => { e.preventDefault(); document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ fontSize: 13, color: 'rgba(232,237,245,0.5)', textDecoration: 'none', padding: '6px 12px', borderRadius: 8, fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.color='#E8EDF5'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(232,237,245,0.5)'}
            >Cómo funciona</a>
            <a href="#precios" onClick={e => { e.preventDefault(); document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ fontSize: 13, color: 'rgba(232,237,245,0.5)', textDecoration: 'none', padding: '6px 12px', borderRadius: 8, fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.color='#E8EDF5'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(232,237,245,0.5)'}
            >Precios</a>
            <a href="#faq" onClick={e => { e.preventDefault(); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ fontSize: 13, color: 'rgba(232,237,245,0.5)', textDecoration: 'none', padding: '6px 12px', borderRadius: 8, fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.color='#E8EDF5'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(232,237,245,0.5)'}
            >FAQ</a>
            <button onClick={() => setAdminModal(true)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(232,237,245,0.4)', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
              onMouseEnter={e => { e.currentTarget.style.color='#D4A843'; e.currentTarget.style.borderColor='rgba(212,168,67,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.color='rgba(232,237,245,0.4)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)' }}
            >
              <ShieldCheck size={13} /> Admin
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(56px,8vw,100px) 24px clamp(48px,6vw,80px)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'clamp(32px,5vw,64px)', alignItems: 'center' }}>

          {/* Left — copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.18)', color: '#D4A843', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>
              <span style={{ width: 6, height: 6, background: '#D4A843', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,168,67,0.8)' }} />
              Uruguay · Pesos · Pago protegido
            </div>
            <h1 style={{ fontSize: 'clamp(38px,5.5vw,68px)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.04em', margin: '0 0 20px', color: '#E8EDF5' }}>
              Conectamos<br />
              vueltas vacías<br />
              <span style={{ color: '#D4A843' }}>con carga real.</span>
            </h1>
            <p style={{ fontSize: 'clamp(14px,1.8vw,17px)', color: 'rgba(232,237,245,0.5)', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 440 }}>
              Si tenés un camión que vuelve vacío, vendé ese espacio.<br />
              Si necesitás mandar carga, pagás solo lo que usás.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <AccessBtn role="transporter" path="/app/transporter" primary>
                <Truck size={15} /> Soy transportista
              </AccessBtn>
              <AccessBtn role="consumer" path="/app/send">
                <Package size={15} /> Necesito enviar algo
              </AccessBtn>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(232,237,245,0.18)', marginTop: 14 }}>
              Demo con datos reales · sin registro · sin tarjeta
            </p>
          </div>

          {/* Right — route card */}
          <div style={{ background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 10, color: '#9AA3B5', margin: '0 0 3px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em' }}>Vuelta detectada</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#E8EDF5', margin: 0 }}>Maldonado → Montevideo</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,214,143,0.07)', border: '1px solid rgba(0,214,143,0.2)', borderRadius: 20, padding: '4px 10px' }}>
                <span style={{ width: 5, height: 5, background: '#00D68F', borderRadius: '50%', boxShadow: '0 0 5px #00D68F' }} />
                <span style={{ fontSize: 11, color: '#00D68F', fontWeight: 700 }}>Match activo</span>
              </div>
            </div>
            <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
              <RouteSVG />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
              {[
                { label: 'Espacio libre', value: '4.5 m³', c: '#E8EDF5' },
                { label: 'Hora estimada', value: '14:30',  c: '#E8EDF5' },
                { label: 'Ingreso extra', value: '$9.000', c: '#D4A843' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 9, padding: '10px 6px', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.c }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: '#9AA3B5', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '0 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(36px,5vw,56px) 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
          {[
            { v: '+200',    u: 'vueltas publicadas',    c: '#D4A843' },
            { v: '12%',     u: 'comisión sin cargos fijos', c: '#E8EDF5' },
            { v: '$2.000',  u: 'por m³ — precio justo', c: '#00D68F' },
            { v: '< 5 min', u: 'para publicar tu vuelta', c: '#a78bfa' },
          ].map((s, i, arr) => (
            <div key={i} style={{ padding: '28px 24px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: '#0D1018' }}>
              <p style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: s.c, margin: '0 0 6px', letterSpacing: '-0.04em', fontFamily: 'Space Grotesk' }}>{s.v}</p>
              <p style={{ fontSize: 12, color: 'rgba(232,237,245,0.4)', margin: 0, lineHeight: 1.4 }}>{s.u}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEMA / SOLUCIÓN ── */}
      <section style={{ padding: 'clamp(56px,7vw,88px) 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 32, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#D4A843', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 14px' }}>El problema</p>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, color: '#E8EDF5', margin: '0 0 20px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
              El 40% del viaje,<br />el camión vuelve vacío.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(232,237,245,0.45)', lineHeight: 1.75, margin: 0 }}>
              Un camión que hace Montevideo–Punta del Este pierde plata en cada vuelta vacía. Al mismo tiempo, miles de personas pagan fletes completos para mandar una sola caja. Hay espacio de sobra — solo falta conectarlo.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '🚛', title: 'Sin Movantia', items: ['Camión vuelve vacío y pierde dinero', 'Transportista no sabe quién necesita carga en su ruta', 'Cliente paga el camión entero por una caja'], bad: true },
              { icon: '✅', title: 'Con Movantia', items: ['Vendés el espacio libre de tu vuelta', 'Clientes publican su carga y vos aparecés como opción', 'Cada uno paga exactamente lo que usa'], bad: false },
            ].map((card, i) => (
              <div key={i} style={{ background: card.bad ? 'rgba(239,68,68,0.04)' : 'rgba(0,214,143,0.05)', border: `1px solid ${card.bad ? 'rgba(239,68,68,0.15)' : 'rgba(0,214,143,0.2)'}`, borderRadius: 14, padding: '18px 20px' }}>
                <p style={{ fontWeight: 700, color: card.bad ? '#f87171' : '#00D68F', margin: '0 0 12px', fontSize: 14 }}>{card.icon} {card.title}</p>
                {card.items.map((it, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: j < card.items.length - 1 ? 8 : 0 }}>
                    <span style={{ color: card.bad ? '#f87171' : '#00D68F', fontSize: 13, flexShrink: 0, marginTop: 1 }}>{card.bad ? '✗' : '✓'}</span>
                    <span style={{ fontSize: 13, color: 'rgba(232,237,245,0.55)', lineHeight: 1.5 }}>{it}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" style={{ padding: 'clamp(56px,7vw,88px) 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#D4A843', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Cómo funciona</p>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 800, color: '#E8EDF5', margin: 0, letterSpacing: '-0.025em' }}>Simple para los dos lados</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>

            {/* Transportista */}
            <div style={{ background: '#0D1018', border: '1px solid rgba(212,168,67,0.12)', borderRadius: 16, padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#D4A843,#f0a500)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <Truck size={15} color="#D4A843" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#D4A843' }}>Si tenés un camión</span>
              </div>
              {[
                { n: '01', t: 'Publicás tu vuelta', d: 'Ruta, fecha y m³ disponibles. 2 minutos.' },
                { n: '02', t: 'Conseguís carga',    d: 'Alguien necesita mandar algo por tu ruta.' },
                { n: '03', t: 'Cobrás seguro',       d: 'PIN de entrega libera el pago automáticamente.' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 2 ? 18 : 0 }}>
                  <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#D4A843' }}>{s.n}</div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#E8EDF5', margin: '0 0 2px' }}>{s.t}</p>
                    <p style={{ fontSize: 12, color: 'rgba(232,237,245,0.4)', margin: 0, lineHeight: 1.5 }}>{s.d}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => { localStorage.setItem('dev_role','transporter'); window.location.href='/app/transporter' }} style={{ width: '100%', marginTop: 22, background: '#D4A843', color: '#07090F', border: 'none', borderRadius: 9, padding: '12px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Space Grotesk', transition: 'opacity .15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='.88'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}
              >Probar como transportista</button>
            </div>

            {/* Consumidor */}
            <div style={{ background: '#0D1018', border: '1px solid rgba(0,214,143,0.12)', borderRadius: 16, padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#00D68F,#00c47f)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <Package size={15} color="#00D68F" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#00D68F' }}>Si necesitás enviar algo</span>
              </div>
              {[
                { n: '01', t: 'Describís tu carga',  d: 'Origen, destino, tamaño. Menos de 2 minutos.' },
                { n: '02', t: 'Encontrás un match',  d: 'Un camión que ya va para allá tiene espacio libre.' },
                { n: '03', t: 'Pagás protegido',     d: 'El dinero se libera solo cuando confirmás que llegó.' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 2 ? 18 : 0 }}>
                  <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#00D68F' }}>{s.n}</div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#E8EDF5', margin: '0 0 2px' }}>{s.t}</p>
                    <p style={{ fontSize: 12, color: 'rgba(232,237,245,0.4)', margin: 0, lineHeight: 1.5 }}>{s.d}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => { localStorage.setItem('dev_role','consumer'); window.location.href='/app/send' }} style={{ width: '100%', marginTop: 22, background: 'rgba(0,214,143,0.1)', color: '#00D68F', border: '1.5px solid rgba(0,214,143,0.35)', borderRadius: 9, padding: '12px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Space Grotesk', transition: 'opacity .15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='.8'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}
              >Probar como cliente</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── RUTAS POPULARES ── */}
      <section style={{ padding: 'clamp(56px,7vw,88px) 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#D4A843', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Rutas activas</p>
            <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, color: '#E8EDF5', margin: '0 0 10px', letterSpacing: '-0.025em' }}>Las rutas más frecuentes del país</h2>
            <p style={{ fontSize: 14, color: 'rgba(232,237,245,0.4)', margin: 0 }}>Vueltas que ya están publicadas — entrá y buscá la tuya</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
            {[
              { from: 'Montevideo', to: 'Maldonado',    km: '135 km', freq: 'Alta frecuencia' },
              { from: 'Montevideo', to: 'Punta del Este', km: '140 km', freq: 'Alta frecuencia' },
              { from: 'Montevideo', to: 'Colonia',      km: '182 km', freq: 'Frecuencia media' },
              { from: 'Montevideo', to: 'Paysandú',     km: '378 km', freq: 'Frecuencia media' },
              { from: 'Montevideo', to: 'Rivera',       km: '495 km', freq: 'Disponible' },
              { from: 'Montevideo', to: 'Salto',        km: '497 km', freq: 'Disponible' },
            ].map((r, i) => (
              <a key={i} href={`/${r.from.toLowerCase()}-${r.to.toLowerCase().replace(' ', '-')}`}
                style={{ background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px', textDecoration: 'none', display: 'block', transition: 'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(212,168,67,0.35)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}
              >
                <p style={{ fontSize: 14, fontWeight: 700, color: '#E8EDF5', margin: '0 0 4px' }}>{r.from}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 8px' }}>
                  <span style={{ fontSize: 10, color: '#D4A843' }}>→</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#D4A843' }}>{r.to}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'rgba(232,237,245,0.3)' }}>{r.km}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(0,214,143,0.7)', background: 'rgba(0,214,143,0.07)', borderRadius: 20, padding: '2px 7px' }}>{r.freq}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section id="precios" style={{ padding: 'clamp(56px,7vw,88px) 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#D4A843', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Los números</p>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 800, color: '#E8EDF5', margin: '0 0 12px', letterSpacing: '-0.025em' }}>12% de comisión · pago con tarjeta protegido</h2>
            <p style={{ fontSize: 15, color: 'rgba(232,237,245,0.4)', margin: 0 }}>Solo cobramos si la entrega se confirma. Sin cargos fijos.</p>
          </div>
          <div style={{ background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center' }}>
              {[
                { l: 'Cliente paga', v: '$4.000', s: '2 m³ × $2.000/m³' },
                { l: 'Comisión 12%', v: '$480',   s: 'Plataforma', dim: true },
                { l: 'Transportista recibe', v: '$3.520', s: '88% neto', hl: true },
              ].map((c, i) => (
                <div key={i} style={{ padding: '24px 16px', background: c.hl ? 'rgba(0,214,143,0.06)' : 'transparent', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <p style={{ fontSize: 10, color: '#9AA3B5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>{c.l}</p>
                  <p style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 900, color: c.hl ? '#00D68F' : c.dim ? 'rgba(232,237,245,0.3)' : '#E8EDF5', letterSpacing: '-0.03em', margin: '0 0 4px', fontFamily: 'Space Grotesk' }}>{c.v}</p>
                  <p style={{ fontSize: 11, color: 'rgba(232,237,245,0.3)', margin: 0 }}>{c.s}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(212,168,67,0.03)' }}>
              <p style={{ fontSize: 12, color: 'rgba(232,237,245,0.35)', margin: 0, textAlign: 'center' }}>
                Precio de referencia $2.000/m³ · mínimo $600 · comisión solo si hay entrega confirmada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAGO PROTEGIDO DETALLE ── */}
      <section style={{ padding: 'clamp(56px,7vw,88px) 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 40, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#D4A843', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 14px' }}>Pago con tarjeta</p>
            <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, color: '#E8EDF5', margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
              Tu plata no se mueve<br />hasta que llegó todo bien.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(232,237,245,0.45)', lineHeight: 1.75, margin: '0 0 24px' }}>
              Pagás con tarjeta de crédito o débito. El monto queda retenido en Movantia — no va al transportista hasta que vos o el destinatario confirmen que recibieron la mercadería en buen estado.
            </p>
            <a href="/app/send" onClick={e => { e.preventDefault(); localStorage.setItem('dev_role','consumer'); window.location.href='/app/send' }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,214,143,0.1)', border: '1.5px solid rgba(0,214,143,0.3)', color: '#00D68F', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
              Probar el flujo de pago →
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { step: '01', icon: '💳', title: 'Pagás con tarjeta', desc: 'Crédito o débito. El cobro se hace al confirmar la reserva.' },
              { step: '02', icon: '🔒', title: 'El dinero queda retenido', desc: 'No va al transportista. Lo retiene la plataforma hasta la entrega.' },
              { step: '03', icon: '📦', title: 'El paquete llega', desc: 'Confirmás que recibiste todo bien desde la app con un PIN.' },
              { step: '04', icon: '✅', title: 'Se libera el pago', desc: 'El transportista recibe su parte automáticamente. Cero fricción.' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#0D1018', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px' }}>
                <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#E8EDF5', margin: '0 0 3px' }}>{s.title}</p>
                  <p style={{ fontSize: 12, color: 'rgba(232,237,245,0.4)', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: 'clamp(56px,7vw,88px) 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#D4A843', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Preguntas frecuentes</p>
            <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, color: '#E8EDF5', margin: 0, letterSpacing: '-0.025em' }}>Lo que más nos preguntan</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { q: '¿El transportista cambia su ruta por mi carga?', a: 'No. El transportista ya tiene una ruta planificada. Vos aprovechás el espacio que le sobra en ese viaje. Por eso es más barato — él no hace nada extra.' },
              { q: '¿Qué pasa si el paquete llega roto o no llega?', a: 'Abrís una disputa desde la app. El monto queda retenido y Movantia media para resolverlo. Si el daño es comprobable, el pago al transportista queda bloqueado hasta que se llegue a un acuerdo.' },
              { q: '¿Cuánto cuesta enviar algo?', a: 'El precio es $2.000 por metro cúbico, con un mínimo de $600. Por ejemplo, una caja estándar de 0.5 m³ sale $1.000. Pagás solo por el espacio que usás.' },
              { q: '¿Cómo sé que el transportista es de confianza?', a: 'Todos los transportistas pasan por un proceso de verificación antes de poder publicar vueltas. Además, el sistema de PINes garantiza que nadie puede marcar una entrega sin que vos o el destinatario confirmen.' },
              { q: '¿Puedo publicar una vuelta si tengo una empresa pequeña?', a: 'Sí, perfecto para eso. Con tener un vehículo y hacer rutas frecuentes ya podés empezar a monetizar el espacio libre. No hay cuotas ni contratos — te registrás y publicás cuando querés.' },
              { q: '¿Qué pasa si nadie reserva mi vuelta?', a: 'No pasa nada. No hay costo por publicar. Si la vuelta no genera reservas, simplemente la vuelta vacía como siempre. Sin penalidades ni compromisos.' },
            ].map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: 'clamp(64px,8vw,96px) 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.18)', color: '#D4A843', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>
            <span style={{ width: 6, height: 6, background: '#D4A843', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,168,67,0.8)' }} />
            Sin registro · sin tarjeta · modo demo
          </div>
          <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, color: '#E8EDF5', margin: '0 0 16px', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Probalo ahora.<br /><span style={{ color: '#D4A843' }}>No te cuesta nada.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(232,237,245,0.45)', margin: '0 0 36px', lineHeight: 1.7 }}>
            Entrás como transportista o como cliente y ves exactamente cómo funciona el sistema. Datos reales, flujo completo, sin registrarte.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { localStorage.setItem('dev_role','transporter'); window.location.href='/app/transporter' }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#D4A843', color: '#07090F', border: 'none', borderRadius: 12, padding: '15px 28px', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Space Grotesk' }}>
              <Truck size={18} /> Soy transportista
            </button>
            <button onClick={() => { localStorage.setItem('dev_role','consumer'); window.location.href='/app/send' }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', color: '#E8EDF5', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '15px 28px', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Space Grotesk' }}>
              <Package size={18} /> Necesito enviar algo
            </button>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(232,237,245,0.2)' }}>
            ¿Preferís hablar con alguien? <a href={WA} target="_blank" rel="noreferrer" style={{ color: '#D4A843', textDecoration: 'none', fontWeight: 600 }}>Escribinos por WhatsApp →</a>
          </p>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section style={{ padding: '0 24px clamp(48px,6vw,80px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', paddingTop: 'clamp(40px,5vw,64px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px 40px' }}>
          {[
            { icon: '💳', text: 'Pagás con tarjeta · pago protegido' },
            { icon: '✅', text: 'Transportistas verificados' },
            { icon: '🇺🇾', text: 'Pesos uruguayos' },
            { icon: '⚡', text: 'Match en minutos' },
            { icon: '📍', text: 'Solo rutas de Uruguay' },
            { icon: '💬', text: 'Soporte por WhatsApp' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(232,237,245,0.38)', fontWeight: 500 }}>
              <span style={{ fontSize: 17 }}>{item.icon}</span>{item.text}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 20, height: 20, display: 'flex' }}><BrandMark /></span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(232,237,245,0.3)' }}>Movantia</span>
        </div>
        <p style={{ color: 'rgba(232,237,245,0.15)', fontSize: 12, margin: 0 }}>2026 · Uruguay</p>
      </footer>
    </div>
  )
}

/* ─── FAQ ITEM ── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', transition: 'border-color .2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor='rgba(212,168,67,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}
    >
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', padding: '18px 20px', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#E8EDF5', lineHeight: 1.4 }}>{q}</span>
        <span style={{ fontSize: 20, color: '#D4A843', flexShrink: 0, lineHeight: 1, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .2s' }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px', fontSize: 14, color: 'rgba(232,237,245,0.5)', lineHeight: 1.75, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ margin: '14px 0 0' }}>{a}</p>
        </div>
      )}
    </div>
  )
}

/* ─── ANIMATED ROUTE SVG ── */
function RouteSVG() {
  return (
    <svg viewBox="0 0 420 120" style={{ width: '100%', height: 'auto', display: 'block', background: 'rgba(7,9,15,0.5)', borderRadius: 10 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="100%" stopColor="#22c55e"/>
        </linearGradient>
        <filter id="rGlw">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {[70,140,210,280,350].map(x => <line key={x} x1={x} y1="0" x2={x} y2="120" stroke="rgba(255,255,255,0.025)" strokeWidth="1"/>)}
      {[40,80].map(y => <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="rgba(255,255,255,0.025)" strokeWidth="1"/>)}
      <path d="M 32 90 C 100 24 320 24 388 90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="5 9"/>
      <path id="rp" d="M 32 90 C 100 24 320 24 388 90" fill="none" stroke="url(#rg)" strokeWidth="2.5" strokeLinecap="round" filter="url(#rGlw)"/>
      <circle cx="32" cy="90" r="5" fill="#0D1018" stroke="#fbbf24" strokeWidth="1.5"/>
      <circle cx="32" cy="90" r="2" fill="#fbbf24"/>
      <text x="32" y="107" fill="#475569" fontSize="7" fontWeight="700" textAnchor="middle">MALDONADO</text>
      <circle cx="388" cy="90" r="5" fill="#0D1018" stroke="#22c55e" strokeWidth="1.5"/>
      <circle cx="388" cy="90" r="2" fill="#22c55e"/>
      <text x="388" y="107" fill="#475569" fontSize="7" fontWeight="700" textAnchor="middle">MONTEVIDEO</text>
      <g>
        <animateMotion dur="4.5s" repeatCount="indefinite" rotate="auto" calcMode="linear">
          <mpath href="#rp"/>
        </animateMotion>
        <rect x="-18" y="-5.5" width="23" height="11" rx="2" fill="#111827" stroke="rgba(251,191,36,0.35)" strokeWidth="1"/>
        <rect x="5" y="-8" width="12" height="16" rx="2.5" fill="#1e2d3d" stroke="#fbbf24" strokeWidth="1.2"/>
        <rect x="7.5" y="-6" width="5.5" height="4" rx="1" fill="rgba(56,189,248,0.7)"/>
        <circle cx="-8" cy="6.5" r="3" fill="#0f172a" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <circle cx="7"  cy="6.5" r="3" fill="#0f172a" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <circle cx="-8" cy="6.5" r="1" fill="rgba(255,255,255,0.15)"/>
        <circle cx="7"  cy="6.5" r="1" fill="rgba(255,255,255,0.15)"/>
      </g>
    </svg>
  )
}
