import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { TRIP_STATUS_LABELS, formatPrice } from '../../lib/constants'
import StatusBadge from '../../components/shared/StatusBadge'

export default function AdminTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase.from('empty_returns')
      .select('*, companies(name), vehicles(name, type, plate)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setTrips(data || []); setLoading(false) })
  }, [])

  const shown = filter === 'all' ? trips : trips.filter(t => t.status === filter)

  if (loading) return <Loader />

  return (
    <div style={{ padding: '20px', maxWidth: '760px', margin: '0 auto' }}>
      <h1 style={title}>Vueltas vacías</h1>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {['all', 'active', 'partially_reserved', 'in_progress', 'completed'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            ...filterBtn,
            background: filter === s ? '#D4A843' : '#0D1018',
            color: filter === s ? '#07090F' : '#9AA3B5',
            border: `1px solid ${filter === s ? '#D4A843' : 'rgba(255,255,255,0.1)'}`,
          }}>
            {s === 'all' ? 'Todas' : TRIP_STATUS_LABELS[s]?.label || s}
          </button>
        ))}
      </div>

      <p style={{ color: '#9AA3B5', fontSize: '13px', marginBottom: '12px' }}>{shown.length} vueltas</p>

      {shown.length === 0 && <Empty text="No hay vueltas" />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {shown.map(t => {
          const available = (t.available_m3 || 0) - (t.used_m3 || 0)
          const potential = available * (t.price_per_m3 || 50)
          return (
            <div key={t.id} style={card}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: '#E8EDF5', fontSize: '14px' }}>
                    {t.companies?.name || 'Empresa'}
                  </span>
                  <StatusBadge status={t.status} labels={TRIP_STATUS_LABELS} />
                </div>
                <p style={{ fontSize: '12px', color: '#9AA3B5', marginBottom: '4px' }}>
                  {t.origin_address} → {t.destination_address}
                </p>
                <p style={{ fontSize: '12px', color: '#9AA3B5' }}>
                  🚚 {t.vehicles?.name || t.vehicles?.plate || 'Vehículo'} ·
                  📦 {available.toFixed(2)} m³ disponibles de {t.available_m3} m³ ·
                  💰 hasta {formatPrice(potential)}
                </p>
                {t.departure_time && (
                  <p style={{ fontSize: '11px', color: '#9AA3B5', marginTop: '4px' }}>
                    🕐 {new Date(t.departure_time).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Loader() {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#D4A843' }}>Cargando...</div>
}
function Empty({ text }) {
  return <div style={{ textAlign: 'center', padding: '48px', color: '#9AA3B5' }}>{text}</div>
}

const title = { fontFamily: 'Space Grotesk', fontSize: '20px', fontWeight: 700, color: '#E8EDF5', marginBottom: '16px' }
const card = { background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }
const filterBtn = { borderRadius: '20px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }
