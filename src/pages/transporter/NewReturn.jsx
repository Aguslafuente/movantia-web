import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { CheckCircle2 } from 'lucide-react'

export default function NewReturn() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [company, setCompany] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({
    vehicle_id: '',
    origin_address: '',
    destination_address: '',
    return_address: '',
    estimated_return_time: '',
    available_m3: '',
    restrictions: { fragile: false, refrigerated: false, liquids: false, animals: false },
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: co } = await supabase.from('companies').select('*').eq('user_id', user.id).single()
      setCompany(co)
      if (co) {
        const { data: v } = await supabase.from('vehicles').select('*').eq('company_id', co.id).eq('active', true)
        setVehicles(v || [])
        if (v?.length) setForm(f => ({ ...f, vehicle_id: v[0].id, available_m3: v[0].capacity_m3 }))
      }
    }
    load()
  }, [user.id])

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }
  function setRestriction(key, val) { setForm(f => ({ ...f, restrictions: { ...f.restrictions, [key]: val } })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!company) return
    setLoading(true)
    const selectedVehicle = vehicles.find(v => v.id === form.vehicle_id)
    const { error } = await supabase.from('empty_returns').insert({
      company_id: company.id,
      vehicle_id: form.vehicle_id || null,
      origin_address: form.origin_address,
      destination_address: form.destination_address,
      return_address: form.return_address || form.origin_address,
      estimated_return_time: form.estimated_return_time,
      available_m3: parseFloat(form.available_m3),
      restrictions: form.restrictions,
    })
    setLoading(false)
    if (!error) setSuccess(true)
  }

  if (success) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', padding:'32px', textAlign:'center' }}>
      <CheckCircle2 size={56} color="#00D68F" style={{ marginBottom:'16px' }} />
      <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:'22px', fontWeight:700, color:'#E8EDF5', marginBottom:'8px' }}>
        ¡Vuelta activada!
      </h2>
      <p style={{ color:'#9AA3B5', marginBottom:'28px', maxWidth:'320px' }}>
        Tu vuelta está activa. Si hay un match, te avisamos por notificación.
      </p>
      <button onClick={() => navigate('/app/transporter')} style={styles.btn}>Volver al inicio</button>
    </div>
  )

  return (
    <div style={{ padding:'20px', maxWidth:'560px', margin:'0 auto' }}>
      <h1 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:'20px', fontWeight:700, color:'#E8EDF5', marginBottom:'6px' }}>
        Activar vuelta vacía
      </h1>
      <p style={{ color:'#9AA3B5', fontSize:'13px', marginBottom:'24px' }}>
        Completá los datos de tu próximo viaje
      </p>

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
        {/* Vehicle */}
        {vehicles.length > 0 && (
          <Field label="Vehículo">
            <select value={form.vehicle_id} onChange={e => {
              const v = vehicles.find(x => x.id === e.target.value)
              setForm(f => ({ ...f, vehicle_id: e.target.value, available_m3: v?.capacity_m3 || f.available_m3 }))
            }} style={styles.input}>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.type} — {v.capacity_m3} m³ {v.plate ? `(${v.plate})` : ''}</option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Punto de salida (tu base)">
          <input style={styles.input} value={form.origin_address} onChange={e => set('origin_address', e.target.value)} required placeholder="Ej: Pocitos, Montevideo" />
        </Field>

        <Field label="Destino de entrega">
          <input style={styles.input} value={form.destination_address} onChange={e => set('destination_address', e.target.value)} required placeholder="Ej: Malvín Norte, Montevideo" />
        </Field>

        <Field label="Dirección de vuelta (dónde terminás el viaje)">
          <input style={styles.input} value={form.return_address} onChange={e => set('return_address', e.target.value)} placeholder="Dejalo vacío si volvés al mismo punto de salida" />
        </Field>

        <Field label="Hora estimada de vuelta">
          <input style={styles.input} type="datetime-local" value={form.estimated_return_time} onChange={e => set('estimated_return_time', e.target.value)} required />
        </Field>

        <Field label={`Espacio libre disponible (m³)`}>
          <input style={styles.input} type="number" step="0.1" min="0.1" value={form.available_m3} onChange={e => set('available_m3', e.target.value)} required placeholder="Ej: 2.5" />
          <p style={{ fontSize:'12px', color:'#9AA3B5', marginTop:'4px' }}>Estimado: ¿cuánto del vehículo va a quedar libre?</p>
        </Field>

        {/* Restrictions */}
        <Field label="Restricciones">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            {[
              { key:'fragile', label:'❌ No acepto frágil sin embalar' },
              { key:'refrigerated', label:'✅ Tengo refrigeración' },
              { key:'liquids', label:'❌ No acepto líquidos' },
              { key:'animals', label:'❌ No acepto animales' },
            ].map(({ key, label }) => (
              <label key={key} style={{ display:'flex', alignItems:'center', gap:'8px', background:'#07090F', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'10px', cursor:'pointer', fontSize:'12px', color:'#E8EDF5' }}>
                <input type="checkbox" checked={form.restrictions[key]} onChange={e => setRestriction(key, e.target.checked)} style={{ accentColor:'#D4A843' }} />
                {label}
              </label>
            ))}
          </div>
        </Field>

        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Publicando...' : '🚀 Publicar vuelta'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:'13px', color:'#9AA3B5', marginBottom:'6px', fontWeight:500 }}>{label}</label>
      {children}
    </div>
  )
}

const styles = {
  input: { width:'100%', background:'#0D1018', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'12px', color:'#E8EDF5', fontSize:'15px', outline:'none', boxSizing:'border-box' },
  btn: { background:'#D4A843', color:'#07090F', border:'none', borderRadius:'10px', padding:'15px', fontSize:'16px', fontWeight:700, cursor:'pointer', fontFamily:'Space Grotesk, sans-serif', width:'100%' },
}
