import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Truck, Package, Plus, DollarSign, History, LogOut, Search, Clock, LayoutDashboard, Building2, AlertTriangle, MapPin, Home } from 'lucide-react'

const WA = 'https://wa.me/59898534165?text=Hola%2C%20quiero%20consultar%20por%20Movantia'

export default function AppLayout({ children }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const role = profile?.role
  const isTransporter = role === 'transporter'
  const isAdmin = role === 'admin'
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setDrawer(false) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [drawer])

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const transporterNav = [
    { to: '/app/transporter', label: 'Inicio', icon: Truck, end: true },
    { to: '/app/transporter/new-return', label: 'Activar vuelta', icon: Plus },
    { to: '/app/transporter/bookings', label: 'Reservas', icon: Package },
    { to: '/app/transporter/earnings', label: 'Ganancias', icon: DollarSign },
  ]

  const consumerNav = [
    { to: '/app/send', label: 'Enviar', icon: Search, end: true },
    { to: '/app/send/history', label: 'Mis envíos', icon: Clock },
  ]

  const adminNav = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/companies', label: 'Empresas', icon: Building2 },
    { to: '/admin/trips', label: 'Vueltas', icon: MapPin },
    { to: '/admin/bookings', label: 'Reservas', icon: Package },
    { to: '/admin/incidents', label: 'Incidencias', icon: AlertTriangle },
  ]

  const navItems = isTransporter ? transporterNav : isAdmin ? adminNav : consumerNav

  // Full quick-access list for the drawer (includes pages not in the bottom bar)
  const transporterFull = [
    { to: '/app/transporter', label: 'Inicio', icon: Truck, end: true },
    { to: '/app/transporter/new-return', label: 'Activar vuelta', icon: Plus },
    { to: '/app/transporter/bookings', label: 'Reservas', icon: Package },
    { to: '/app/transporter/earnings', label: 'Ganancias', icon: DollarSign },
    { to: '/app/transporter/vehicles', label: 'Vehículos', icon: Truck },
    { to: '/app/transporter/routes', label: 'Rutas frecuentes', icon: MapPin },
  ]
  const consumerFull = [
    { to: '/app/send', label: 'Enviar carga', icon: Search, end: true },
    { to: '/app/send/history', label: 'Mis envíos', icon: Clock },
  ]
  const drawerItems = isTransporter ? transporterFull : isAdmin ? adminNav : consumerFull
  const roleLabel = isTransporter ? 'Transportista' : isAdmin ? 'Admin' : 'Mis envíos'

  const drawerLink = ({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10,
    textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600,
    color: isActive ? '#D4A843' : 'rgba(232,237,245,0.82)',
    background: isActive ? 'rgba(212,168,67,0.1)' : 'transparent',
  })
  const extraLink = { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, color: 'rgba(232,237,245,0.82)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#07090F', color:'#E8EDF5', fontFamily:'DM Sans, sans-serif' }}>
      {/* Drawer */}
      <div onClick={() => setDrawer(false)} style={{ position:'fixed', inset:0, zIndex:250, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', opacity: drawer ? 1 : 0, pointerEvents: drawer ? 'auto' : 'none', transition:'opacity .28s ease' }} />
      <aside style={{ position:'fixed', top:0, left:0, bottom:0, zIndex:260, width:'min(82vw,300px)', background:'#0D1018', borderRight:'1px solid rgba(255,255,255,0.08)', boxShadow:'8px 0 44px rgba(0,0,0,0.5)', transform: drawer ? 'translateX(0)' : 'translateX(-100%)', transition:'transform .3s cubic-bezier(.22,.61,.36,1)', display:'flex', flexDirection:'column', padding:'16px 14px', overflowY:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 6px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ display:'flex', alignItems:'center', gap:9 }}>
            <img src="/movantia-favicon.png" alt="Movantia" style={{ width:30, height:30, objectFit:'contain' }} />
            <span style={{ fontWeight:800, fontSize:15, color:'#D4A843', fontFamily:'Space Grotesk, sans-serif' }}>MOVANTIA</span>
          </span>
          <button onClick={() => setDrawer(false)} aria-label="Cerrar menú" style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:8, width:30, height:30, color:'#E8EDF5', cursor:'pointer', fontSize:18, lineHeight:1 }}>×</button>
        </div>

        <p style={{ fontSize:10, fontWeight:700, color:'rgba(232,237,245,0.35)', letterSpacing:'0.1em', textTransform:'uppercase', margin:'14px 8px 4px' }}>{roleLabel}</p>
        {drawerItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setDrawer(false)} style={drawerLink}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}

        <p style={{ fontSize:10, fontWeight:700, color:'rgba(232,237,245,0.35)', letterSpacing:'0.1em', textTransform:'uppercase', margin:'16px 8px 4px' }}>Accesos</p>
        <a href="/" style={extraLink}><Home size={18} /> Ir al inicio</a>
        <a href={WA} target="_blank" rel="noreferrer" style={{ ...extraLink, color:'#25D366' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.52 0-3.01-.41-4.31-1.19l-.31-.18-3.2.84.85-3.12-.2-.32a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24zm4.52 10.4c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg>
          WhatsApp
        </a>

        <div style={{ marginTop:'auto', paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => { setDrawer(false); handleSignOut() }} style={{ ...extraLink, color:'#f87171' }}><LogOut size={18} /> Cerrar sesión</button>
        </div>
      </aside>

      {/* Top bar */}
      <header style={{ background:'#0D1018', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 16px', height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={() => setDrawer(true)} aria-label="Abrir menú" style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', color:'#E8EDF5', borderRadius:8, padding:'6px 9px', cursor:'pointer', display:'flex', alignItems:'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
          </button>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
            <img src="/movantia-favicon.png" alt="Movantia" style={{ width:'34px', height:'34px', objectFit:'contain' }} />
            <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:'17px', color:'#D4A843' }}>MOVANTIA</span>
            <span style={{ fontSize:'11px', color:'#9AA3B5', background:'rgba(212,168,67,0.12)', padding:'2px 8px', borderRadius:'20px', fontWeight:500 }}>
              {roleLabel}
            </span>
          </a>
        </div>
        <button onClick={handleSignOut} style={{ background:'none', border:'none', color:'#9AA3B5', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', fontSize:'13px' }}>
          <LogOut size={15} /> Salir
        </button>
      </header>

      {/* Content + bottom nav */}
      <div style={{ flex:1, paddingBottom:'72px' }}>
        {children}
      </div>

      {/* Bottom navigation */}
      <nav style={{ position:'fixed', bottom:0, left:0, right:0, background:'#0D1018', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', zIndex:100 }}>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={({ isActive }) => ({
              flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              padding:'10px 0 8px', textDecoration:'none', gap:'3px',
              color: isActive ? '#D4A843' : '#9AA3B5',
              borderTop: isActive ? '2px solid #D4A843' : '2px solid transparent',
              fontSize:'11px', fontWeight: isActive ? 600 : 400,
            })}
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleSignOut}
          style={{ flex:0.6, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'none', border:'none', cursor:'pointer', padding:'10px 0 8px', gap:'3px', color:'#9AA3B5', fontSize:'11px', borderTop:'2px solid transparent' }}
        >
          <LogOut size={20} />
          Salir
        </button>
      </nav>
    </div>
  )
}
