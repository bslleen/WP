import { useEffect, useState } from 'react'

export default function QuillCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move = e => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true) }
    const hide = () => setVisible(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', hide)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', hide) }
  }, [])

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      <div style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        transform: 'translate(-4px, -28px) rotate(-35deg)',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s',
      }}>
        <svg width="28" height="48" viewBox="0 0 28 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2 C20 8 26 16 24 26 C22 34 16 40 14 46 C12 40 6 34 4 26 C2 16 8 8 14 2Z" fill="#c9a85c" opacity="0.9"/>
          <path d="M14 2 C14 2 18 12 16 26 C15 34 14 46 14 46" stroke="#8a6d2f" strokeWidth="0.8" fill="none"/>
          <path d="M14 44 L12 48 L14 46 L16 48 Z" fill="#3a2e1a"/>
          <line x1="14" y1="44" x2="14" y2="48" stroke="#c9a85c" strokeWidth="0.5"/>
        </svg>
      </div>
    </>
  )
}
