import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Truck, Package, Plus, DollarSign, History, LogOut, Search, Clock } from 'lucide-react'

export default function AppLayout({ children }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const isTransporter = profile?.role === 'transporter'

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const transporterNav = [
    { to: '/app/transporter', label: 'Inicio', icon: Truck, end: true },
    { to: '/app/transporter/new-return', label: 'Activar vuelta', icon: Plus },
    { to: '/app/transporter/bookings', label: 'Reservas', icon: Package },
    { to: '/app/transporter/earnings', label: 'Ganancias', icon: DollarSign },
    { to: '/app/transporter/history', label: 'Historial', icon: History },
  ]

  const consumerNav = [
    { to: '/app/send', label: 'Enviar', icon: Search, end: true },
    { to: '/app/send/history', label: 'Mis envíos', icon: Clock },
  ]

  const navItems = isTransporter ? transporterNav : consumerNav

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#07090F', color:'#E8EDF5', fontFamily:'DM Sans, sans-serif' }}>
      {/* Top bar */}
      <header style={{ background:'#0D1018', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 20px', height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
          <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:'18px', color:'#D4A843' }}>MOVANTIA</span>
          <span style={{ fontSize:'11px', color:'#9AA3B5', background:'rgba(212,168,67,0.12)', padding:'2px 8px', borderRadius:'20px', fontWeight:500 }}>
            {isTransporter ? 'Transportista' : 'Mis envíos'}
          </span>
        </a>
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
