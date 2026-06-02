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
      {muted ? '🔇' : '🔥'}
    </button>
  )
}
