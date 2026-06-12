import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import {
  BOOKING_STATUS_LABELS, TRIP_STATUS_LABELS,
  PACKAGE_CATEGORIES, formatPrice, generatePin,
} from '../../lib/constants'
import StatusBadge from '../../components/shared/StatusBadge'
import Timeline from '../../components/shared/Timeline'
import { ArrowLeft, CheckCircle, AlertTriangle, Play } from 'lucide-react'

export default function TripDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [pinModal, setPinModal] = useState(null) // { bookingId, action: 'pickup'|'delivery' }
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')
  const [incidentModal, setIncidentModal] = useState(null)
  const [incidentForm, setIncidentForm] = useState({ type: 'damage', description: '' })
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => { loadTrip() }, [id])

  async function loadTrip() {
    const { data: t } = await supabase
      .from('empty_returns')
      .select('*, vehicles(name, plate, type), companies(name)')
      .eq('id', id)
      .single()
    if (!t) { navigate('/app/transporter'); return }
    setTrip(t)

    const { data: b } = await supabase
      .from('bookings')
      .select('*, consumers(name, phone)')
      .eq('empty_return_id', id)
      .neq('status', 'cancelled')
      .order('created_at')
    setBookings(b || [])
    setLoading(false)
  }

  // ── Start trip ──
  async function startTrip() {
    setActionLoading(true)
    await supabase.from('empty_returns').update({ status: 'in_progress' }).eq('id', id)
    setTrip(p => ({ ...p, status: 'in_progress' }))
    setActionLoading(false)
  }

  // ── PIN confirm ──
  async function openPinModal(bookingId, action) {
    setPinModal({ bookingId, action })
    setPinInput('')
    setPinError('')
  }

  async function confirmPin() {
    const b = bookings.find(b => b.id === pinModal.bookingId)
    const expectedPin = pinModal.action === 'pickup' ? b.pickup_pin : b.delivery_pin
    if (pinInput !== expectedPin) {
      setPinError('PIN incorrecto. Pedíselo al cliente.')
      return
    }
    setActionLoading(true)
    const newStatus = pinModal.action === 'pickup' ? 'picked_up' : 'delivered'
    await supabase.from('bookings').update({ status: newStatus }).eq('id', pinModal.bookingId)
    setBookings(prev => prev.map(b => b.id === pinModal.bookingId ? { ...b, status: newStatus } : b))

    // if delivery → release payment (update payment status)
    if (pinModal.action === 'delivery') {
      await supabase.from('payments')
        .update({ status: 'released', released_at: new Date().toISOString() })
        .eq('booking_id', pinModal.bookingId)
    }

    // check if all delivered → complete trip
    const updatedBookings = bookings.map(b => b.id === pinModal.bookingId ? { ...b, status: newStatus } : b)
    const allDone = updatedBookings.every(b => ['delivered', 'cancelled'].includes(b.status))
    if (allDone && updatedBookings.length > 0) {
      await supabase.from('empty_returns').update({ status: 'completed' }).eq('id', id)
      setTrip(p => ({ ...p, status: 'completed' }))
    }

    setActionLoading(false)
    setPinModal(null)
  }

  // ── Report incident ──
  async function submitIncident() {
    if (!incidentForm.description.trim()) return
    setActionLoading(true)
    await supabase.from('incidents').insert({
      booking_id: incidentModal,
      type: incidentForm.type,
      description: incidentForm.description,
      reported_by: 'transporter',
      status: 'open',
    })
    await supabase.from('bookings').update({ status: 'disputed' }).eq('id', incidentModal)
    setBookings(prev => prev.map(b => b.id === incidentModal ? { ...b, status: 'disputed' } : b))
    setActionLoading(false)
    setIncidentModal(null)
    setIncidentForm({ type: 'damage', description: '' })
  }

  if (loading) return <Loader />
  if (!trip) return null

  const activeBookings = bookings.filter(b => !['cancelled', 'delivered', 'disputed'].includes(b.status))
  const isActive = ['active', 'partially_reserved', 'in_progress'].includes(trip.status)

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <button onClick={() => navigate(-1)} style={backBtn}>
        <ArrowLeft size={16} /> Volver
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '12px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 700, color: '#E8EDF5', margin: '0 0 4px' }}>
            Vuelta vacía
          </h1>
          <p style={{ fontSize: '13px', color: '#9AA3B5', margin: 0 }}>
            {trip.origin_address} → {trip.destination_address}
          </p>
        </div>
        <StatusBadge status={trip.status} labels={TRIP_STATUS_LABELS} />
      </div>

      {/* Trip info */}
      <div style={infoCard}>
        <Row label="Vehículo" value={trip.vehicles?.name || trip.vehicles?.plate || '—'} />
        <Row label="Empresa" value={trip.companies?.name || '—'} />
        <Row label="Espacio total" value={`${trip.available_m3} m³`} />
        <Row label="Espacio usado" value={`${trip.used_m3 || 0} m³`} />
        {trip.departure_time && (
          <Row label="Salida" value={new Date(trip.departure_time).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' })} />
        )}
      </div>

      {/* Start trip button */}
      {['active', 'partially_reserved'].includes(trip.status) && bookings.length > 0 && (
        <button onClick={startTrip} disabled={actionLoading} style={startBtn}>
          <Play size={16} /> Iniciar viaje
        </button>
      )}

      {/* Bookings */}
      <h2 style={sectionTitle}>Reservas ({bookings.length})</h2>

      {bookings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px', color: '#9AA3B5', fontSize: '13px' }}>
          No hay reservas en esta vuelta
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {bookings.map(b => (
          <div key={b.id} style={bookingCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <p style={{ fontWeight: 600, color: '#E8EDF5', fontSize: '14px', marginBottom: '2px' }}>
                  {b.consumers?.name || 'Consumidor'}
                </p>
                <p style={{ fontSize: '12px', color: '#9AA3B5' }}>
                  {b.consumers?.phone || '—'}
                </p>
              </div>
              <StatusBadge status={b.status} labels={BOOKING_STATUS_LABELS} />
            </div>

            <p style={{ fontSize: '12px', color: '#9AA3B5', marginBottom: '4px' }}>
              📦 {b.pickup_address} → {b.delivery_address}
            </p>
            <p style={{ fontSize: '12px', color: '#9AA3B5', marginBottom: '10px' }}>
              {PACKAGE_CATEGORIES.find(c => c.value === b.package_category)?.label || b.package_category} · {b.package_m3} m³ · {formatPrice(b.price_total)}
              {b.package_needs_help && ' · ⚠️ Necesita ayuda'}
            </p>

            {/* Timeline */}
            <Timeline status={b.status} />

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {trip.status === 'in_progress' && b.status === 'confirmed' && (
                <button onClick={() => openPinModal(b.id, 'pickup')} style={actionBtn}>
                  <CheckCircle size={14} /> Confirmar retiro (PIN)
                </button>
              )}
              {trip.status === 'in_progress' && b.status === 'picked_up' && (
                <button onClick={() => openPinModal(b.id, 'delivery')} style={{ ...actionBtn, background: 'rgba(0,214,143,0.1)', border: '1px solid #00D68F', color: '#00D68F' }}>
                  <CheckCircle size={14} /> Confirmar entrega (PIN)
                </button>
              )}
              {isActive && !['disputed', 'delivered', 'cancelled'].includes(b.status) && (
                <button onClick={() => setIncidentModal(b.id)} style={incidentBtn}>
                  <AlertTriangle size={14} /> Reportar incidencia
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PIN Modal */}
      {pinModal && (
        <Modal onClose={() => setPinModal(null)}>
          <h3 style={{ fontFamily: 'Space Grotesk', color: '#E8EDF5', marginBottom: '8px', fontSize: '16px' }}>
            {pinModal.action === 'pickup' ? '🔑 PIN de retiro' : '🔑 PIN de entrega'}
          </h3>
          <p style={{ fontSize: '13px', color: '#9AA3B5', marginBottom: '16px' }}>
            Pedile al cliente el PIN de {pinModal.action === 'pickup' ? '4 dígitos' : 'entrega'} y escribilo acá.
          </p>
          <input
            value={pinInput}
            onChange={e => { setPinInput(e.target.value); setPinError('') }}
            placeholder="0000"
            maxLength={4}
            style={{ ...inp, fontSize: '24px', textAlign: 'center', letterSpacing: '8px', marginBottom: '8px' }}
          />
          {pinError && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px' }}>{pinError}</p>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={confirmPin} disabled={pinInput.length !== 4 || actionLoading} style={saveBtn}>
              {actionLoading ? 'Verificando...' : 'Confirmar'}
            </button>
            <button onClick={() => setPinModal(null)} style={cancelBtn}>Cancelar</button>
          </div>
        </Modal>
      )}

      {/* Incident Modal */}
      {incidentModal && (
        <Modal onClose={() => setIncidentModal(null)}>
          <h3 style={{ fontFamily: 'Space Grotesk', color: '#E8EDF5', marginBottom: '8px', fontSize: '16px' }}>
            ⚠️ Reportar incidencia
          </h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={lbl}>Tipo</label>
            <select value={incidentForm.type} onChange={e => setIncidentForm(p => ({ ...p, type: e.target.value }))} style={inp}>
              <option value="damage">Daño en el paquete</option>
              <option value="not_present">Cliente no presente</option>
              <option value="address_wrong">Dirección incorrecta</option>
              <option value="access_issue">Problema de acceso</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Descripción *</label>
            <textarea
              value={incidentForm.description}
              onChange={e => setIncidentForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
              placeholder="Describí lo que pasó..."
              style={{ ...inp, resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={submitIncident} disabled={!incidentForm.description || actionLoading} style={saveBtn}>
              {actionLoading ? 'Enviando...' : 'Enviar reporte'}
            </button>
            <button onClick={() => setIncidentModal(null)} style={cancelBtn}>Cancelar</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ fontSize: '12px', color: '#9AA3B5' }}>{label}</span>
      <span style={{ fontSize: '13px', color: '#E8EDF5', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: '#0D1018', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '360px' }}>
        {children}
      </div>
    </div>
  )
}

function Loader() { return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#D4A843' }}>Cargando...</div> }

const backBtn = { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#9AA3B5', cursor: 'pointer', fontSize: '13px', padding: 0 }
const infoCard = { background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }
const bookingCard = { background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }
const sectionTitle = { fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: 700, color: '#E8EDF5', margin: '20px 0 10px' }
const startBtn = { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', background: '#D4A843', color: '#07090F', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', justifyContent: 'center', fontFamily: 'Space Grotesk', marginBottom: '8px' }
const actionBtn = { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212,168,67,0.1)', border: '1px solid #D4A843', color: '#D4A843', borderRadius: '8px', padding: '7px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }
const incidentBtn = { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(249,115,22,0.1)', border: '1px solid #f97316', color: '#f97316', borderRadius: '8px', padding: '7px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }
const lbl = { display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }
const inp = { width: '100%', background: '#07090F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 12px', color: '#E8EDF5', fontSize: '13px', boxSizing: 'border-box' }
const saveBtn = { background: '#D4A843', color: '#07090F', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: '14px' }
const cancelBtn = { background: 'none', color: '#9AA3B5', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontSize: '14px' }
