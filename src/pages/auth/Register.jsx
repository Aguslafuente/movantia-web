import { Link } from 'react-router-dom'
import { Truck, Package } from 'lucide-react'

export default function Register() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <a href="/" style={{ textDecoration:'none' }}>
          <div style={styles.logo}>MOVANTIA</div>
        </a>
        <h1 style={styles.title}>¿Quién sos?</h1>
        <p style={{ color:'#9AA3B5', textAlign:'center', marginBottom:'28px', fontSize:'14px' }}>
          Elegí tu tipo de cuenta para continuar
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <Link to="/app/auth/register/company" style={styles.optionCard}>
            <div style={styles.optionIcon}><Truck size={28} color="#D4A843" /></div>
            <div>
              <div style={styles.optionTitle}>Soy transportista</div>
              <div style={styles.optionDesc}>Tengo vehículos y quiero monetizar mis vueltas vacías</div>
            </div>
          </Link>
          <Link to="/app/auth/register/consumer" style={styles.optionCard}>
            <div style={styles.optionIcon}><Package size={28} color="#00D68F" /></div>
            <div>
              <div style={styles.optionTitle}>Quiero enviar algo</div>
              <div style={styles.optionDesc}>Necesito mandar un objeto sin pagar un flete completo</div>
            </div>
          </Link>
        </div>
        <p style={{ textAlign:'center', marginTop:'24px', fontSize:'14px', color:'#9AA3B5' }}>
          ¿Ya tenés cuenta? <Link to="/app/auth/login" style={{ color:'#D4A843', textDecoration:'none', fontWeight:600 }}>Iniciá sesión</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#07090F', padding:'20px' },
  card: { background:'#0D1018', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'36px 32px', width:'100%', maxWidth:'420px' },
  logo: { fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:'20px', color:'#D4A843', marginBottom:'24px', textAlign:'center', letterSpacing:'2px' },
  title: { fontFamily:'Space Grotesk, sans-serif', fontSize:'22px', fontWeight:700, color:'#E8EDF5', marginBottom:'8px', textAlign:'center' },
  optionCard: { display:'flex', alignItems:'center', gap:'16px', background:'#07090F', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:'12px', padding:'18px', textDecoration:'none', transition:'border-color .15s', cursor:'pointer' },
  optionIcon: { width:'52px', height:'52px', borderRadius:'10px', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  optionTitle: { fontSize:'16px', fontWeight:700, color:'#E8EDF5', marginBottom:'4px', fontFamily:'Space Grotesk, sans-serif' },
  optionDesc: { fontSize:'13px', color:'#9AA3B5' },
}
