// ─────────────────────────────────────────────
// BUSINESS RULES
// ─────────────────────────────────────────────
export const BUSINESS_RULES = {
  PRICE_PER_M3: 2000,
  MIN_ORDER_PRICE: 600,
  PLATFORM_COMMISSION: 0.12,
  MAX_DETOUR_KM: 1.0,
  MAX_WAIT_MINUTES: 3,
}

// ─────────────────────────────────────────────
// VOLUME & PRICE LOGIC
// ─────────────────────────────────────────────
export function calculateVolumeCm(heightCm, widthCm, depthCm) {
  return (heightCm * widthCm * depthCm) / 1_000_000
}

export function calculatePrice(volumeM3) {
  const raw = volumeM3 * BUSINESS_RULES.PRICE_PER_M3
  return Math.max(raw, BUSINESS_RULES.MIN_ORDER_PRICE)
}

export function calculatePlatformFee(total) {
  return parseFloat((total * BUSINESS_RULES.PLATFORM_COMMISSION).toFixed(2))
}

export function calculateCarrierPayout(total) {
  return parseFloat((total * (1 - BUSINESS_RULES.PLATFORM_COMMISSION)).toFixed(2))
}

export function getPriceBreakdown(volumeM3) {
  const total = calculatePrice(volumeM3)
  const fee = calculatePlatformFee(total)
  const payout = calculateCarrierPayout(total)
  return { total, fee, payout, pricePerM3: BUSINESS_RULES.PRICE_PER_M3, volumeM3 }
}

