import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { BOOKING_STATUS_LABELS, formatPrice } from '../../lib/constants'
import StatusBadge from '../../components/shared/StatusBadge'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase.from('bookings')
      .select('*, consumers(name, email), empty_returns(origin_address, destination_address, companies(name))')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setBookings(data || []); setLoading(false) })
  }, [])

  const shown = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) return <Loader />

  const totalRevenue = bookings.reduce((s, b) => s + (b.price_total || 0), 0)
  const totalFee = bookings.reduce((s, b) => s + (b.platform_fee || 0), 0)

  return (
    <div style={{ padding: '20px', maxWidth: '760px', margin: '0 auto' }}>
      <h1 style={title}>Reservas</h1>

      {/* Quick stats */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <Chip label="Total" value={bookings.length} />
        <Chip label="Ingresos brutos" value={formatPrice(totalRevenue)} color="#D4A843" />
        <Chip label="Comisión plataforma" value={formatPrice(totalFee)} color="#a78bfa" />
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {['all', 'confirmed', 'picked_up', 'delivered', 'cancelled', 'disputed'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            ...filterBtn,
            background: filter === s ? '#D4A843' : '#0D1018',
            color: filter === s ? '#07090F' : '#9AA3B5',
            border: `1px solid ${filter === s ? '#D4A843' : 'rgba(255,255,255,0.1)'}`,
          }}>
            {s === 'all' ? 'Todas' : BOOKING_STATUS_LABELS[s]?.label || s}
          </button>
        ))}
      </div>

      {shown.length === 0 && <Empty text="No hay reservas" />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {shown.map(b => (
          <div key={b.id} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, color: '#E8EDF5', fontSize: '13px' }}>
                {b.consumers?.name || 'Consumidor'} → {b.empty_returns?.companies?.name || 'Empresa'}
              </span>
              <StatusBadge status={b.status} labels={BOOKING_STATUS_LABELS} />
            </div>
            <p style={{ fontSize: '12px', color: '#9AA3B5', marginBottom: '4px' }}>
              {b.pickup_address} → {b.delivery_address}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#9AA3B5' }}>
                {b.package_category} · {b.package_m3} m³ ·
                {new Date(b.created_at).toLocaleDateString('es-UY')}
              </span>
              <span style={{ color: '#D4A843', fontWeight: 700, fontSize: '13px', fontFamily: 'Space Grotesk' }}>
                {formatPrice(b.price_total)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Chip({ label, value, color = '#9AA3B5' }) {
  return (
    <div style={{ background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '8px 12px' }}>
      <p style={{ fontSize: '11px', color: '#9AA3B5', marginBottom: '2px' }}>{label}</p>
      <p style={{ fontSize: '15px', fontWeight: 700, color, fontFamily: 'Space Grotesk' }}>{value}</p>
    </div>
  )
}

function Loader() { return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#D4A843' }}>Cargando...</div> }
function Empty({ text }) { return <div style={{ textAlign: 'center', padding: '48px', color: '#9AA3B5' }}>{text}</div> }

const title = { fontFamily: 'Space Grotesk', fontSize: '20px', fontWeight: 700, color: '#E8EDF5', marginBottom: '16px' }
const card = { background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '14px' }
const filterBtn = { borderRadius: '20px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }
