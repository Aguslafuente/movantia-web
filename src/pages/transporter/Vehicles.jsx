import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { VEHICLE_TYPES } from '../../lib/constants'
import { Truck, Plus, Trash2, Edit2 } from 'lucide-react'

export default function Vehicles() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => { loadVehicles() }, [user.id])

  async function loadVehicles() {
    let { data: company } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
    // Dev mode fallback: use first available company
    if (!company) {
      const { data: fallback } = await supabase.from('companies').select('id').limit(1).single()
      company = fallback
    }
    if (!company) { setLoading(false); return }
    const { data } = await supabase.from('vehicles').select('*').eq('company_id', company.id).order('created_at')
    setVehicles(data || [])
    setLoading(false)
  }

  async function deleteVehicle(id) {
    if (!confirm('¿Eliminar este vehículo?')) return
    await supabase.from('vehicles').delete().eq('id', id)
    setVehicles(prev => prev.filter(v => v.id !== id))
  }

  if (loading) return <Loader />

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={title}>Vehículos</h1>
        <button onClick={() => { setEditing(null); setShowForm(true) }} style={addBtn}>
          <Plus size={16} /> Agregar
        </button>
      </div>

      {showForm && (
        <VehicleForm
          initial={editing}
          userId={user.id}
          onSave={v => { setVehicles(prev => editing ? prev.map(x => x.id === v.id ? v : x) : [...prev, v]); setShowForm(false); setEditing(null) }}
          onCancel={() => { setShowForm(false); setEditing(null) }}
        />
      )}

      {vehicles.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9AA3B5' }}>
          <Truck size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p>Todavía no tenés vehículos</p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>Agregá uno para empezar a publicar vueltas.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {vehicles.map(v => {
          const typeInfo = VEHICLE_TYPES.find(t => t.value === v.type) || { label: v.type, icon: '🚗' }
          return (
            <div key={v.id} style={card}>
              <span style={{ fontSize: '28px' }}>{typeInfo.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: '#E8EDF5', marginBottom: '3px' }}>
                  {v.name || typeInfo.label} · {v.plate}
                </p>
                <p style={{ fontSize: '12px', color: '#9AA3B5' }}>
                  {typeInfo.label} · {v.capacity_m3} m³ total · {v.sellable_m3 || v.capacity_m3} m³ vendibles
                </p>
                {v.max_weight_kg && (
                  <p style={{ fontSize: '11px', color: '#9AA3B5', marginTop: '2px' }}>
                    Hasta {v.max_weight_kg} kg
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setEditing(v); setShowForm(true) }} style={iconBtn}>
                  <Edit2 size={15} />
                </button>
                <button onClick={() => deleteVehicle(v.id)} style={{ ...iconBtn, color: '#ef4444' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function VehicleForm({ initial, userId, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    plate: initial?.plate || '',
    type: initial?.type || 'camioneta',
    capacity_m3: initial?.capacity_m3 || '',
    sellable_m3: initial?.sellable_m3 || '',
    max_weight_kg: initial?.max_weight_kg || '',
    max_height_cm: initial?.max_height_cm || '',
    max_width_cm: initial?.max_width_cm || '',
    max_length_cm: initial?.max_length_cm || '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSave() {
    if (!form.plate || !form.capacity_m3) { setErr('Matrícula y capacidad son obligatorias'); return }
    setSaving(true)
    let { data: company } = await supabase.from('companies').select('id').eq('user_id', userId).single()
    if (!company) {
      const { data: fallback } = await supabase.from('companies').select('id').limit(1).single()
      company = fallback
    }
    const payload = { ...form, company_id: company.id, capacity_m3: +form.capacity_m3, sellable_m3: form.sellable_m3 ? +form.sellable_m3 : +form.capacity_m3, max_weight_kg: +form.max_weight_kg || null }
    let result
    if (initial) {
      const { data } = await supabase.from('vehicles').update(payload).eq('id', initial.id).select().single()
      result = data
    } else {
      const { data } = await supabase.from('vehicles').insert(payload).select().single()
      result = data
    }
    setSaving(false)
    if (result) onSave(result)
  }

  return (
    <div style={{ background: '#0D1018', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
      <h3 style={{ fontFamily: 'Space Grotesk', color: '#E8EDF5', marginBottom: '16px' }}>
        {initial ? 'Editar vehículo' : 'Nuevo vehículo'}
      </h3>
      {err && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '10px' }}>{err}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Nombre interno" value={form.name} onChange={v => set('name', v)} placeholder="Van blanca" />
        <Field label="Matrícula *" value={form.plate} onChange={v => set('plate', v)} placeholder="ABC 1234" />
        <div>
          <label style={lbl}>Tipo *</label>
          <select value={form.type} onChange={e => set('type', e.target.value)} style={inp}>
            {VEHICLE_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
          </select>
        </div>
        <Field label="Capacidad total m³ *" type="number" value={form.capacity_m3} onChange={v => set('capacity_m3', v)} placeholder="4.0" />
        <Field label="m³ vendibles sugeridos" type="number" value={form.sellable_m3} onChange={v => set('sellable_m3', v)} placeholder="2.0" />
        <Field label="Peso máx. kg" type="number" value={form.max_weight_kg} onChange={v => set('max_weight_kg', v)} placeholder="800" />
        <Field label="Alto máx. cm" type="number" value={form.max_height_cm} onChange={v => set('max_height_cm', v)} placeholder="150" />
        <Field label="Ancho máx. cm" type="number" value={form.max_width_cm} onChange={v => set('max_width_cm', v)} placeholder="160" />
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button onClick={handleSave} disabled={saving} style={saveBtn}>{saving ? 'Guardando...' : 'Guardar'}</button>
        <button onClick={onCancel} style={cancelBtn}>Cancelar</button>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inp} />
    </div>
  )
}

function Loader() { return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#D4A843' }}>Cargando...</div> }

const title = { fontFamily: 'Space Grotesk', fontSize: '20px', fontWeight: 700, color: '#E8EDF5', margin: 0 }
const card = { display: 'flex', alignItems: 'center', gap: '14px', background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }
const addBtn = { display: 'flex', alignItems: 'center', gap: '6px', background: '#D4A843', color: '#07090F', border: 'none', borderRadius: '8px', padding: '9px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk' }
const iconBtn = { background: 'none', border: 'none', color: '#9AA3B5', cursor: 'pointer', padding: '6px' }
const lbl = { display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }
const inp = { width: '100%', background: '#07090F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 12px', color: '#E8EDF5', fontSize: '13px', boxSizing: 'border-box' }
const saveBtn = { background: '#D4A843', color: '#07090F', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: '14px' }
const cancelBtn = { background: 'none', color: '#9AA3B5', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontSize: '14px' }
