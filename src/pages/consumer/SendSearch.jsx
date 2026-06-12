import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PackagePicker from '../../components/app/PackagePicker'
import { BUSINESS_RULES, formatPrice } from '../../lib/constants'

export default function SendSearch() {
  const navigate = useNavigate()
  const [pickupAddress, setPickupAddress] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [packageCategory, setPackageCategory] = useState('')
  const [packageM3, setPackageM3] = useState(null)
  const [fragile, setFragile] = useState(false)

  const price = packageM3 ? packageM3 * BUSINESS_RULES.PRICE_PER_M3_DEFAULT : null

  function handlePackageChange(category, m3) {
    setPackageCategory(category)
    setPackageM3(m3)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!packageM3) return
    navigate('/app/send/options', {
      state: { pickupAddress, deliveryAddress, packageCategory, packageM3, fragile, price }
    })
  }

  return (
    <div style={{ padding:'20px', maxWidth:'560px', margin:'0 auto' }}>
      <h1 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:'22px', fontWeight:800, color:'#E8EDF5', marginBottom:'6px', lineHeight:1.2 }}>
        ¿Qué necesitás enviar<br />y adónde?
      </h1>
      <p style={{ color:'#9AA3B5', fontSize:'14px', marginBottom:'28px' }}>
        Buscamos un camión que ya va para ese lado
      </p>

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
        <div>
          <label style={styles.label}>¿Desde dónde lo retiramos?</label>
          <input style={styles.input} value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} required placeholder="Ej: Pocitos, Montevideo" />
        </div>

        <div>
          <label style={styles.label}>¿Dónde tiene que llegar?</label>
          <input style={styles.input} value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} required placeholder="Ej: Ciudad Vieja, Montevideo" />
        </div>

        <div>
          <label style={styles.label}>¿Qué vas a enviar?</label>
          <PackagePicker value={packageCategory} onChange={handlePackageChange} />
        </div>

        {packageM3 && (
          <div style={{ background:'rgba(212,168,67,0.08)', border:'1px solid rgba(212,168,67,0.3)', borderRadius:'12px', padding:'16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <p style={{ fontSize:'13px', color:'#9AA3B5', marginBottom:'2px' }}>Volumen estimado</p>
              <p style={{ fontSize:'18px', fontWeight:700, color:'#E8EDF5', fontFamily:'Space Grotesk' }}>{packageM3} m³</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontSize:'13px', color:'#9AA3B5', marginBottom:'2px' }}>Precio estimado</p>
              <p style={{ fontSize:'22px', fontWeight:800, color:'#D4A843', fontFamily:'Space Grotesk' }}>{formatPrice(price)}</p>
            </div>
          </div>
        )}

        <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', fontSize:'14px', color:'#E8EDF5' }}>
          <input type="checkbox" checked={fragile} onChange={e => setFragile(e.target.checked)} style={{ accentColor:'#D4A843', width:'16px', height:'16px' }} />
          Es frágil (requiere cuidado especial)
        </label>

        <button type="submit" disabled={!packageM3} style={{ ...styles.btn, opacity: packageM3 ? 1 : 0.5 }}>
          Ver vueltas disponibles <ArrowRight size={18} />
        </button>
      </form>

      <div style={{ marginTop:'24px', padding:'16px', background:'#0D1018', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize:'12px', color:'#9AA3B5', lineHeight:1.5 }}>
          ℹ️ El transportista <strong style={{ color:'#E8EDF5' }}>no cambia su ruta</strong> por vos. Aprovechás su viaje ya programado. Tenés que estar listo en la ventana horaria indicada.
        </p>
      </div>
    </div>
  )
}

const styles = {
  label: { display:'block', fontSize:'13px', color:'#9AA3B5', marginBottom:'8px', fontWeight:500 },
  input: { width:'100%', background:'#0D1018', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'13px', color:'#E8EDF5', fontSize:'15px', outline:'none', boxSizing:'border-box' },
  btn: { display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', background:'#D4A843', color:'#07090F', border:'none', borderRadius:'10px', padding:'15px', fontSize:'16px', fontWeight:700, cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' },
}
