import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AuthGuard({ children, requiredRole }) {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#07090F', color:'#D4A843', fontFamily:'Space Grotesk, sans-serif' }}>
      Cargando...
    </div>
  )

  if (!user) return <Navigate to="/app/auth/login" replace />

  if (requiredRole && profile?.role !== requiredRole) {
    if (profile?.role === 'transporter') return <Navigate to="/app/transporter" replace />
    if (profile?.role === 'consumer') return <Navigate to="/app/send" replace />
    return <Navigate to="/app/auth/login" replace />
  }

  return children
}
