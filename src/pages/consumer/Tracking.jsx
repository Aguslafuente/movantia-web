import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import BookingStatus from '../../components/app/BookingStatus'
import { formatPrice } from '../../lib/constants'
import { MapPin, Clock, Package, Shield } from 'lucide-react'

export default function Tracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    loadBooking()
    // Subscribe to realtime updates
    const channel = supabase.channel('booking-' + id)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `id=eq.${id}` },
        payload => setBooking(b => ({ ...b, ...payload.new }))
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [id])

  async function loadBooking() {
    const { data } = await supabase
      .from('bookings')
      .select('*, empty_returns(*, companies(*))')
      .eq('id', id)
      .single()
    setBooking(data)
    setLoading(false)
  }

  async function handleConfirmDelivery() {
    setConfirming(true)
    await supabase.from('bookings').update({ consumer_confirmed: true, status: 'delivered', payment_status: 'released' }).eq('id', id)
    setConfirming(false)
  }

  if (loading) return <Loader />
  if (!booking) return <div style={{ padding:'20px', color:'#9AA3B5' }}>Reserva no encontrada</div>

  const company = booking.empty_returns?.companies

  return (
    <div style={{ padding:'20px', maxWidth:'560px', margin:'0 auto' }}>
      <button onClick={() => navigate('/app/send/history')} style={styles.backBtn}>← Mis envíos</button>
      <h1 style={styles.pageTitle}>Seguimiento</h1>

      <div style={{ marginBottom:'20px' }}>
        <BookingStatus status={booking.status} />
      </div>

      <div style={styles.card}>
        <InfoRow icon={<Package size={15} />} label="Paquete" value={`${booking.package_category || 'Personalizado'} · ${booking.package_m3} m³`} />
        <InfoRow icon={<MapPin size={15} />} label="Retiro" value={booking.pickup_address} />
        <InfoRow icon={<MapPin size={15} color="#00D68F" />} label="Entrega" value={booking.delivery_address} />
        {booking.estimated_pickup_time && (
          <InfoRow icon={<Clock size={15} />} label="Hora estimada" value={new Date(booking.estimated_pickup_time).toLocaleString('es-UY', { dateStyle:'short', timeStyle:'short' })} />
        )}
      </div>

      {company && (
        <div style={styles.card}>
          <p style={{ fontSize:'13px', color:'#9AA3B5', marginBottom:'8px' }}>Transportista</p>
          <p style={{ fontSize:'15px', fontWeight:600, color:'#E8EDF5' }}>{company.name}</p>
          <p style={{ fontSize:'13px', color:'#9AA3B5', marginTop:'2px' }}>⭐ {company.rating?.toFixed(1) || '5.0'}</p>
        </div>
      )}

      {/* PIN display */}
      <div style={styles.card}>
        <p style={{ fontSize:'13px', color:'#9AA3B5', marginBottom:'12px', fontWeight:600 }}>TUS PINES</p>
        <div style={{ display:'flex', gap:'12px' }}>
          <PinDisplay label="PIN de retiro" pin={booking.pickup_pin} used={['picked_up','in_transit','delivered'].includes(booking.status)} />
          <PinDisplay label="PIN de entrega" pin={booking.delivery_pin} used={booking.status === 'delivered'} />
        </div>
      </div>

      {/* Payment protection */}
      <div style={{ background:'rgba(0,214,143,0.06)', border:'1px solid rgba(0,214,143,0.15)', borderRadius:'10px', padding:'14px', marginBottom:'16px', display:'flex', gap:'10px', alignItems:'flex-start' }}>
        <Shield size={18} color="#00D68F" style={{ flexShrink:0, marginTop:'1px' }} />
        <div>
          <p style={{ fontSize:'13px', color:'#00D68F', fontWeight:600, marginBottom:'2px' }}>Pago protegido</p>
          <p style={{ fontSize:'12px', color:'#9AA3B5' }}>
            {booking.payment_status === 'released'
              ? 'El pago fue liberado al transportista. ¡Gracias por usar Movantia!'
              : 'Tu pago queda retenido hasta que confirmés la entrega.'}
          </p>
        </div>
      </div>

      {/* Confirm delivery button */}
      {booking.status === 'picked_up' && !booking.consumer_confirmed && (
        <button onClick={handleConfirmDelivery} disabled={confirming} style={styles.confirmBtn}>
          {confirming ? 'Confirmando...' : '✅ Confirmar que recibí todo bien'}
        </button>
      )}

      {booking.status === 'delivered' && (
        <div style={{ textAlign:'center', padding:'20px', color:'#00D68F' }}>
          <p style={{ fontWeight:700, marginBottom:'4px' }}>¡Entrega completada!</p>
          <p style={{ fontSize:'13px', color:'#9AA3B5' }}>Pagaste {formatPrice(booking.price_total)} · el transportista recibió {formatPrice(booking.transporter_amount)}</p>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display:'flex', gap:'8px', alignItems:'flex-start', marginBottom:'10px' }}>
      <span style={{ color:'#9AA3B5', marginTop:'2px', flexShrink:0 }}>{icon}</span>
      <span style={{ fontSize:'13px', color:'#9AA3B5', flexShrink:0, minWidth:'60px' }}>{label}:</span>
      <span style={{ fontSize:'13px', color:'#E8EDF5' }}>{value}</span>
    </div>
  )
}

function PinDisplay({ label, pin, used }) {
  return (
    <div style={{ flex:1, background:'#07090F', borderRadius:'8px', padding:'12px', opacity: used ? 0.5 : 1 }}>
      <p style={{ fontSize:'11px', color:'#9AA3B5', marginBottom:'4px' }}>{label}</p>
      <p style={{ fontFamily:'Space Grotesk', fontSize:'26px', fontWeight:800, color: used ? '#9AA3B5' : '#D4A843', letterSpacing:'4px' }}>{pin}</p>
      {used && <p style={{ fontSize:'11px', color:'#00D68F' }}>✓ Usado</p>}
    </div>
  )
}

function Loader() {
  return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', color:'#D4A843' }}>Cargando...</div>
}

const styles = {
  backBtn: { background:'none', border:'none', color:'#9AA3B5', fontSize:'14px', cursor:'pointer', padding:'0 0 16px', display:'block' },
  pageTitle: { fontFamily:'Space Grotesk', fontSize:'20px', fontWeight:700, color:'#E8EDF5', marginBottom:'20px' },
  card: { background:'#0D1018', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px', padding:'16px', marginBottom:'12px' },
  confirmBtn: { width:'100%', background:'rgba(0,214,143,0.1)', border:'1.5px solid #00D68F', color:'#00D68F', borderRadius:'10px', padding:'15px', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:'Space Grotesk' },
}
