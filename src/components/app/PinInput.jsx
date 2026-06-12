import { useState, useRef } from 'react'

export default function PinInput({ onComplete, label }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const refs = [useRef(), useRef(), useRef(), useRef()]

  function handleChange(i, val) {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (val && i < 3) refs[i + 1].current?.focus()
    if (next.every(d => d !== '')) onComplete(next.join(''))
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
  }

  return (
    <div>
      {label && <p style={{ color:'#9AA3B5', fontSize:'13px', marginBottom:'12px' }}>{label}</p>}
      <div style={{ display:'flex', gap:'10px' }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            style={{
              width:'52px', height:'56px', textAlign:'center', fontSize:'24px', fontWeight:700,
              background:'#0D1018', border:`2px solid ${d ? '#D4A843' : 'rgba(255,255,255,0.12)'}`,
              borderRadius:'10px', color:'#E8EDF5', outline:'none', fontFamily:'Space Grotesk, sans-serif',
              transition:'border-color .15s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
