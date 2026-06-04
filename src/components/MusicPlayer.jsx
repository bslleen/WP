import { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'

const playlist = [
  { id: 1, title: 'Sonata Op. 110 — I', composer: 'Beethoven', file: '/music/sonata-110-i.mp3' },
  { id: 2, title: 'Sonata Op. 110 — II', composer: 'Beethoven', file: '/music/sonata-110-ii.mp3' },
  { id: 3, title: 'Moonlight Sonata — II', composer: 'Beethoven', file: '/music/moonlight.mp3' },
]

export default function MusicPlayer({ open, onToggle }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const soundRef = useRef(null)
  const rafRef = useRef(null)

  const loadTrack = (index, autoplay = false) => {
    if (soundRef.current) soundRef.current.unload()
    const track = playlist[index]
    soundRef.current = new Howl({
      src: [track.file],
      html5: true,
      volume: 0.5,
      onend: () => {
        const next = (index + 1) % playlist.length
        setCurrentIndex(next)
        loadTrack(next, true)
      }
    })
    if (autoplay) {
      soundRef.current.play()
      setPlaying(true)
    }
  }

  useEffect(() => {
    loadTrack(0)
    return () => soundRef.current?.unload()
  }, [])

  useEffect(() => {
    const tick = () => {
      if (soundRef.current?.playing()) {
        const seek = soundRef.current.seek()
        const dur = soundRef.current.duration()
        setProgress(dur ? (seek / dur) * 100 : 0)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const togglePlay = () => {
    if (!soundRef.current) return
    if (playing) { soundRef.current.pause(); setPlaying(false) }
    else { soundRef.current.play(); setPlaying(true) }
  }

  const prev = () => {
    const i = (currentIndex - 1 + playlist.length) % playlist.length
    setCurrentIndex(i); loadTrack(i, playing)
  }

  const next = () => {
    const i = (currentIndex + 1) % playlist.length
    setCurrentIndex(i); loadTrack(i, playing)
  }

  const track = playlist[currentIndex]

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '72px',
          zIndex: 9998,
          background: 'rgba(13,10,5,0.8)',
          border: '0.5px solid #2a1e0a',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="2"  y1="3"  x2="2"  y2="13" stroke={open ? '#c9a85c' : '#3a2e1a'} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="5"  y1="5"  x2="5"  y2="11" stroke={open ? '#c9a85c' : '#3a2e1a'} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="8"  y1="8"  x2="8"  y2="8"  stroke={open ? '#c9a85c' : '#3a2e1a'} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="11" y1="5"  x2="11" y2="11" stroke={open ? '#c9a85c' : '#3a2e1a'} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="14" y1="3"  x2="14" y2="13" stroke={open ? '#c9a85c' : '#3a2e1a'} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Player panel */}
      <div style={{
        position: 'fixed', bottom: 76, left: 28, zIndex: 9996,
        width: 280, background: 'rgba(13,10,5,0.97)',
        border: '0.5px solid #2a1e0a',
        transform: open ? 'translateY(0)' : 'translateY(20px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'all 0.4s cubic-bezier(0.25,0.1,0.25,1)',
        padding: '24px 20px 20px',
      }}>
        {/* Track info */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: '0.3em', color: '#3a2e1a', marginBottom: 6 }}>NOW PLAYING</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: 'italic', color: '#d4c4a0', lineHeight: 1.2, marginBottom: 2 }}>{track.title}</p>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: '#5a4a2a' }}>{track.composer}</p>
        </div>

        {/* Progress bar */}
        <div style={{ height: 1, background: '#1a1410', marginBottom: 16, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progress}%`, background: '#c9a85c', transition: 'width 0.5s linear' }} />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <button onClick={prev} style={{ background: 'none', border: 'none', color: '#5a4a2a', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>⏮</button>
          <button onClick={togglePlay} style={{
            background: 'none', border: '0.5px solid #c9a85c',
            color: '#c9a85c', width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 14, transition: 'all 0.2s',
          }}>
            {playing ? '⏸' : '▶'}
          </button>
          <button onClick={next} style={{ background: 'none', border: 'none', color: '#5a4a2a', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>⏭</button>
        </div>

        {/* Playlist */}
        <div style={{ marginTop: 20, borderTop: '0.5px solid #1a1410', paddingTop: 16 }}>
          {playlist.map((t, i) => (
            <div
              key={t.id}
              onClick={() => { setCurrentIndex(i); loadTrack(i, true) }}
              style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', cursor: 'pointer',
                borderBottom: '0.5px solid #0f0c08',
              }}
            >
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: 'italic', color: i === currentIndex ? '#c9a85c' : '#5a4a2a' }}>{t.title}</span>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: '0.15em', color: '#2a2010', alignSelf: 'center' }}>{t.composer}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
