import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { INCIDENT_STATUS_LABELS } from '../../lib/constants'
import StatusBadge from '../../components/shared/StatusBadge'

export default function AdminIncidents() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('incidents')
      .select('*, bookings(pickup_address, delivery_address, consumers(name), empty_returns(companies(name)))')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setIncidents(data || []); setLoading(false) })
  }, [])

  async function updateStatus(id, status) {
    await supabase.from('incidents').update({ status }).eq('id', id)
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  if (loading) return <Loader />

  const openCount = incidents.filter(i => i.status === 'open').length

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={title}>Incidencias</h1>
      {openCount > 0 && (
        <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '16px', color: '#f97316', fontSize: '13px' }}>
          ⚠️ {openCount} incidencia{openCount > 1 ? 's' : ''} abierta{openCount > 1 ? 's' : ''} requiere{openCount > 1 ? 'n' : ''} atención
        </div>
      )}

      {incidents.length === 0 && <Empty text="No hay incidencias" />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {incidents.map(inc => {
          const b = inc.bookings
          return (
            <div key={inc.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, color: '#E8EDF5', fontSize: '14px' }}>
                  {inc.type?.replace(/_/g, ' ') || 'Incidencia'}
                </span>
                <StatusBadge status={inc.status} labels={INCIDENT_STATUS_LABELS} />
              </div>
              <p style={{ fontSize: '13px', color: '#E8EDF5', marginBottom: '6px' }}>{inc.description}</p>
              {b && (
                <p style={{ fontSize: '12px', color: '#9AA3B5', marginBottom: '8px' }}>
                  Reserva: {b.pickup_address} → {b.delivery_address}
                  {b.consumers?.name ? ` · ${b.consumers.name}` : ''}
                  {b.empty_returns?.companies?.name ? ` · ${b.empty_returns.companies.name}` : ''}
                </p>
              )}
              <p style={{ fontSize: '11px', color: '#9AA3B5', marginBottom: '10px' }}>
                Reportado por: {inc.reported_by} · {new Date(inc.created_at).toLocaleDateString('es-UY')}
              </p>
              {inc.status === 'open' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => updateStatus(inc.id, 'reviewing')} style={btnYellow}>Tomar caso</button>
                  <button onClick={() => updateStatus(inc.id, 'resolved')} style={btnGreen}>Resolver</button>
                </div>
              )}
              {inc.status === 'reviewing' && (
                <button onClick={() => updateStatus(inc.id, 'resolved')} style={btnGreen}>Marcar resuelta</button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Loader() { return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#D4A843' }}>Cargando...</div> }
function Empty({ text }) { return <div style={{ textAlign: 'center', padding: '48px', color: '#9AA3B5' }}>{text}</div> }

const title = { fontFamily: 'Space Grotesk', fontSize: '20px', fontWeight: 700, color: '#E8EDF5', marginBottom: '16px' }
const card = { background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }
const btnYellow = { background: 'rgba(240,165,0,0.1)', border: '1px solid #f0a500', color: '#f0a500', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }
const btnGreen = { background: 'rgba(0,214,143,0.1)', border: '1px solid #00D68F', color: '#00D68F', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }
