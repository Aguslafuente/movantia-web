import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { ZONES } from '../../lib/constants'
import { Route, Plus, Trash2, Zap } from 'lucide-react'

export default function FrequentRoutes() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [routes, setRoutes] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [company, setCompany] = useState(null)

  useEffect(() => { init() }, [user.id])

  async function init() {
    const { data: c } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
    if (!c) { setLoading(false); return }
    setCompany(c)
    const [{ data: r }, { data: v }] = await Promise.all([
      supabase.from('frequent_routes').select('*').eq('company_id', c.id).order('created_at'),
      supabase.from('vehicles').select('id, name, plate, type, sellable_m3, capacity_m3').eq('company_id', c.id),
    ])
    setRoutes(r || [])
    setVehicles(v || [])
    setLoading(false)
  }

  async function deleteRoute(id) {
    if (!confirm('¿Eliminar esta ruta?')) return
    await supabase.from('frequent_routes').delete().eq('id', id)
    setRoutes(prev => prev.filter(r => r.id !== id))
  }

  async function activateTrip(route) {
    // Pre-fill new empty_return from this route and navigate to publish flow
    navigate('/app/transporter/publish', { state: { fromRoute: route } })
  }

  if (loading) return <Loader />

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={title}>Rutas frecuentes</h1>
        <button onClick={() => setShowForm(true)} style={addBtn}>
          <Plus size={16} /> Nueva ruta
        </button>
      </div>

      {showForm && (
        <RouteForm
          company={company}
          vehicles={vehicles}
          onSave={r => { setRoutes(prev => [...prev, r]); setShowForm(false) }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {routes.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9AA3B5' }}>
          <Route size={40} style={{ opacity: 0.3, marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
          <p>Todavía no tenés rutas frecuentes</p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>Guardá tus rutas habituales para publicar vueltas más rápido.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {routes.map(r => (
          <div key={r.id} style={card}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, color: '#E8EDF5', marginBottom: '4px', fontSize: '14px' }}>
                {r.name}
              </p>
              <p style={{ fontSize: '12px', color: '#9AA3B5', marginBottom: '2px' }}>
                📍 {zoneLbl(r.origin_zone)} → {zoneLbl(r.destination_zone)}
              </p>
              {r.intermediate_zones?.length > 0 && (
                <p style={{ fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }}>
                  Vía: {(typeof r.intermediate_zones === 'string'
                    ? JSON.parse(r.intermediate_zones)
                    : r.intermediate_zones
                  ).map(z => zoneLbl(z)).join(', ')}
                </p>
              )}
              {(r.default_departure_time || r.default_arrival_time) && (
                <p style={{ fontSize: '11px', color: '#9AA3B5' }}>
                  🕐 {r.default_departure_time?.slice(0, 5)} → {r.default_arrival_time?.slice(0, 5)}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
              <button onClick={() => activateTrip(r)} style={activateBtn}>
                <Zap size={13} /> Activar vuelta
              </button>
              <button onClick={() => deleteRoute(r.id)} style={deleteBtn}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RouteForm({ company, vehicles, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    origin_zone: '',
    destination_zone: '',
    intermediate_zones: [],
    origin_address: '',
    destination_address: '',
    default_departure_time: '',
    default_arrival_time: '',
    default_vehicle_id: '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  function toggleIntermediate(zone) {
    setForm(p => ({
      ...p,
      intermediate_zones: p.intermediate_zones.includes(zone)
        ? p.intermediate_zones.filter(z => z !== zone)
        : [...p.intermediate_zones, zone]
    }))
  }

  async function handleSave() {
    if (!form.name || !form.origin_zone || !form.destination_zone) {
      setErr('Nombre, zona origen y zona destino son obligatorias')
      return
    }
    setSaving(true)
    const payload = { ...form, company_id: company.id, intermediate_zones: form.intermediate_zones }
    const { data } = await supabase.from('frequent_routes').insert(payload).select().single()
    setSaving(false)
    if (data) onSave(data)
    else setErr('Error guardando la ruta')
  }

  return (
    <div style={{ background: '#0D1018', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
      <h3 style={{ fontFamily: 'Space Grotesk', color: '#E8EDF5', marginBottom: '16px' }}>Nueva ruta frecuente</h3>
      {err && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '10px' }}>{err}</p>}

      <div style={{ marginBottom: '12px' }}>
        <label style={lbl}>Nombre de la ruta *</label>
        <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej: Pocitos → Centro mañanas" style={inp} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={lbl}>Zona origen *</label>
          <select value={form.origin_zone} onChange={e => set('origin_zone', e.target.value)} style={inp}>
            <option value="">Seleccionar</option>
            {ZONES.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Zona destino *</label>
          <select value={form.destination_zone} onChange={e => set('destination_zone', e.target.value)} style={inp}>
            <option value="">Seleccionar</option>
            {ZONES.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Dirección origen</label>
          <input value={form.origin_address} onChange={e => set('origin_address', e.target.value)} placeholder="Ej: Av. Italia 3000" style={inp} />
        </div>
        <div>
          <label style={lbl}>Dirección destino</label>
          <input value={form.destination_address} onChange={e => set('destination_address', e.target.value)} placeholder="Ej: Ciudad Vieja 18 de Julio" style={inp} />
        </div>
        <div>
          <label style={lbl}>Hora salida habitual</label>
          <input type="time" value={form.default_departure_time} onChange={e => set('default_departure_time', e.target.value)} style={inp} />
        </div>
        <div>
          <label style={lbl}>Hora llegada habitual</label>
          <input type="time" value={form.default_arrival_time} onChange={e => set('default_arrival_time', e.target.value)} style={inp} />
        </div>
      </div>

      {vehicles.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <label style={lbl}>Vehículo por defecto</label>
          <select value={form.default_vehicle_id} onChange={e => set('default_vehicle_id', e.target.value)} style={inp}>
            <option value="">Sin asignar</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.name || v.plate}</option>)}
          </select>
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={lbl}>Zonas intermedias (opcional)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
          {ZONES.filter(z => z.value !== form.origin_zone && z.value !== form.destination_zone).map(z => (
            <button key={z.value} onClick={() => toggleIntermediate(z.value)} style={{
              background: form.intermediate_zones.includes(z.value) ? 'rgba(212,168,67,0.15)' : 'transparent',
              border: `1px solid ${form.intermediate_zones.includes(z.value) ? '#D4A843' : 'rgba(255,255,255,0.1)'}`,
              color: form.intermediate_zones.includes(z.value) ? '#D4A843' : '#9AA3B5',
              borderRadius: '20px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer',
            }}>{z.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleSave} disabled={saving} style={saveBtn}>{saving ? 'Guardando...' : 'Guardar ruta'}</button>
        <button onClick={onCancel} style={cancelBtn}>Cancelar</button>
      </div>
    </div>
  )
}

function zoneLbl(val) {
  return ZONES.find(z => z.value === val)?.label || val || '—'
}

function Loader() { return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#D4A843' }}>Cargando...</div> }

const title = { fontFamily: 'Space Grotesk', fontSize: '20px', fontWeight: 700, color: '#E8EDF5', margin: 0 }
const card = { display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }
const addBtn = { display: 'flex', alignItems: 'center', gap: '6px', background: '#D4A843', color: '#07090F', border: 'none', borderRadius: '8px', padding: '9px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk' }
const activateBtn = { display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,214,143,0.1)', border: '1px solid #00D68F', color: '#00D68F', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }
const deleteBtn = { background: 'none', border: 'none', color: '#9AA3B5', cursor: 'pointer', padding: '4px' }
const lbl = { display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }
const inp = { width: '100%', background: '#07090F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 12px', color: '#E8EDF5', fontSize: '13px', boxSizing: 'border-box' }
const saveBtn = { background: '#D4A843', color: '#07090F', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: '14px' }
const cancelBtn = { background: 'none', color: '#9AA3B5', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontSize: '14px' }
