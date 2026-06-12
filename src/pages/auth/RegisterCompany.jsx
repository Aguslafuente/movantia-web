import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { VEHICLE_TYPES } from '../../lib/constants'

export default function RegisterCompany() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', rut:'' })
  const [vehicle, setVehicle] = useState({ type:'camioneta', capacity_m3:'', plate:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  async function handleStep1(e) {
    e.preventDefault()
    setStep(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error } = await signUp(form.email, form.password, 'transporter', form.name)
    if (error) { setError(error.message); setLoading(false); return }

    // Create company
    const { data: company } = await supabase.from('companies').insert({
      user_id: data.user.id,
      name: form.name,
      phone: form.phone,
      rut: form.rut,
    }).select().single()

    // Create first vehicle
    if (company && vehicle.capacity_m3) {
      await supabase.from('vehicles').insert({
        company_id: company.id,
        type: vehicle.type,
        capacity_m3: parseFloat(vehicle.capacity_m3),
        plate: vehicle.plate,
      })
    }
    setLoading(false)
    navigate('/app/transporter')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <a href="/" style={{ textDecoration:'none' }}><div style={styles.logo}>MOVANTIA</div></a>
        <div style={{ display:'flex', gap:'8px', marginBottom:'24px' }}>
          {[1,2].map(n => (
            <div key={n} style={{ flex:1, height:'3px', borderRadius:'2px', background: n <= step ? '#D4A843' : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
        <h1 style={styles.title}>{step === 1 ? 'Tu empresa' : 'Tu vehículo'}</h1>

        {step === 1 && (
          <form onSubmit={handleStep1} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <Field label="Nombre de la empresa" value={form.name} onChange={v => set('name', v)} required />
            <Field label="Email" type="email" value={form.email} onChange={v => set('email', v)} required />
            <Field label="Contraseña" type="password" value={form.password} onChange={v => set('password', v)} required placeholder="Mínimo 6 caracteres" />
            <Field label="Teléfono" type="tel" value={form.phone} onChange={v => set('phone', v)} placeholder="+598 9X XXX XXX" />
            <Field label="RUT (opcional)" value={form.rut} onChange={v => set('rut', v)} />
            <button type="submit" style={styles.btn}>Siguiente →</button>
            <p style={{ textAlign:'center', fontSize:'14px', color:'#9AA3B5' }}>
              ¿Ya tenés cuenta? <Link to="/app/auth/login" style={{ color:'#D4A843', textDecoration:'none' }}>Ingresá</Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <label style={styles.label}>Tipo de vehículo</label>
              <select
                value={vehicle.type}
                onChange={e => setVehicle(v => ({ ...v, type: e.target.value }))}
                style={styles.input}
              >
                {Object.entries(VEHICLE_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label} (≈{v.capacity} m³)</option>
                ))}
              </select>
            </div>
            <Field label="Capacidad total en m³" type="number" value={vehicle.capacity_m3} onChange={v => setVehicle(x => ({ ...x, capacity_m3: v }))} required placeholder="Ej: 4.5" />
            <Field label="Patente (opcional)" value={vehicle.plate} onChange={v => setVehicle(x => ({ ...x, plate: v }))} placeholder="ABC 1234" />
            {error && <p style={{ color:'#ef4444', fontSize:'13px', margin:0 }}>{error}</p>}
            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ ...styles.btn, background:'transparent', color:'#9AA3B5', border:'1px solid rgba(255,255,255,0.1)' }}>
              ← Volver
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:'13px', color:'#9AA3B5', marginBottom:'6px' }}>{label}</label>
      <input
        {...props}
        onChange={e => props.onChange(e.target.value)}
        style={{ width:'100%', background:'#07090F', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'12px', color:'#E8EDF5', fontSize:'15px', outline:'none', boxSizing:'border-box' }}
      />
    </div>
  )
}

const styles = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#07090F', padding:'20px' },
  card: { background:'#0D1018', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'36px 32px', width:'100%', maxWidth:'420px' },
  logo: { fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:'20px', color:'#D4A843', marginBottom:'20px', textAlign:'center', letterSpacing:'2px' },
  title: { fontFamily:'Space Grotesk, sans-serif', fontSize:'22px', fontWeight:700, color:'#E8EDF5', marginBottom:'20px' },
  label: { display:'block', fontSize:'13px', color:'#9AA3B5', marginBottom:'6px' },
  input: { width:'100%', background:'#07090F', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'12px', color:'#E8EDF5', fontSize:'15px', outline:'none', boxSizing:'border-box' },
  btn: { background:'#D4A843', color:'#07090F', border:'none', borderRadius:'8px', padding:'13px', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' },
}
