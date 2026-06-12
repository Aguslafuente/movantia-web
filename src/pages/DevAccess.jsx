import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function DevAccess() {
  const { devLogin } = useAuth()
  const navigate = useNavigate()

  function enter(role) {
    devLogin(role)
    if (role === 'transporter') navigate('/app/transporter')
    else if (role === 'consumer') navigate('/app/send')
    else if (role === 'admin') navigate('/admin')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07090F',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Space Grotesk, sans-serif',
      gap: '24px',
      padding: '20px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <p style={{ color: 'rgba(212,168,67,0.6)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', marginBottom: '8px' }}>
          DEV · TEST ACCESS
        </p>
        <h1 style={{ color: '#E8EDF5', fontSize: '24px', fontWeight: 700, margin: 0 }}>
          Movantia — Acceso de prueba
        </h1>
        <p style={{ color: '#9AA3B5', fontSize: '13px', marginTop: '8px' }}>
          Elegí un perfil para explorar la app sin iniciar sesión
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px' }}>
        <DevButton
          emoji="🚚"
          label="Transportista"
          sub="Dashboard, vueltas, vehículos, rutas"
          color="#D4A843"
          onClick={() => enter('transporter')}
        />
        <DevButton
          emoji="📦"
          label="Consumidor"
          sub="Buscar, reservar, seguimiento"
          color="#00D68F"
          onClick={() => enter('consumer')}
        />
        <DevButton
          emoji="🛡️"
          label="Admin"
          sub="Panel de control, empresas, métricas"
          color="#a78bfa"
          onClick={() => enter('admin')}
        />
      </div>

      <p style={{ color: '#4B5563', fontSize: '11px', marginTop: '8px' }}>
        No requiere Supabase · Solo para desarrollo
      </p>
    </div>
  )
}

function DevButton({ emoji, label, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#0D1018',
        border: `1px solid ${color}40`,
        borderRadius: '14px',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.15s',
        width: '100%',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color}
      onMouseLeave={e => e.currentTarget.style.borderColor = `${color}40`}
    >
      <span style={{ fontSize: '28px' }}>{emoji}</span>
      <div>
        <p style={{ color: '#E8EDF5', fontWeight: 700, fontSize: '15px', margin: 0 }}>{label}</p>
        <p style={{ color: '#9AA3B5', fontSize: '12px', margin: '2px 0 0' }}>{sub}</p>
      </div>
      <span style={{ marginLeft: 'auto', color, fontSize: '18px' }}>→</span>
    </button>
  )
}
