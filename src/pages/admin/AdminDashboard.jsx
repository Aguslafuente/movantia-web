import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/constants'
import MetricCard from '../../components/shared/MetricCard'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [companies, trips, bookings, incidents, payments] = await Promise.all([
        supabase.from('companies').select('id, status', { count: 'exact' }),
        supabase.from('empty_returns').select('id, status, available_m3, used_m3', { count: 'exact' }),
        supabase.from('bookings').select('id, status, price_total, platform_fee, transporter_amount', { count: 'exact' }),
        supabase.from('incidents').select('id, status', { count: 'exact' }),
        supabase.from('payments').select('amount_total, platform_fee, carrier_payout, status'),
      ])

      const allTrips = trips.data || []
      const allBookings = bookings.data || []
      const allPayments = payments.data || []

      const totalM3Available = allTrips.reduce((s, t) => s + (t.available_m3 || 0), 0)
      const totalM3Used = allTrips.reduce((s, t) => s + (t.used_m3 || 0), 0)
      const tripsMonetized = allTrips.filter(t => (t.used_m3 || 0) > 0).length

      const grossRevenue = allPayments.reduce((s, p) => s + (p.amount_total || 0), 0)
      const platformRevenue = allPayments.reduce((s, p) => s + (p.platform_fee || 0), 0)
      const carrierRevenue = allPayments.reduce((s, p) => s + (p.carrier_payout || 0), 0)

      const cancelledBookings = allBookings.filter(b => b.status === 'cancelled').length
      const cancelRate = allBookings.length ? ((cancelledBookings / allBookings.length) * 100).toFixed(1) : 0
      const incidentCount = (incidents.data || []).filter(i => i.status === 'open').length

      setStats({
        companies: companies.count || 0,
        tripsTotal: trips.count || 0,
        tripsMonetized,
        tripsActive: allTrips.filter(t => ['active', 'partially_reserved'].includes(t.status)).length,
        totalM3Available: totalM3Available.toFixed(1),
        totalM3Used: totalM3Used.toFixed(1),
        bookingsTotal: bookings.count || 0,
        bookingsDelivered: allBookings.filter(b => b.status === 'delivered').length,
        grossRevenue, platformRevenue, carrierRevenue,
        cancelRate, incidentCount,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Loader />

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={title}>Panel Administrador</h1>

      {/* KPIs Row 1 */}
      <div style={grid}>
        <MetricCard label="Empresas registradas" value={stats.companies} icon="🏢" />
        <MetricCard label="Vueltas publicadas" value={stats.tripsTotal} icon="🚚" />
        <MetricCard label="Vueltas monetizadas" value={stats.tripsMonetized} icon="💰" accent color="#D4A843" />
        <MetricCard label="Vueltas activas" value={stats.tripsActive} icon="✅" />
      </div>

      {/* Revenue */}
      <h2 style={sectionTitle}>Ingresos</h2>
      <div style={grid}>
        <MetricCard label="Ingreso bruto" value={formatPrice(stats.grossRevenue)} icon="💵" accent color="#D4A843" />
        <MetricCard label="Comisión plataforma" value={formatPrice(stats.platformRevenue)} icon="🏦" accent color="#a78bfa" />
        <MetricCard label="Pago transportistas" value={formatPrice(stats.carrierRevenue)} icon="🚛" accent color="#00D68F" />
      </div>

      {/* Logistics */}
      <h2 style={sectionTitle}>Logística</h2>
      <div style={grid}>
        <MetricCard label="m³ disponibles (total)" value={`${stats.totalM3Available} m³`} icon="📦" />
        <MetricCard label="m³ vendidos (total)" value={`${stats.totalM3Used} m³`} icon="📤" accent color="#00D68F" />
        <MetricCard label="Reservas totales" value={stats.bookingsTotal} icon="📋" />
        <MetricCard label="Entregas completadas" value={stats.bookingsDelivered} icon="🏁" />
      </div>

      {/* Operations */}
      <h2 style={sectionTitle}>Operaciones</h2>
      <div style={grid}>
        <MetricCard label="Tasa cancelación" value={`${stats.cancelRate}%`} icon="❌" accent={stats.cancelRate > 10} color="#ef4444" />
        <MetricCard label="Incidencias abiertas" value={stats.incidentCount} icon="⚠️" accent={stats.incidentCount > 0} color="#f97316" />
      </div>

      {/* Quick nav */}
      <h2 style={sectionTitle}>Accesos rápidos</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {[
          ['/admin/companies', '🏢 Empresas'],
          ['/admin/trips', '🚚 Vueltas'],
          ['/admin/bookings', '📋 Reservas'],
          ['/admin/incidents', '⚠️ Incidencias'],
        ].map(([to, label]) => (
          <Link key={to} to={to} style={navBtn}>{label}</Link>
        ))}
      </div>
    </div>
  )
}

function Loader() {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#D4A843' }}>Cargando...</div>
}

const title = { fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: 700, color: '#E8EDF5', marginBottom: '20px' }
const sectionTitle = { fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 600, color: '#9AA3B5', margin: '20px 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }
const navBtn = { background: '#0D1018', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: '#E8EDF5', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }
