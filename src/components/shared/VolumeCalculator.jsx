import { useState } from 'react'
import { calculateVolumeCm, getPriceBreakdown } from '../../lib/constants'
import PriceBreakdown from './PriceBreakdown'

export default function VolumeCalculator({ onResult }) {
  const [h, setH] = useState('')
  const [w, setW] = useState('')
  const [d, setD] = useState('')

  const valid = h > 0 && w > 0 && d > 0
  const volume = valid ? calculateVolumeCm(+h, +w, +d) : null
  const breakdown = volume != null ? getPriceBreakdown(volume) : null

  if (valid && breakdown && onResult) onResult(breakdown)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        {[['Alto', h, setH], ['Ancho', w, setW], ['Prof.', d, setD]].map(([label, val, set]) => (
          <div key={label}>
            <label style={lbl}>{label} (cm)</label>
            <input
              type="number" min="1" value={val}
              onChange={e => set(e.target.value)}
              placeholder="0"
              style={inp}
            />
          </div>
        ))}
      </div>

      {valid && volume != null && (
        <div style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
          <p style={{ fontSize: '13px', color: '#9AA3B5', marginBottom: '4px' }}>Volumen calculado</p>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: 700, color: '#D4A843' }}>
            {volume.toFixed(4)} m³
          </p>
        </div>
      )}

      {breakdown && <PriceBreakdown {...breakdown} />}
    </div>
  )
}

const lbl = { display: 'block', fontSize: '11px', color: '#9AA3B5', marginBottom: '4px' }
const inp = {
  width: '100%', background: '#0D1018', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', padding: '10px', color: '#E8EDF5', fontSize: '14px',
  fontFamily: 'Space Grotesk', boxSizing: 'border-box',
}
