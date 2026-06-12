import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function RegisterConsumer() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error } = await signUp(form.email, form.password, 'consumer', form.name)
    if (error) { setError(error.message); setLoading(false); return }

    if (data.user) {
      await supabase.from('consumers').insert({
        user_id: data.user.id,
        name: form.name,
        phone: form.phone,
        email: form.email,
      })
    }
    setLoading(false)
    navigate('/app/send')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <a href="/" style={{ textDecoration:'none' }}><div style={styles.logo}>MOVANTIA</div></a>
        <h1 style={styles.title}>Crear cuenta</h1>
        <p style={{ color:'#9AA3B5', fontSize:'13px', marginBottom:'20px' }}>Para enviar cosas con Movantia</p>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {[
            { label:'Nombre completo', field:'name', placeholder:'Tu nombre' },
            { label:'Email', field:'email', type:'email', placeholder:'tu@email.com' },
            { label:'Contraseña', field:'password', type:'password', placeholder:'Mínimo 6 caracteres' },
            { label:'Teléfono', field:'phone', type:'tel', placeholder:'+598 9X XXX XXX' },
          ].map(({ label, field, ...rest }) => (
            <div key={field}>
              <label style={styles.label}>{label}</label>
              <input style={styles.input} value={form[field]} onChange={e => set(field, e.target.value)} required={field !== 'phone'} {...rest} />
            </div>
          ))}
          {error && <p style={{ color:'#ef4444', fontSize:'13px', margin:0 }}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#9AA3B5' }}>
          ¿Ya tenés cuenta? <Link to="/app/auth/login" style={{ color:'#D4A843', textDecoration:'none', fontWeight:600 }}>Iniciá sesión</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#07090F', padding:'20px' },
  card: { background:'#0D1018', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'36px 32px', width:'100%', maxWidth:'400px' },
  logo: { fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:'20px', color:'#D4A843', marginBottom:'20px', textAlign:'center', letterSpacing:'2px' },
  title: { fontFamily:'Space Grotesk, sans-serif', fontSize:'22px', fontWeight:700, color:'#E8EDF5', marginBottom:'4px' },
  label: { display:'block', fontSize:'13px', color:'#9AA3B5', marginBottom:'6px' },
  input: { width:'100%', background:'#07090F', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'12px', color:'#E8EDF5', fontSize:'15px', outline:'none', boxSizing:'border-box' },
  btn: { background:'#D4A843', color:'#07090F', border:'none', borderRadius:'8px', padding:'13px', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' },
}
