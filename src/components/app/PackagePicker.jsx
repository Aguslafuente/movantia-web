import { useState } from 'react'
import { PACKAGE_CATEGORIES } from '../../lib/constants'

export default function PackagePicker({ value, onChange }) {
  const [customDims, setCustomDims] = useState({ l: '', w: '', h: '' })
  const selected = PACKAGE_CATEGORIES.find(c => c.id === value)

  function handleCustom(field, val) {
    const next = { ...customDims, [field]: val }
    setCustomDims(next)
    const { l, w, h } = next
    if (l && w && h) {
      const m3 = (parseFloat(l) * parseFloat(w) * parseFloat(h)) / 1_000_000
      onChange('custom', Math.max(0.01, parseFloat(m3.toFixed(3))))
    }
  }

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'10px', marginBottom:'16px' }}>
        {PACKAGE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => { if (cat.id !== 'custom') onChange(cat.id, cat.m3) }}
            style={{
              background: value === cat.id ? 'rgba(212,168,67,0.12)' : '#0D1018',
              border: `1.5px solid ${value === cat.id ? '#D4A843' : 'rgba(255,255,255,0.1)'}`,
              borderRadius:'10px', padding:'14px 10px', cursor:'pointer', textAlign:'left',
              color:'#E8EDF5', transition:'all .15s',
            }}
          >
            <div style={{ fontSize:'22px', marginBottom:'6px' }}>{cat.icon}</div>
            <div style={{ fontSize:'13px', fontWeight:600 }}>{cat.label}</div>
            <div style={{ fontSize:'11px', color:'#9AA3B5', marginTop:'3px' }}>{cat.example}</div>
            {cat.m3 && <div style={{ fontSize:'12px', color:'#D4A843', marginTop:'6px', fontWeight:700 }}>{cat.m3} m³</div>}
          </button>
        ))}
      </div>

      {value === 'custom' && (
        <div style={{ background:'#0D1018', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'16px' }}>
          <p style={{ fontSize:'13px', color:'#9AA3B5', marginBottom:'12px' }}>Ingresá las medidas en centímetros:</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px' }}>
            {[['l', 'Largo'], ['w', 'Ancho'], ['h', 'Alto']].map(([k, lbl]) => (
              <div key={k}>
                <label style={{ fontSize:'11px', color:'#9AA3B5', display:'block', marginBottom:'4px' }}>{lbl} (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={customDims[k]}
                  onChange={e => handleCustom(k, e.target.value)}
                  style={{ width:'100%', background:'#07090F', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'10px', color:'#E8EDF5', fontSize:'15px', outline:'none', boxSizing:'border-box' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
