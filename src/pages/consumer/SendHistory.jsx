import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Link } from 'react-router-dom'
import { BOOKING_STATUS_LABELS, formatPrice } from '../../lib/constants'
import { Package } from 'lucide-react'

export default function SendHistory() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: consumer } = await supabase.from('consumers').select('id').eq('user_id', user.id).single()
      if (!consumer) { setLoading(false); return }
      const { data } = await supabase
        .from('bookings')
        .select('*, empty_returns(origin_address, destination_address, companies(name))')
        .eq('consumer_id', consumer.id)
        .order('created_at', { ascending: false })
      setBookings(data || [])
      setLoading(false)
    }
    load()
  }, [user.id])

  if (loading) return <Loader />

  return (
    <div style={{ padding:'20px', maxWidth:'600px', margin:'0 auto' }}>
      <h1 style={styles.pageTitle}>Mis envíos</h1>

      {bookings.length === 0 && (
        <div style={{ textAlign:'center', padding:'48px 20px', color:'#9AA3B5' }}>
          <Package size={40} style={{ opacity:0.3, marginBottom:'12px' }} />
          <p style={{ marginBottom:'6px' }}>Todavía no enviaste nada</p>
          <Link to="/app/send" style={{ color:'#D4A843', fontSize:'14px', fontWeight:600 }}>Hacer mi primer envío →</Link>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {bookings.map(b => {
          const statusInfo = BOOKING_STATUS_LABELS[b.status] || { label: b.status, color: '#9AA3B5' }
          const isActive = !['delivered', 'cancelled'].includes(b.status)
          return (
            <Link key={b.id} to={`/app/send/tracking/${b.id}`} style={styles.card}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'14px', fontWeight:600, color:'#E8EDF5', marginBottom:'3px' }}>{b.pickup_address}</div>
                <div style={{ fontSize:'12px', color:'#9AA3B5', marginBottom:'8px' }}>→ {b.delivery_address}</div>
                <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                  <span style={{ fontSize:'12px', fontWeight:600, color: statusInfo.color }}>{statusInfo.label}</span>
                  <span style={{ fontSize:'12px', color:'#9AA3B5' }}>{new Date(b.created_at).toLocaleDateString('es-UY')}</span>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:'#D4A843', fontWeight:700, fontFamily:'Space Grotesk', fontSize:'15px' }}>{formatPrice(b.price_total)}</div>
                {isActive && <div style={{ fontSize:'11px', color:'#a78bfa', marginTop:'4px' }}>En curso →</div>}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function Loader() {
  return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', color:'#D4A843' }}>Cargando...</div>
}

const styles = {
  pageTitle: { fontFamily:'Space Grotesk', fontSize:'20px', fontWeight:700, color:'#E8EDF5', marginBottom:'20px' },
  card: { display:'flex', alignItems:'center', gap:'12px', background:'#0D1018', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'10px', padding:'16px', textDecoration:'none', color:'#E8EDF5' },
}