export function formatPrice(amount) {
  if (amount == null) return '$0'
  const n = Math.round(Number(amount))
  return `$${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}

export function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000))
}

// ─────────────────────────────────────────────
// ZONES
// ─────────────────────────────────────────────
export const ZONES = [
  { value: 'centro',        label: 'Centro' },
  { value: 'cordon',        label: 'Cordón' },
  { value: 'pocitos',       label: 'Pocitos' },
  { value: 'punta_carretas', label: 'Punta Carretas' },
  { value: 'carrasco',      label: 'Carrasco' },
  { value: 'buceo',         label: 'Buceo' },
  { value: 'malvin',        label: 'Malvín' },
  { value: 'zonaamerica',   label: 'Zonamérica' },
  { value: 'ciudad_vieja',  label: 'Ciudad Vieja' },
  { value: 'tres_cruces',   label: 'Tres Cruces' },
  { value: 'aguada',        label: 'Aguada' },
  { value: 'parque_batlle', label: 'Parque Batlle' },
]

export const ZONE_MAP = Object.fromEntries(ZONES.map(z => [z.value, z.label]))

// ─────────────────────────────────────────────
// MATCHING LOGIC
// ─────────────────────────────────────────────
export function isZoneCompatible(tripZones, shipmentZones) {
  const { origin_zone, destination_zone, intermediate_zones = [] } = tripZones
  const { pickup_zone, dropoff_zone } = shipmentZones
  const intermediates = Array.isArray(intermediate_zones)
    ? intermediate_zones
    : (typeof intermediate_zones === 'string' ? JSON.parse(intermediate_zones) : [])
  const allZones = [origin_zone, destination_zone, ...intermediates].map(z => z?.toLowerCase()).filter(Boolean)
  if (!pickup_zone || !dropoff_zone) return true
  return allZones.includes(pickup_zone.toLowerCase()) && allZones.includes(dropoff_zone.toLowerCase())
}

export function canTripAcceptShipment(trip, shipment) {
  if (!['active', 'partially_reserved'].includes(trip.status)) return false
  const available = (trip.available_m3 || 0) - (trip.used_m3 || 0)
  if (available < (shipment.package_m3 || 0)) return false
  if (shipment.pickup_zone && shipment.dropoff_zone) {
    if (!isZoneCompatible(trip, shipment)) return false
  }
  return true
}

export function rankCompatibleTrips(trips, shipment) {
  return [...trips]
    .filter(t => canTripAcceptShipment(t, shipment))
    .sort((a, b) => {
      const aAvail = (a.available_m3 || 0) - (a.used_m3 || 0)
      const bAvail = (b.available_m3 || 0) - (b.used_m3 || 0)
      if (bAvail !== aAvail) return bAvail - aAvail
      return new Date(a.departure_time || a.estimated_return_time) - new Date(b.departure_time || b.estimated_return_time)
    })
}

// ─────────────────────────────────────────────
// PACKAGE CATEGORIES
// ─────────────────────────────────────────────
export const PACKAGE_CATEGORIES = [
  { value: 'caja',           label: 'Caja',             icon: '📦', example: 'Libros, ropa', m3: 0.05 },
  { value: 'mueble_chico',   label: 'Mueble chico',     icon: '🪑', example: 'Silla, mesa ratona', m3: 0.3 },
  { value: 'electrodomestico', label: 'Electrodoméstico', icon: '📺', example: 'Microondas, TV', m3: 0.08 },
  { value: 'valija',         label: 'Valija',           icon: '🧳', example: 'Equipaje de viaje', m3: 0.1 },
  { value: 'bicicleta',      label: 'Bicicleta',        icon: '🚲', example: 'Bici de ruta o MTB', m3: 0.5 },
  { value: 'herramienta',    label: 'Herramienta',      icon: '🔧', example: 'Taladro, compresor', m3: 0.04 },
  { value: 'compra_tienda',  label: 'Compra de tienda', icon: '🛍️', example: 'Shopping, feria', m3: 0.2 },
  { value: 'otro',           label: 'Otro',             icon: '📫', example: 'Personalizado', m3: null },
]

// ─────────────────────────────────────────────
// VEHICLE TYPES
// ─────────────────────────────────────────────
export const VEHICLE_TYPES = [
  { value: 'fiorino',        label: 'Fiorino',       m3: 1.5,  icon: '🚐' },
  { value: 'van_chica',      label: 'Van chica',     m3: 4.0,  icon: '🚐' },
  { value: 'camioneta',      label: 'Camioneta',     m3: 6.0,  icon: '🚚' },
  { value: 'camion_pequeno', label: 'Camión chico',  m3: 12.0, icon: '🚛' },
  { value: 'camion_grande',  label: 'Camión grande', m3: 30.0, icon: '🚛' },
  { value: 'otro',           label: 'Otro',          m3: null, icon: '🚗' },
]

// ─────────────────────────────────────────────
// STATUS LABELS
// ─────────────────────────────────────────────
export const BOOKING_STATUS_LABELS = {
  pending_payment:  { label: 'Pago pendiente',         color: '#f0a500', bg: 'rgba(240,165,0,0.1)' },
  confirmed:        { label: 'Confirmado',              color: '#00D68F', bg: 'rgba(0,214,143,0.1)' },
  picked_up:        { label: 'Retirado',                color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  in_transit:       { label: 'En tránsito',             color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  delivered:        { label: 'Entregado',               color: '#00D68F', bg: 'rgba(0,214,143,0.08)' },
  cancelled:        { label: 'Cancelado',               color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  disputed:         { label: 'En disputa',              color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
}

export const TRIP_STATUS_LABELS = {
  draft:               { label: 'Borrador',             color: '#9AA3B5', bg: 'rgba(154,163,181,0.1)' },
  active:              { label: 'Disponible',           color: '#00D68F', bg: 'rgba(0,214,143,0.1)' },
  partially_reserved:  { label: 'Parcialmente reservada', color: '#f0a500', bg: 'rgba(240,165,0,0.1)' },
  full:                { label: 'Completa',             color: '#D4A843', bg: 'rgba(212,168,67,0.1)' },
  in_progress:         { label: 'En curso',             color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  completed:           { label: 'Finalizada',           color: '#9AA3B5', bg: 'rgba(154,163,181,0.1)' },
  cancelled:           { label: 'Cancelada',            color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  incident:            { label: 'Con incidencia',       color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
}

export const INCIDENT_STATUS_LABELS = {
  open:      { label: 'Abierta',   color: '#f97316' },
  reviewing: { label: 'Revisando', color: '#f0a500' },
  resolved:  { label: 'Resuelta',  color: '#00D68F' },
  closed:    { label: 'Cerrada',   color: '#9AA3B5' },
}

// ─────────────────────────────────────────────
// PROHIBITED ITEMS
// ─────────────────────────────────────────────
export const PROHIBITED_ITEMS = [
  'Inflamables o explosivos', 'Armas de cualquier tipo',
  'Sustancias químicas peligrosas', 'Animales vivos',
  'Alimentos perecederos', 'Dinero en efectivo o joyas',
  'Drogas o medicamentos regulados', 'Objetos ilegales',
  'Personas', 'Residuos o desechos', 'Líquidos mal embalados',
]

// ─────────────────────────────────────────────
// HAVERSINE DISTANCE (km)
// ─────────────────────────────────────────────
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
