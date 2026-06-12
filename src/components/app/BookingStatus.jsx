import { BOOKING_STATUS_LABELS } from '../../lib/constants'
import { CheckCircle2, Circle } from 'lucide-react'

const STEPS = ['confirmed', 'picked_up', 'in_transit', 'delivered']

export default function BookingStatus({ status }) {
  const currentIdx = STEPS.indexOf(status)
  const info = BOOKING_STATUS_LABELS[status] || { label: status, color: '#9AA3B5' }

  return (
    <div>
      <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:`${info.color}20`, border:`1px solid ${info.color}40`, borderRadius:'20px', padding:'6px 14px', marginBottom:'20px' }}>
        <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:info.color }} />
        <span style={{ color:info.color, fontSize:'13px', fontWeight:600 }}>{info.label}</span>
      </div>

      {status !== 'cancelled' && status !== 'disputed' && status !== 'pending_payment' && (
        <div style={{ display:'flex', alignItems:'center', gap:'0' }}>
          {STEPS.map((step, i) => {
            const done = i <= currentIdx
            const active = i === currentIdx
            return (
              <div key={step} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                  {done
                    ? <CheckCircle2 size={20} style={{ color:'#00D68F' }} />
                    : <Circle size={20} style={{ color:'rgba(255,255,255,0.2)' }} />
                  }
                  <span style={{ fontSize:'10px', color: active ? '#E8EDF5' : '#9AA3B5', fontWeight: active ? 600 : 400, whiteSpace:'nowrap' }}>
                    {BOOKING_STATUS_LABELS[step]?.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex:1, height:'2px', background: i < currentIdx ? '#00D68F' : 'rgba(255,255,255,0.1)', margin:'0 4px', marginBottom:'18px' }} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
