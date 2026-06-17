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

/* ─── LANDING ──────────────────────────────────────────── */
function MainPage() {
  const [adminModal, setAdminModal] = useState(false)

  return (
    <div style={{ background: '#07090F', minHeight: '100vh', color: '#E8EDF5', fontFamily: "'Space Grotesk', sans-serif" }}>
      {adminModal && <AdminModal onClose={() => setAdminModal(false)} />}

      {/* NAV */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(7,9,15,0.94)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 60, justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ width: 28, height: 28, display: 'flex' }}><BrandMark /></span>
            <span style={{ fontWeight: 800, fontSize: 17, color: '#E8EDF5', letterSpacing: '-0.02em' }}>Movantia</span>
          </a>
          <button onClick={() => setAdminModal(true)} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(232,237,245,0.45)', borderRadius: 8, padding: '7px 14px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(212,168,67,0.1)'; e.currentTarget.style.color='#D4A843'; e.currentTarget.style.borderColor='rgba(212,168,67,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgba(232,237,245,0.45)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)' }}
          >
            <ShieldCheck size={14} /> Admin
          </button>
        </div>
      </header>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: 'clamp(72px,10vw,120px) 24px clamp(60px,8vw,90px)' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
          background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)',
          color: '#D4A843', borderRadius: 20, padding: '5px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
        }}>
          <span style={{ width: 7, height: 7, background: '#D4A843', borderRadius: '50%' }} />
          Uruguay · pesos · escrow
        </div>

        <h1 style={{
          fontSize: 'clamp(52px,9vw,96px)', fontWeight: 900,
          lineHeight: 1.04, letterSpacing: '-0.04em',
          color: '#E8EDF5', margin: '0 0 22px',
        }}>
          Tu camión<br />
          <span style={{ color: '#D4A843' }}>vuelve lleno.</span>
        </h1>

        <p style={{ fontSize: 18, color: 'rgba(232,237,245,0.45)', maxWidth: 360, margin: '0 auto 48px', lineHeight: 1.55 }}>
          Conectamos vueltas vacías con carga que necesita llegar.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
          <AccessBtn role="transporter" path="/app/transporter" primary>
            <Truck size={16} /> Tengo un camión
          </AccessBtn>
          <AccessBtn role="consumer" path="/app/send">
            <Package size={16} /> Necesito enviar algo
          </AccessBtn>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(232,237,245,0.2)', margin: 0 }}>
          Demo con datos reales · sin registro · sin tarjeta
        </p>
      </section>

      {/* CÓMO FUNCIONA — 3 pasos */}
      <section style={{ padding: '0 24px 80px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: '2px', background: 'rgba(255,255,255,0.05)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          {[
            { icon: '📍', title: 'Publicás', sub: 'Tu ruta y espacio libre' },
            { icon: '⚡', title: 'Match',    sub: 'Carga compatible en minutos' },
            { icon: '✅', title: 'Cobrás',   sub: 'Pago protegido con escrow' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#0D1018', padding: 'clamp(22px,3vw,36px) 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#E8EDF5', marginBottom: 5 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: '#9AA3B5', lineHeight: 1.4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', background: '#0D1018',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden',
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[
            { label: 'Precio referencia', value: '$2.000/m³', color: '#D4A843' },
            { label: 'Comisión plataforma', value: '12%',      color: '#E8EDF5' },
            { label: 'Pago',               value: 'Escrow',    color: '#00D68F' },
          ].map((item, i, arr) => (
            <div key={i} style={{
              padding: '20px 32px', textAlign: 'center',
              borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: item.color, fontFamily: 'Space Grotesk' }}>{item.value}</div>
              <div style={{ fontSize: 11, color: '#9AA3B5', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '28px 24px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(232,237,245,0.15)', fontSize: 12, margin: 0 }}>
          2026 Movantia · Uruguay
        </p>
      </footer>
    </div>
  )
}
