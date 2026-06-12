const STEPS = [
  { key: 'confirmed',    label: 'Reserva confirmada',  icon: '✅' },
  { key: 'picked_up',   label: 'Paquete retirado',     icon: '📦' },
  { key: 'in_transit',  label: 'En tránsito',          icon: '🚚' },
  { key: 'delivered',   label: 'Entregado',            icon: '🏁' },
]

const ORDER = ['confirmed', 'picked_up', 'in_transit', 'delivered']

export default function Timeline({ status }) {
  const currentIdx = ORDER.indexOf(status)

  return (
    <div style={{ padding: '4px 0' }}>
      {STEPS.map((step, i) => {
        const done = currentIdx >= i
        const active = currentIdx === i
        return (
          <div key={step.key} style={{ display: 'flex', gap: '14px', marginBottom: i < STEPS.length - 1 ? '0' : '0' }}>
            {/* Dot + line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px', flexShrink: 0 }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: done ? (active ? '#D4A843' : '#00D68F') : '#1a1e28',
                border: `2px solid ${done ? (active ? '#D4A843' : '#00D68F') : 'rgba(255,255,255,0.12)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', flexShrink: 0,
              }}>
                {done ? '✓' : ''}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: '2px', flex: 1, minHeight: '28px',
                  background: currentIdx > i ? '#00D68F' : 'rgba(255,255,255,0.08)',
                }} />
              )}
            </div>
            {/* Label */}
            <div style={{ paddingBottom: i < STEPS.length - 1 ? '20px' : '0', paddingTop: '1px' }}>
              <p style={{
                fontSize: '13px', fontWeight: active ? 700 : 500,
                color: done ? (active ? '#D4A843' : '#E8EDF5') : '#9AA3B5',
                margin: 0,
              }}>
                {step.icon} {step.label}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
