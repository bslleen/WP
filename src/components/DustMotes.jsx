import { useEffect, useRef } from 'react'

const motes = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  x: Math.random() * 100,
  delay: Math.random() * 12,
  duration: Math.random() * 20 + 25,
  opacity: Math.random() * 0.25 + 0.05,
}))

export default function DustMotes() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>
      {motes.map(m => (
        <div
          key={m.id}
          style={{
            position: 'absolute',
            bottom: '-10px',
            left: `${m.x}%`,
            width: m.size,
            height: m.size,
            borderRadius: '50%',
            background: '#c9a85c',
            opacity: m.opacity,
            animation: `floatMote ${m.duration}s ${m.delay}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  )
}
