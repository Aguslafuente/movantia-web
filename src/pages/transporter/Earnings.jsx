import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/constants'
import { TrendingUp, DollarSign, Package } from 'lucide-react'

export default function Earnings() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, count: 0, avgPerTrip: 0 })
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: co } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
      if (!co) { setLoading(false); return }

      const { data } = await supabase
        .from('bookings')
        .select('transporter_amount, created_at, pickup_address, delivery_address, empty_returns!inner(company_id)')
        .eq('empty_returns.company_id', co.id)
        .eq('status', 'delivered')
        .order('created_at', { ascending: false })

      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const all = data || []
      const total = all.reduce((s, b) => s + parseFloat(b.transporter_amount || 0), 0)
      const thisMonth = all.filter(b => b.created_at >= thisMonthStart).reduce((s, b) => s + parseFloat(b.transporter_amount || 0), 0)

      setStats({ total, thisMonth, count: all.length, avgPerTrip: all.length ? (total / all.length) : 0 })
      setHistory(all.slice(0, 20))
      setLoading(false)
    }
    load()
  }, [user.id])

  if (loading) return <Loader />

  return (
    <div style={{ padding:'20px', maxWidth:'600px', margin:'0 auto' }}>
      <h1 style={styles.pageTitle}>Mis ganancias</h1>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'24px' }}>
        <BigStat icon={<DollarSign size={20} color="#D4A843" />} label="Total ganado" value={formatPrice(stats.total)} accent="#D4A843" />
        <BigStat icon={<TrendingUp size={20} color="#00D68F" />} label="Este mes" value={formatPrice(stats.thisMonth)} accent="#00D68F" />
        <BigStat icon={<Package size={20} color="#a78bfa" />} label="Viajes completados" value={stats.count} accent="#a78bfa" />
        <BigStat icon={<DollarSign size={20} color="#38bdf8" />} label="Promedio por viaje" value={formatPrice(stats.avgPerTrip)} accent="#38bdf8" />
      </div>

      <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:'15px', fontWeight:600, color:'#9AA3B5', marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
        Historial
      </h2>

      {history.length === 0 && (
        <p style={{ color:'#9AA3B5', textAlign:'center', padding:'32px' }}>
          Todavía no completaste ningún viaje. ¡Activá tu primera vuelta vacía!
        </p>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {history.map((b, i) => (
          <div key={i} style={styles.row}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'13px', color:'#E8EDF5', marginBottom:'2px' }}>{b.pickup_address}</div>
              <div style={{ fontSize:'12px', color:'#9AA3B5' }}>→ {b.delivery_address}</div>
              <div style={{ fontSize:'11px', color:'#9AA3B5', marginTop:'4px' }}>
                {new Date(b.created_at).toLocaleDateString('es-UY')}
              </div>
            </div>
            <div style={{ color:'#00D68F', fontWeight:700, fontFamily:'Space Grotesk', fontSize:'15px' }}>
              +{formatPrice(parseFloat(b.transporter_amount))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BigStat({ icon, label, value, accent }) {
  return (
    <div style={{ background:'#0D1018', border:`1px solid ${accent}30`, borderRadius:'12px', padding:'16px' }}>
      <div style={{ marginBottom:'10px' }}>{icon}</div>
      <div style={{ fontSize:'22px', fontWeight:700, color: accent, fontFamily:'Space Grotesk, sans-serif' }}>{value}</div>
      <div style={{ fontSize:'12px', color:'#9AA3B5', marginTop:'3px' }}>{label}</div>
    </div>
  )
}

function Loader() {
  return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', color:'#D4A843' }}>Cargando...</div>
}

const styles = {
  pageTitle: { fontFamily:'Space Grotesk, sans-serif', fontSize:'20px', fontWeight:700, color:'#E8EDF5', marginBottom:'20px' },
  row: { display:'flex', alignItems:'center', gap:'12px', background:'#0D1018', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'10px', padding:'14px' },
}
