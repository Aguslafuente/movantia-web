import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { generatePin, formatPrice, BUSINESS_RULES, PACKAGE_CATEGORIES } from '../../lib/constants'
import { CheckCircle2, Shield, Clock } from 'lucide-react'

export default function BookingConfirm() {
  const { id } = useParams()
  const { state } = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(null) // { bookingId, pickupPin, deliveryPin }

  if (!state) { navigate('/app/send'); return null }

  const { returnData, packageCategory, packageM3, price: rawPrice, pickupAddress, deliveryAddress, fragile } = state
  const price = (rawPrice && !isNaN(rawPrice)) ? rawPrice : Math.max(packageM3 * BUSINESS_RULES.PRICE_PER_M3, BUSINESS_RULES.MIN_ORDER_PRICE)
  const platformFee = price * BUSINESS_RULES.PLATFORM_COMMISSION
  const transporterAmount = price - platformFee
  const categoryLabel = PACKAGE_CATEGORIES.find(c => c.value === packageCategory)?.label || packageCategory || 'Paquete personalizado'

  async function handleConfirm() {
    setLoading(true)
    let { data: consumer } = await supabase.from('consumers').select('id').eq('user_id', user.id).single()
    // Dev mode fallback: use first available consumer
    if (!consumer) {
      const { data: fallback } = await supabase.from('consumers').select('id').limit(1).single()
      consumer = fallback
    }
    const pickupPin = generatePin()
    const deliveryPin = generatePin()
    const { data: booking, error } = await supabase.from('bookings').insert({
      empty_return_id: id,
      consumer_id: consumer?.id,
      package_category: packageCategory,
      package_m3: packageM3,
      package_fragile: fragile,
      pickup_address: pickupAddress,
      delivery_address: deliveryAddress,
      price_total: price,
      platform_fee: platformFee,
      transporter_amount: transporterAmount,
      pickup_pin: pickupPin,
      delivery_pin: deliveryPin,
      status: 'confirmed',
      payment_status: 'mock_paid',
      estimated_pickup_time: returnData.estimated_return_time,
    }).select().single()

    if (!error) {
      // Update used_m3 on the empty_return
      await supabase.from('empty_returns').update({
        used_m3: (returnData.used_m3 || 0) + packageM3
      }).eq('id', id)
      setDone({ bookingId: booking.id, pickupPin, deliveryPin })
    }
    setLoading(false)
  }

  if (done) return (
    <div style={{ padding:'24px', maxWidth:'480px', margin:'0 auto', textAlign:'center' }}>
      <CheckCircle2 size={56} color="#00D68F" style={{ marginBottom:'16px' }} />
      <h2 style={{ fontFamily:'Space Grotesk', fontSize:'22px', fontWeight:700, color:'#E8EDF5', marginBottom:'8px' }}>
        ¡Reserva confirmada!
      </h2>
      <p style={{ color:'#9AA3B5', marginBottom:'28px' }}>
        El transportista recogerá tu paquete en la ventana horaria indicada.
      </p>

      <div style={{ background:'#0D1018', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'20px', marginBottom:'20px', textAlign:'left' }}>
        <p style={{ fontSize:'13px', color:'#9AA3B5', marginBottom:'12px', fontWeight:600 }}>TUS PINES SECRETOS</p>
        <div style={{ display:'flex', gap:'12px' }}>
          <PinBox label="PIN de retiro" pin={done.pickupPin} desc="Mostráselo al transportista cuando venga a retirar" />
          <PinBox label="PIN de entrega" pin={done.deliveryPin} desc="Para el destinatario, al recibir el paquete" />
        </div>
      </div>

      <div style={{ background:'rgba(0,214,143,0.06)', border:'1px solid rgba(0,214,143,0.2)', borderRadius:'10px', padding:'14px', marginBottom:'20px', fontSize:'13px', color:'#9AA3B5', textAlign:'left' }}>
        <Shield size={16} color="#00D68F" style={{ marginBottom:'6px' }} />
        <p>Pagaste con tarjeta y el dinero queda <strong style={{ color:'#00D68F' }}>protegido</strong>. Solo se libera al transportista cuando el destinatario confirme que recibió todo bien. Si algo falla, abrís una disputa y el monto se retiene.</p>
      </div>

      <button onClick={() => navigate(`/app/send/tracking/${done.bookingId}`)} style={styles.btn}>
        Ver seguimiento
      </button>
    </div>
  )

  return (
    <div style={{ padding:'20px', maxWidth:'560px', margin:'0 auto' }}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Volver</button>
      <h1 style={styles.pageTitle}>Confirmá tu reserva</h1>

      {/* Summary */}
      <div style={styles.summaryCard}>
        <Row label="Paquete" value={categoryLabel} />
        <Row label="Volumen" value={`${packageM3} m³`} />
        <Row label="Retiro" value={pickupAddress} />
        <Row label="Entrega" value={deliveryAddress} />
        <Row label="Empresa" value={returnData?.companies?.name || 'Transportista verificado'} />
        <Row label="Hora estimada" value={new Date(returnData?.estimated_return_time).toLocaleString('es-UY', { dateStyle:'short', timeStyle:'short' })} />
        {fragile && <Row label="Frágil" value="Sí — requerís embalaje protegido" />}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', marginTop:'12px', paddingTop:'12px' }}>
          <Row label="Precio total" value={<span style={{ color:'#D4A843', fontWeight:700, fontSize:'18px' }}>{formatPrice(price)}</span>} />
        </div>
      </div>

      <div style={{ background:'rgba(240,165,0,0.06)', border:'1px solid rgba(240,165,0,0.2)', borderRadius:'10px', padding:'14px', marginBottom:'20px', fontSize:'13px', color:'#9AA3B5' }}>
        <Clock size={15} style={{ marginBottom:'4px', color:'#f0a500' }} />
        <p><strong style={{ color:'#E8EDF5' }}>Importante:</strong> El transportista no cambia su ruta por vos. Tenés que estar listo en la ventana horaria indicada. Si no estás, perdés la reserva sin reembolso.</p>
      </div>

      {/* Card payment info */}
      <div style={{ background:'rgba(212,168,67,0.04)', border:'1px solid rgba(212,168,67,0.18)', borderRadius:'12px', padding:'18px', marginBottom:'16px', fontSize:'13px', color:'#9AA3B5' }}>
        <p style={{ marginBottom:'10px', fontWeight:700, color:'#E8EDF5', fontSize:'14px' }}>💳 Pago con tarjeta de crédito o débito</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'8px', lineHeight:1.6 }}>
          <p style={{ margin:0 }}>
            🔒 <strong style={{ color:'#D4A843' }}>El dinero no va directo al transportista.</strong> Al pagar con tarjeta, el monto queda retenido en la plataforma hasta que vos confirmés que recibiste todo bien.
          </p>
          <p style={{ margin:0 }}>
            ✅ <strong style={{ color:'#E8EDF5' }}>¿Llegó todo en orden?</strong> Confirmás la entrega desde la app y el pago se libera automáticamente al transportista.
          </p>
          <p style={{ margin:0 }}>
            ⚠️ <strong style={{ color:'#E8EDF5' }}>¿Algo salió mal?</strong> Reportás un problema y el monto queda retenido mientras se resuelve la disputa. No perdés la plata.
          </p>
        </div>
      </div>
      <button onClick={handleConfirm} disabled={loading} style={styles.btn}>
        {loading ? 'Procesando...' : `💳 Pagar con tarjeta ${formatPrice(price)}`}
      </button>
      <p style={{ textAlign:'center', fontSize:'12px', color:'#9AA3B5', marginTop:'10px' }}>
        🔒 Pago protegido · el dinero se libera solo cuando confirmás la entrega
      </p>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'16px', marginBottom:'10px' }}>
      <span style={{ fontSize:'13px', color:'#9AA3B5', flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:'13px', color:'#E8EDF5', textAlign:'right' }}>{value}</span>
    </div>
  )
}

function PinBox({ label, pin, desc }) {
  return (
    <div style={{ flex:1, background:'#07090F', borderRadius:'8px', padding:'12px' }}>
      <p style={{ fontSize:'11px', color:'#9AA3B5', marginBottom:'6px' }}>{label}</p>
      <p style={{ fontFamily:'Space Grotesk', fontSize:'28px', fontWeight:800, color:'#D4A843', letterSpacing:'4px', marginBottom:'6px' }}>{pin}</p>
      <p style={{ fontSize:'11px', color:'#9AA3B5' }}>{desc}</p>
    </div>
  )
}

const styles = {
  backBtn: { background:'none', border:'none', color:'#9AA3B5', fontSize:'14px', cursor:'pointer', padding:'0 0 16px', display:'block' },
  pageTitle: { fontFamily:'Space Grotesk', fontSize:'20px', fontWeight:700, color:'#E8EDF5', marginBottom:'20px' },
  summaryCard: { background:'#0D1018', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'18px', marginBottom:'16px' },
  btn: { width:'100%', background:'#D4A843', color:'#07090F', border:'none', borderRadius:'10px', padding:'15px', fontSize:'16px', fontWeight:700, cursor:'pointer', fontFamily:'Space Grotesk' },
}
