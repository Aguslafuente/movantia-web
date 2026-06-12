import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { formatPrice, BOOKING_STATUS_LABELS, PACKAGE_CATEGORIES } from '../../lib/constants'
import PinInput from '../../components/app/PinInput'
import BookingStatus from '../../components/app/BookingStatus'
import { Package, MapPin, Clock } from 'lucide-react'

export default function TransporterBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePin, setActivePin] = useState(null) // { bookingId, type: 'pickup'|'delivery' }
  const [pinError, setPinError] = useState('')

  useEffect(() => { loadBookings() }, [user.id])

  async function loadBookings() {
    let { data: co } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
    // Dev mode fallback: use first available company
    if (!co) {
      const { data: fallback } = await supabase.from('companies').select('id').limit(1).single()
      co = fallback
    }
    if (!co) { setLoading(false); return }

    const { data } = await supabase
      .from('bookings')
      .select('*, empty_returns!inner(*)')
      .eq('empty_returns.company_id', co.id)
      .not('status', 'in', '("cancelled","delivered")')
      .order('estimated_pickup_time')
    setBookings(data || [])
    setLoading(false)
  }

  async function handlePinConfirm(pin) {
    if (!activePin) return
    const { bookingId, type } = activePin
    const booking = bookings.find(b => b.id === bookingId)
    const expectedPin = type === 'pickup' ? booking.pickup_pin : booking.delivery_pin

    if (pin !== expectedPin) {
      setPinError('PIN incorrecto. Pedile el código al cliente.')
      return
    }

    const newStatus = type === 'pickup' ? 'picked_up' : 'delivered'
    const paymentStatus = type === 'delivery' ? 'released' : booking.payment_status
    await supabase.from('bookings').update({ status: newStatus, payment_status: paymentStatus }).eq('id', bookingId)
    setActivePin(null)
    setPinError('')
    loadBookings()
  }

  if (loading) return <Loader />

  return (
    <div style={{ padding:'20px', maxWidth:'600px', margin:'0 auto' }}>
      <h1 style={styles.pageTitle}>Reservas activas</h1>

      {bookings.length === 0 && (
        <div style={{ textAlign:'center', padding:'48px 20px', color:'#9AA3B5' }}>
          <Package size={40} style={{ opacity:0.3, marginBottom:'12px' }} />
          <p>No hay reservas activas</p>
          <p style={{ fontSize:'13px' }}>Las reservas aparecen aquí cuando alguien reserva espacio en tu vuelta</p>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
        {bookings.map(b => (
          <div key={b.id} style={styles.card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
              <div>
                <p style={{ fontSize:'13px', color:'#9AA3B5', marginBottom:'2px' }}>{PACKAGE_CATEGORIES.find(c => c.value === b.package_category)?.label || b.package_category || 'Paquete'} · {b.package_m3} m³</p>
                <p style={{ fontSize:'16px', fontWeight:700, color:'#D4A843', fontFamily:'Space Grotesk' }}>{formatPrice(b.transporter_amount)}</p>
              </div>
              <BookingStatus status={b.status} />
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'14px' }}>
              <InfoRow icon={<MapPin size={14} />} label="Retiro" value={b.pickup_address} />
              <InfoRow icon={<MapPin size={14} color="#00D68F" />} label="Entrega" value={b.delivery_address} />
              {b.estimated_pickup_time && (
                <InfoRow icon={<Clock size={14} />} label="Hora de retiro" value={new Date(b.estimated_pickup_time).toLocaleTimeString('es-UY', { hour:'2-digit', minute:'2-digit' })} />
              )}
            </div>

            {/* PIN confirmations */}
            {b.status === 'confirmed' && (
              <div>
                {activePin?.bookingId === b.id && activePin?.type === 'pickup' ? (
                  <div>
                    <PinInput label="Pedile el PIN al cliente para confirmar el retiro:" onComplete={handlePinConfirm} />
                    {pinError && <p style={{ color:'#ef4444', fontSize:'13px', marginTop:'8px' }}>{pinError}</p>}
                    <button onClick={() => { setActivePin(null); setPinError('') }} style={styles.cancelBtn}>Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => { setActivePin({ bookingId: b.id, type: 'pickup' }); setPinError('') }} style={styles.actionBtn}>
                    📦 Confirmar retiro con PIN
                  </button>
                )}
              </div>
            )}

            {b.status === 'picked_up' && (
              <div>
                {activePin?.bookingId === b.id && activePin?.type === 'delivery' ? (
                  <div>
                    <PinInput label="Pedile el PIN al destinatario para confirmar la entrega:" onComplete={handlePinConfirm} />
                    {pinError && <p style={{ color:'#ef4444', fontSize:'13px', marginTop:'8px' }}>{pinError}</p>}
                    <button onClick={() => { setActivePin(null); setPinError('') }} style={styles.cancelBtn}>Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => { setActivePin({ bookingId: b.id, type: 'delivery' }); setPinError('') }} style={{ ...styles.actionBtn, background:'rgba(0,214,143,0.1)', borderColor:'#00D68F', color:'#00D68F' }}>
                    ✅ Confirmar entrega con PIN
                  </button>
                )}
              </div>
            )}

            {b.status === 'delivered' && (
              <p style={{ color:'#00D68F', fontSize:'13px', fontWeight:600 }}>✅ Entrega confirmada — pago liberado</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display:'flex', gap:'8px', alignItems:'flex-start' }}>
      <span style={{ color:'#9AA3B5', marginTop:'2px', flexShrink:0 }}>{icon}</span>
      <span style={{ fontSize:'13px', color:'#9AA3B5', flexShrink:0, minWidth:'56px' }}>{label}:</span>
      <span style={{ fontSize:'13px', color:'#E8EDF5' }}>{value}</span>
    </div>
  )
}

function Loader() {
  return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', color:'#D4A843' }}>Cargando...</div>
}

const styles = {
  pageTitle: { fontFamily:'Space Grotesk, sans-serif', fontSize:'20px', fontWeight:700, color:'#E8EDF5', marginBottom:'20px' },
  card: { background:'#0D1018', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'18px' },
  actionBtn: { width:'100%', background:'rgba(212,168,67,0.1)', border:'1.5px solid #D4A843', borderRadius:'8px', padding:'12px', color:'#D4A843', fontSize:'14px', fontWeight:600, cursor:'pointer' },
  cancelBtn: { marginTop:'10px', background:'none', border:'none', color:'#9AA3B5', fontSize:'13px', cursor:'pointer', padding:0 },
}
