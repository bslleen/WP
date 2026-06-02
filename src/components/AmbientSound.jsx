import { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'

export default function AmbientSound() {
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)
  const soundRef = useRef(null)

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/sounds/ambient.ogg'],
      loop: true,
      volume: 0,
    })
    const start = () => {
      if (started) return
      setStarted(true)
      soundRef.current.play()
      soundRef.current.fade(0, 0.22, 4000)
    }
    window.addEventListener('click', start, { once: true })
    window.addEventListener('scroll', start, { once: true })
    return () => {
      window.removeEventListener('click', start)
      window.removeEventListener('scroll', start)
      soundRef.current?.unload()
    }
  }, [])

  const toggle = () => {
    setMuted(m => {
      const next = !m
      soundRef.current?.volume(next ? 0 : 0.22)
      return next
    })
  }

  return (
    <button
      onClick={toggle}
      title={muted ? 'Unmute' : 'Mute ambient sound'}
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9998,
        background: 'rgba(13,10,5,0.8)',
        border: '0.5px solid #2a1e0a',
        color: '#c9a85c',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.2s',
      }}
    >
      {muted ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="8" x2="2" y2="8" stroke="#3a2e1a" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="5" y1="5" x2="5" y2="11" stroke="#3a2e1a" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="8" y1="3" x2="8" y2="13" stroke="#3a2e1a" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="11" y1="5" x2="11" y2="11" stroke="#3a2e1a" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="14" y1="8" x2="14" y2="8" stroke="#3a2e1a" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="8" x2="2" y2="8" stroke="#c9a85c" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="5" y1="5" x2="5" y2="11" stroke="#c9a85c" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="8" y1="3" x2="8" y2="13" stroke="#c9a85c" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="11" y1="5" x2="11" y2="11" stroke="#c9a85c" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="14" y1="8" x2="14" y2="8" stroke="#c9a85c" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  )
}
