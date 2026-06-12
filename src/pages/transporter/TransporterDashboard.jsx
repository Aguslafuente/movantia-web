import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Plus, Package, DollarSign, Truck, ChevronRight } from 'lucide-react'
import BookingStatus from '../../components/app/BookingStatus'
import { formatPrice, BOOKING_STATUS_LABELS } from '../../lib/constants'

export default function TransporterDashboard() {
  const { user } = useAuth()
  const [company, setCompany] = useState(null)
  const [activeReturns, setActiveReturns] = useState([])
  const [todayBookings, setTodayBookings] = useState([])
  const [earnings, setEarnings] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: co } = await supabase.from('companies').select('*').eq('user_id', user.id).single()
      setCompany(co)
      if (!co) { setLoading(false); return }

      const today = new Date().toISOString().split('T')[0]
      const { data: returns } = await supabase
        .from('empty_returns')
        .select('*, vehicles(*), bookings(*)')
        .eq('company_id', co.id)
        .eq('status', 'active')
        .order('estimated_return_time')
      setActiveReturns(returns || [])

      const { data: bookings } = await supabase
        .from('bookings')
        .select('*, empty_returns!inner(*)')
        .eq('empty_returns.company_id', co.id)
        .gte('created_at', today)
        .not('status', 'eq', 'cancelled')
        .order('estimated_pickup_time')
      setTodayBookings(bookings || [])

      const { data: delivered } = await supabase
        .from('bookings')
        .select('transporter_amount, empty_returns!inner(company_id)')
        .eq('empty_returns.company_id', co.id)
        .eq('status', 'delivered')
      const total = (delivered || []).reduce((sum, b) => sum + parseFloat(b.transporter_amount || 0), 0)
      setEarnings(total)
      setLoading(false)
    }
    load()
  }, [user.id])

  if (loading) return <Loader />

  return (
    <div style={{ padding:'20px', maxWidth:'600px', margin:'0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom:'24px' }}>
        <p style={{ color:'#9AA3B5', fontSize:'13px', marginBottom:'4px' }}>Bienvenido,</p>
        <h1 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:'22px', fontWeight:700, color:'#E8EDF5', margin:0 }}>
          {company?.name || 'Tu empresa'}
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'24px' }}>
        <StatCard icon={<Package size={18} color="#D4A843" />} label="Reservas hoy" value={todayBookings.length} />
        <StatCard icon={<Truck size={18} color="#a78bfa" />} label="Vueltas activas" value={activeReturns.length} />
        <StatCard icon={<DollarSign size={18} color="#00D68F" />} label="Ganado total" value={`$${earnings.toFixed(0)}`} />
      </div>

      {/* CTA */}
      <Link to="/app/transporter/new-return" style={styles.ctaBtn}>
        <Plus size={20} />
        Activar vuelta vacía
      </Link>

      {/* Today's bookings */}
      {todayBookings.length > 0 && (
        <Section title="Reservas de hoy">
          {todayBookings.map(b => (
            <Link key={b.id} to={`/app/transporter/bookings`} style={styles.bookingCard}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'14px', fontWeight:600, marginBottom:'4px' }}>{b.pickup_address}</div>
                <div style={{ fontSize:'12px', color:'#9AA3B5' }}>→ {b.delivery_address}</div>
                <div style={{ marginTop:'8px' }}>
                  <span style={{ fontSize:'12px', color: BOOKING_STATUS_LABELS[b.status]?.color || '#D4A843', fontWeight:600 }}>
                    {BOOKING_STATUS_LABELS[b.status]?.label}
                  </span>
                  <span style={{ fontSize:'12px', color:'#9AA3B5', marginLeft:'10px' }}>PIN retiro: {b.pickup_pin}</span>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:'#D4A843', fontWeight:700, fontFamily:'Space Grotesk, sans-serif' }}>{formatPrice(b.transporter_amount)}</div>
                <ChevronRight size={16} color="#9AA3B5" style={{ marginTop:'4px' }} />
              </div>
            </Link>
          ))}
        </Section>
      )}

      {todayBookings.length === 0 && (
        <div style={{ textAlign:'center', padding:'40px 20px', color:'#9AA3B5' }}>
          <Truck size={40} style={{ opacity:0.3, marginBottom:'12px' }} />
          <p style={{ marginBottom:'6px' }}>No hay reservas para hoy</p>
          <p style={{ fontSize:'13px' }}>Activá una vuelta vacía para empezar a recibir pedidos</p>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div style={{ background:'#0D1018', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px', padding:'14px 12px' }}>
      <div style={{ marginBottom:'8px' }}>{icon}</div>
      <div style={{ fontSize:'18px', fontWeight:700, color:'#E8EDF5', fontFamily:'Space Grotesk, sans-serif' }}>{value}</div>
      <div style={{ fontSize:'11px', color:'#9AA3B5', marginTop:'2px' }}>{label}</div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:'24px' }}>
      <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:'15px', fontWeight:600, color:'#9AA3B5', marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{title}</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>{children}</div>
    </div>
  )
}

function Loader() {
  return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', color:'#D4A843', fontFamily:'Space Grotesk' }}>Cargando...</div>
}

const styles = {
  ctaBtn: { display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', background:'#D4A843', color:'#07090F', borderRadius:'10px', padding:'16px', fontSize:'16px', fontWeight:700, textDecoration:'none', fontFamily:'Space Grotesk, sans-serif', marginBottom:'24px' },
  bookingCard: { display:'flex', alignItems:'center', gap:'12px', background:'#0D1018', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'10px', padding:'14px', textDecoration:'none', color:'#E8EDF5' },
}
