import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const { signIn, profile } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { setError(error.message); return }
    // Redirect based on role (profile loads async via context)
    setTimeout(() => {
      const role = profile?.role
      if (role === 'transporter') navigate('/app/transporter')
      else navigate('/app/send')
    }, 300)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <a href="/" style={{ textDecoration:'none' }}>
          <div style={styles.logo}>MOVANTIA</div>
        </a>
        <h1 style={styles.title}>Iniciar sesión</h1>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com" />
          </div>
          <div>
            <label style={styles.label}>Contraseña</label>
            <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          {error && <p style={{ color:'#ef4444', fontSize:'13px', margin:0 }}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#9AA3B5' }}>
          ¿No tenés cuenta? <Link to="/app/auth/register" style={{ color:'#D4A843', textDecoration:'none', fontWeight:600 }}>Registrate</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#07090F', padding:'20px' },
  card: { background:'#0D1018', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'36px 32px', width:'100%', maxWidth:'400px' },
  logo: { fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:'20px', color:'#D4A843', marginBottom:'24px', textAlign:'center', letterSpacing:'2px' },
  title: { fontFamily:'Space Grotesk, sans-serif', fontSize:'22px', fontWeight:700, color:'#E8EDF5', marginBottom:'24px', textAlign:'center' },
  label: { display:'block', fontSize:'13px', color:'#9AA3B5', marginBottom:'6px' },
  input: { width:'100%', background:'#07090F', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'12px', color:'#E8EDF5', fontSize:'15px', outline:'none', boxSizing:'border-box' },
  btn: { background:'#D4A843', color:'#07090F', border:'none', borderRadius:'8px', padding:'13px', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:'Space Grotesk, sans-serif' },
}
