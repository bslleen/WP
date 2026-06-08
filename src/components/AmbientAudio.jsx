import { useState, useEffect, useRef } from 'react'

export default function AmbientAudio() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const startedRef = useRef(false)
  const listenerRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleFirstClick = () => {
      if (startedRef.current) return
      startedRef.current = true
      audio.volume = 0.15
      audio.play().catch(() => {})
      setIsPlaying(true)
      window.removeEventListener('click', handleFirstClick)
    }

    listenerRef.current = handleFirstClick
    window.addEventListener('click', handleFirstClick)
    return () => window.removeEventListener('click', handleFirstClick)
  }, [])

  const toggleAudio = (e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return

    if (!startedRef.current) {
      startedRef.current = true
      if (listenerRef.current) window.removeEventListener('click', listenerRef.current)
      audio.volume = 0.15
      audio.play().catch(() => {})
      setIsPlaying(true)
      return
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  return (
    <>
      <audio ref={audioRef} loop preload="none" src="/music/moonlight.mp3" />
      <button
        onClick={toggleAudio}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'none',
          border: 'none',
          color: isPlaying ? '#c9a84c' : '#3d2b14',
          fontSize: '12px',
          cursor: 'pointer',
          letterSpacing: '0.2em',
          transition: 'color 0.3s ease',
          fontFamily: "'Cinzel', serif",
        }}
      >
        {isPlaying ? '♪ playing' : '♪ muted'}
      </button>
    </>
  )
}
