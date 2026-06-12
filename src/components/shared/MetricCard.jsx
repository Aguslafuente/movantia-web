export default function MetricCard({ label, value, sub, icon, color = '#D4A843', accent = false }) {
  return (
    <div style={{
      background: accent ? `linear-gradient(135deg, ${color}18, ${color}08)` : '#0D1018',
      border: `1px solid ${accent ? color + '40' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: '12px', padding: '16px 18px',
      display: 'flex', flexDirection: 'column', gap: '6px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#9AA3B5', fontWeight: 500 }}>{label}</span>
        {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
      </div>
      <div style={{ fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: 700, color: accent ? color : '#E8EDF5' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '11px', color: '#9AA3B5' }}>{sub}</div>}
    </div>
  )
}
