export const BUSINESS_RULES = {
  MAX_DETOUR_KM: 0.8,
  MAX_WAIT_MINUTES: 3,
  PLATFORM_COMMISSION: 0.10,
  PRICE_PER_M3_DEFAULT: 50,
  PICKUP_WINDOW_MINUTES: 10,
  CANCELLATION_FREE_HOURS: 2,
  CANCELLATION_PENALTY_PERCENT: 0.30,
  AUTO_ACCEPT_BOOKINGS: true,
  MIN_PACKAGE_M3: 0.01,
  MAX_PACKAGE_M3: 10,
}

export const PACKAGE_CATEGORIES = [
  { id: 'box_small',   label: 'Caja pequeña',         icon: '📦', m3: 0.04,  example: 'Libros, ropa, zapatos' },
  { id: 'box_large',   label: 'Caja grande',           icon: '📦', m3: 0.18,  example: 'Electrodoméstico chico, ropa de cama' },
  { id: 'furniture_s', label: 'Mueble chico',          icon: '🪑', m3: 0.45,  example: 'Silla, mesita de luz, cajón' },
  { id: 'furniture_l', label: 'Mueble grande',         icon: '🛋️', m3: 1.8,   example: 'Heladera, sofá, escritorio' },
  { id: 'bike',        label: 'Bicicleta / deporte',   icon: '🚲', m3: 0.6,   example: 'Bici desarmada, tabla de surf, kayak' },
  { id: 'appliance',   label: 'Electrodoméstico',      icon: '🖥️', m3: 0.3,   example: 'TV, lavarropas, microondas' },
  { id: 'custom',      label: 'Medir yo mismo',        icon: '📐', m3: null,  example: 'Ingresá largo × ancho × alto' },
]

export const VEHICLE_TYPES = {
  camioneta: { label: 'Camioneta', capacity: 3 },
  camion_pequeno: { label: 'Camión pequeño', capacity: 10 },
  camion_grande: { label: 'Camión grande', capacity: 30 },
}

export const BOOKING_STATUS_LABELS = {
  pending_payment: { label: 'Pendiente de pago', color: '#f0a500' },
  confirmed: { label: 'Confirmado', color: '#a78bfa' },
  picked_up: { label: 'Retirado', color: '#38bdf8' },
  in_transit: { label: 'En tránsito', color: '#38bdf8' },
  delivered: { label: 'Entregado', color: '#00D68F' },
  cancelled: { label: 'Cancelado', color: '#ef4444' },
  disputed: { label: 'En disputa', color: '#f97316' },
}

// Haversine distance in km
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

// Generate 4-digit PIN
export function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000))
}

// Format price
export function formatPrice(usd) {
  return `USD ${Number(usd).toFixed(0)}`
}
