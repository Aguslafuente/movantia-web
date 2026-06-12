import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('companies').select('*, vehicles(id)').order('created_at', { ascending: false })
      .then(({ data }) => { setCompanies(data || []); setLoading(false) })
  }, [])

  if (loading) return <Loader />

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={title}>Empresas</h1>
      <p style={{ color: '#9AA3B5', fontSize: '13px', marginBottom: '20px' }}>{companies.length} empresas registradas</p>

      {companies.length === 0 && <Empty text="No hay empresas aún" />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {companies.map(c => (
          <div key={c.id} style={card}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, color: '#E8EDF5', marginBottom: '3px' }}>{c.name}</p>
              <p style={{ fontSize: '12px', color: '#9AA3B5' }}>{c.email || '—'} · {c.phone || '—'}</p>
              <p style={{ fontSize: '12px', color: '#9AA3B5', marginTop: '2px' }}>RUT: {c.rut || '—'}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <StatusDot verified={c.verified} />
              <p style={{ fontSize: '12px', color: '#9AA3B5', marginTop: '6px' }}>
                ⭐ {c.rating?.toFixed(1) || '5.0'} · {c.vehicles?.length || 0} vehículos
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusDot({ verified }) {
  return (
    <span style={{
      background: verified ? 'rgba(0,214,143,0.1)' : 'rgba(240,165,0,0.1)',
      color: verified ? '#00D68F' : '#f0a500',
      border: `1px solid ${verified ? '#00D68F' : '#f0a500'}40`,
      borderRadius: '20px', padding: '2px 8px', fontSize: '11px', fontWeight: 600,
    }}>
      {verified ? '✓ Verificada' : '⏳ Pendiente'}
    </span>
  )
}

function Loader() {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#D4A843' }}>Cargando...</div>
}

function Empty({ text }) {
  return <div style={{ textAlign: 'center', padding: '48px', color: '#9AA3B5' }}>{text}</div>
}

const title = { fontFamily: 'Space Grotesk', fontSize: '20px', fontWeight: 700, color: '#E8EDF5', marginBottom: '4px' }
const card = { display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }
