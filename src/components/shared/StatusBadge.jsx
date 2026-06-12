export default function StatusBadge({ status, labels, size = 'sm' }) {
  const info = labels?.[status] || { label: status, color: '#9AA3B5', bg: 'rgba(154,163,181,0.1)' }
  const pad = size === 'sm' ? '3px 8px' : '5px 12px'
  const fs = size === 'sm' ? '11px' : '13px'
  return (
    <span style={{
      background: info.bg || `${info.color}18`,
      color: info.color,
      border: `1px solid ${info.color}40`,
      borderRadius: '20px', padding: pad,
      fontSize: fs, fontWeight: 600,
      display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {info.label}
    </span>
  )
}
