import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { haversineDistance, formatPrice } from '../../lib/constants'
import { Clock, Star, Truck, ArrowRight } from 'lucide-react'

export default function SendOptions() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!state) { navigate('/app/send'); return }
      const { data } = await supabase
        .from('empty_returns')
        .select('*, companies(*), vehicles(*)')
        .eq('status', 'active')
        .gte('available_m3', state.packageM3)
        .gte('estimated_return_time', new Date().toISOString())
        .order('estimated_return_time')

      // Basic geo filtering: returns whose route area is within ~8km
      // Since we don't have lat/lng from text addresses in MVP, show all active returns
      // In production, geocode addresses first
      setReturns(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (!state) return null
  if (loading) return <Loader />

  return (
    <div style={{ padding:'20px', maxWidth:'600px', margin:'0 auto' }}>
      <button onClick={() => navigate('/app/send')} style={styles.backBtn}>← Volver</button>
      <h1 style={styles.pageTitle}>Vueltas disponibles</h1>
      <p style={{ color:'#9AA3B5', fontSize:'13px', marginBottom:'20px' }}>
        {state.pickupAddress} → {state.deliveryAddress} · {state.packageM3} m³ · {formatPrice(state.price)}
      </p>

      {returns.length === 0 && (
        <div style={{ textAlign:'center', padding:'48px 20px', background:'#0D1018', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.07)' }}>
          <Truck size={40} style={{ opacity:0.3, marginBottom:'12px', color:'#9AA3B5' }} />
          <p style={{ color:'#E8EDF5', fontWeight:600, marginBottom:'8px' }}>No hay vueltas disponibles ahora</p>
          <p style={{ color:'#9AA3B5', fontSize:'13px' }}>Dejá tu email y te avisamos cuando haya una en esta ruta</p>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
        {returns.map(r => (
          <ReturnCard
            key={r.id}
            r={r}
            state={state}
            onSelect={() => navigate(`/app/send/booking/${r.id}`, { state: { ...state, returnId: r.id, returnData: r } })}
          />
        ))}
      </div>
    </div>
  )
}

function ReturnCard({ r, state, onSelect }) {
  const returnTime = new Date(r.estimated_return_time)
  const windowStart = new Date(returnTime.getTime() - 10 * 60000)
  const windowEnd = new Date(returnTime.getTime() + 10 * 60000)
  const available = r.available_m3 - (r.used_m3 || 0)
  const price = state.packageM3 * r.price_per_m3

  return (
    <div style={styles.card}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
        <div>
          <div style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:'16px', color:'#E8EDF5', marginBottom:'2px' }}>
            {r.companies?.name || 'Transportista verificado'}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'#9AA3B5', fontSize:'13px' }}>
            <Star size={13} color="#f0a500" fill="#f0a500" />
            <span>{r.companies?.rating?.toFixed(1) || '5.0'}</span>
            <span>·</span>
            <span>{r.vehicles?.type || 'Vehículo'}</span>
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'22px', fontWeight:800, color:'#D4A843', fontFamily:'Space Grotesk' }}>{formatPrice(price)}</div>
          <div style={{ fontSize:'11px', color:'#9AA3B5' }}>USD {r.price_per_m3}/m³</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:'16px', marginBottom:'14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'5px', color:'#9AA3B5', fontSize:'13px' }}>
          <Clock size={14} />
          Retiro: {windowStart.toLocaleTimeString('es-UY', { hour:'2-digit', minute:'2-digit' })}–{windowEnd.toLocaleTimeString('es-UY', { hour:'2-digit', minute:'2-digit' })}
        </div>
        <div style={{ color:'#9AA3B5', fontSize:'13px' }}>
          {available.toFixed(1)} m³ libres
        </div>
      </div>

      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'8px', padding:'10px', marginBottom:'14px', fontSize:'12px', color:'#9AA3B5' }}>
        📍 <strong style={{ color:'#E8EDF5' }}>Ruta:</strong> {r.origin_address} → {r.destination_address}
      </div>

      <div style={{ background:'rgba(240,165,0,0.06)', borderRadius:'8px', padding:'10px', marginBottom:'14px', fontSize:'12px', color:'#9AA3B5' }}>
        ⚠️ Tenés que estar listo para entregar el paquete en la ventana horaria indicada. El transportista no espera más de 3 minutos.
      </div>

      <button onClick={onSelect} style={styles.selectBtn}>
        Reservar este lugar <ArrowRight size={16} />
      </button>
    </div>
  )
}

function Loader() {
  return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', color:'#D4A843' }}>Buscando vueltas...</div>
}

const styles = {
  backBtn: { background:'none', border:'none', color:'#9AA3B5', fontSize:'14px', cursor:'pointer', padding:'0 0 16px', display:'block' },
  pageTitle: { fontFamily:'Space Grotesk, sans-serif', fontSize:'20px', fontWeight:700, color:'#E8EDF5', marginBottom:'6px' },
  card: { background:'#0D1018', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'18px' },
  selectBtn: { width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', background:'#D4A843', color:'#07090F', border:'none', borderRadius:'8px', padding:'13px', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:'Space Grotesk' },
}
