import { formatPrice, BUSINESS_RULES } from '../../lib/constants'

export default function PriceBreakdown({ total, fee, payout, volumeM3, compact = false }) {
  if (compact) return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <span style={chip('#D4A843')}>Total: <b>{formatPrice(total)}</b></span>
      <span style={chip('#9AA3B5')}>Plataforma: {formatPrice(fee)}</span>
      <span style={chip('#00D68F')}>Transportista: {formatPrice(payout)}</span>
    </div>
  )

  return (
    <div style={{ background: '#0D1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
      <p style={{ fontSize: '12px', color: '#9AA3B5', fontWeight: 600, marginBottom: '12px' }}>DESGLOSE DE PRECIO</p>
      {volumeM3 != null && (
        <Row label={`${volumeM3} m³ × ${formatPrice(BUSINESS_RULES.PRICE_PER_M3)}/m³`} value={formatPrice(volumeM3 * BUSINESS_RULES.PRICE_PER_M3)} sub />
      )}
      {volumeM3 != null && total > volumeM3 * BUSINESS_RULES.PRICE_PER_M3 && (
        <Row label="Mínimo aplicado" value={formatPrice(BUSINESS_RULES.MIN_ORDER_PRICE)} sub />
      )}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '8px 0' }} />
      <Row label="Total cliente paga" value={formatPrice(total)} color="#D4A843" bold />
      <Row label={`Comisión plataforma (${BUSINESS_RULES.PLATFORM_COMMISSION * 100}%)`} value={formatPrice(fee)} color="#9AA3B5" />
      <Row label="Pago al transportista" value={formatPrice(payout)} color="#00D68F" />
    </div>
  )
}

function Row({ label, value, color = '#E8EDF5', bold, sub }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', opacity: sub ? 0.6 : 1 }}>
      <span style={{ fontSize: '13px', color: '#9AA3B5' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: bold ? 700 : 500, color, fontFamily: bold ? 'Space Grotesk' : 'inherit' }}>{value}</span>
    </div>
  )
}

function chip(color) {
  return { background: `${color}15`, color, border: `1px solid ${color}30`, borderRadius: '6px', padding: '3px 8px', fontSize: '12px' }
}
