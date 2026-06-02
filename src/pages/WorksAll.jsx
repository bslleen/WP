import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'
import { fetchWorks } from '../data/api'
import { normalizeWork } from '../data/normalize'
import { works as mockWorks } from '../data/content'

const DOORS = [
  {
    key: 'all',
    label: 'All Works',
    sub: 'Complete Archive',
    gradient: 'linear-gradient(160deg, #2a1f0e 0%, #0d0a05 100%)',
    accent: '#c9a84c',
    roman: 'I',
  },
  {
    key: 'Novel',
    label: 'Novels',
    sub: 'Long Fiction',
    gradient: 'linear-gradient(160deg, #1a1004 0%, #0d0a05 100%)',
    accent: '#c9a84c',
    roman: 'II',
  },
  {
    key: 'Poetry',
    label: 'Poetry',
    sub: 'Verse & Song',
    gradient: 'linear-gradient(160deg, #0d1420 0%, #080c14 100%)',
    accent: '#4a7a9b',
    roman: 'III',
  },
  {
    key: 'Short Story',
    label: 'Short\nStories',
    sub: 'Short Fiction',
    gradient: 'linear-gradient(160deg, #0d1a14 0%, #080d0a 100%)',
    accent: '#6b8f6b',
    roman: 'IV',
  },
]

// ── Book cover art for grid cards ─────────────────────────────────────────────
function MiniBookCover({ work }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(150deg, ${work.coverColor} 0%, #080604 100%)`,
      position: 'relative',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 14px',
    }}>
      <div style={{ position: 'absolute', inset: '8px', border: `1px solid ${work.accentColor}44`, pointerEvents: 'none' }} />
      <p style={{ color: work.accentColor, fontSize: '0.45rem', letterSpacing: '0.28em', textTransform: 'uppercase', fontFamily: "'Crimson Text', serif", opacity: 0.7, zIndex: 1 }}>
        E. Ashworth
      </p>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ width: '50%', height: '1px', background: `linear-gradient(90deg, transparent, ${work.accentColor}88, transparent)`, margin: '0 auto 10px' }} />
        <p style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8', fontSize: work.title.length > 20 ? '0.78rem' : '0.9rem', fontStyle: 'italic', lineHeight: 1.3, textAlign: 'center' }}>
          {work.title}
        </p>
        <div style={{ width: '35%', height: '1px', background: `linear-gradient(90deg, transparent, ${work.accentColor}66, transparent)`, margin: '10px auto 0' }} />
      </div>
      <p style={{ color: work.accentColor, fontSize: '0.44rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: "'Crimson Text', serif", opacity: 0.55, zIndex: 1 }}>
        {work.category}
      </p>
    </div>
  )
}

// ── Grid card ─────────────────────────────────────────────────────────────────
function WorkCard({ work }) {
  return (
    <div
      style={{ border: '1px solid #b8a98e', background: '#f0e8d8', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.18)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
        {work.cover_image
          ? <img src={work.cover_image} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%) brightness(0.9)' }} />
          : <MiniBookCover work={work} />
        }
        <button onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '26px', height: '26px',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(4px)', color: '#f0e6c8',
            fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontWeight: 300, transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
        >+</button>
        {work.status === 'In Progress' && (
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(13,10,5,0.75)', color: work.accentColor, fontSize: '0.48rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '2px 7px', border: `1px solid ${work.accentColor}44`, fontFamily: "'Playfair Display', serif" }}>
            In Progress
          </div>
        )}
      </div>
      <div style={{ padding: '12px 14px 16px', borderTop: '1px solid #c8b89a' }}>
        <p style={{ fontFamily: "'Playfair Display', serif", color: '#1c140a', fontSize: '0.9rem', lineHeight: 1.3, marginBottom: '4px' }}>{work.title}</p>
        <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: 'italic', color: '#7a6548', fontSize: '0.82rem', marginBottom: '4px' }}>{work.category} · {work.year}</p>
        <p style={{ fontFamily: "'Crimson Text', serif", color: '#1c140a', fontSize: '0.82rem' }}>
          {work.pages > 0 ? `${work.pages} pages` : 'Coming Soon'}
        </p>
      </div>
    </div>
  )
}

// ── Ornament ─────────────────────────────────────────────────────────────────
function Ornament({ color = '#8a7a65' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 14px' }}>
      <svg viewBox="0 0 140 12" style={{ width: '100px', height: '10px' }} fill="none">
        <line x1="0" y1="6" x2="50" y2="6" stroke={color} strokeWidth="0.6" />
        <path d="M55 6 L60 2.5 L65 6 L60 9.5 Z" fill="none" stroke={color} strokeWidth="0.9" />
        <circle cx="70" cy="6" r="2" fill={color} />
        <path d="M75 6 L80 2.5 L85 6 L80 9.5 Z" fill="none" stroke={color} strokeWidth="0.9" />
        <line x1="90" y1="6" x2="140" y2="6" stroke={color} strokeWidth="0.6" />
      </svg>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function WorksAll() {
  const [active, setActive] = useState('all')
  const [hoveredDoor, setHoveredDoor] = useState(null)
  const [works, setWorks] = useState(mockWorks.map(normalizeWork))
  const gridRef = useRef(null)

  useEffect(() => {
    fetchWorks()
      .then(data => setWorks(data.map(normalizeWork)))
      .catch(() => {})
  }, [])

  const filtered = active === 'all' ? works : works.filter(w => w.category === active)
  const activeDoor = DOORS.find(d => d.key === active)

  const handleDoorClick = (key) => {
    setActive(key)
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  return (
    <div style={{ background: '#0d0a05', minHeight: '100vh' }}>

      {/* ════ 4 DOORS ════ */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        minHeight: '100vh',
        paddingTop: '64px', // nav height
      }}>
        {DOORS.map(door => {
          const count = door.key === 'all' ? works.length : works.filter(w => w.category?.toLowerCase() === door.key.toLowerCase()).length
          const isActive = active === door.key
          const isHovered = hoveredDoor === door.key

          return (
            <button
              key={door.key}
              onClick={() => handleDoorClick(door.key)}
              onMouseEnter={() => setHoveredDoor(door.key)}
              onMouseLeave={() => setHoveredDoor(null)}
              style={{
                background: door.gradient,
                border: 'none',
                borderRight: '1px solid rgba(255,255,255,0.04)',
                borderTop: isActive ? `2px solid ${door.accent}` : '2px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1.5rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'filter 0.35s ease',
                filter: isActive ? 'brightness(1.3)' : isHovered ? 'brightness(1.15)' : 'brightness(1)',
              }}
            >
              {/* Background texture overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
                pointerEvents: 'none',
                opacity: 0.5,
              }} />

              {/* Top inset border */}
              <div style={{
                position: 'absolute', inset: '16px',
                border: `1px solid ${door.accent}22`,
                pointerEvents: 'none',
                transition: 'border-color 0.3s',
                borderColor: isActive || isHovered ? `${door.accent}44` : `${door.accent}22`,
              }} />

              {/* Roman numeral */}
              <p style={{
                fontFamily: "'Playfair Display', serif",
                color: door.accent,
                fontSize: '0.6rem',
                letterSpacing: '0.4em',
                opacity: isActive ? 0.9 : 0.4,
                marginBottom: 'auto',
                zIndex: 1,
                transition: 'opacity 0.3s',
              }}>
                {door.roman}
              </p>

              {/* Main label */}
              <div style={{ zIndex: 1, textAlign: 'center', flex: '0 0 auto', marginTop: '1rem' }}>
                {/* Top rule */}
                <div style={{
                  width: '40px', height: '1px',
                  background: `linear-gradient(90deg, transparent, ${door.accent}88, transparent)`,
                  margin: '0 auto 1.5rem',
                  transition: 'opacity 0.3s',
                  opacity: isActive || isHovered ? 1 : 0.4,
                }} />

                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#f0e6c8',
                  fontSize: 'clamp(1.5rem, 2vw, 2.4rem)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: '0.75rem',
                  whiteSpace: 'pre-line',
                  opacity: isActive ? 1 : isHovered ? 0.95 : 0.7,
                  transition: 'opacity 0.3s',
                  letterSpacing: '0.01em',
                }}>
                  {door.label}
                </h2>

                {/* Sub */}
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  color: door.accent,
                  fontSize: '0.55rem',
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  opacity: isActive ? 0.9 : isHovered ? 0.7 : 0.35,
                  transition: 'opacity 0.3s',
                  marginBottom: '0.5rem',
                }}>
                  {door.sub}
                </p>

                {/* Bottom rule */}
                <div style={{
                  width: '30px', height: '1px',
                  background: `linear-gradient(90deg, transparent, ${door.accent}77, transparent)`,
                  margin: '1.5rem auto 0',
                  opacity: isActive || isHovered ? 1 : 0.3,
                  transition: 'opacity 0.3s',
                }} />
              </div>

              {/* Count + enter */}
              <div style={{ zIndex: 1, textAlign: 'center', marginTop: 'auto' }}>
                <p style={{
                  fontFamily: "'Crimson Text', serif",
                  color: door.accent,
                  fontSize: '0.7rem',
                  opacity: isActive ? 0.9 : isHovered ? 0.7 : 0.35,
                  letterSpacing: '0.1em',
                  marginBottom: '0.3rem',
                  transition: 'opacity 0.3s',
                }}>
                  {count} {count === 1 ? 'work' : 'works'}
                </p>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#f0e6c8',
                  fontSize: '0.55rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  opacity: isActive ? 0.8 : isHovered ? 0.5 : 0,
                  transition: 'opacity 0.3s',
                }}>
                  {isActive ? '✦ Selected' : 'Enter →'}
                </p>
              </div>
            </button>
          )
        })}
      </section>

      {/* ════ FILTERED WORKS GRID — parchment ════ */}
      <section ref={gridRef} style={{ background: '#e8dcc8', padding: '5rem 3rem 5.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              color: '#1c140a',
              fontSize: '0.72rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              fontWeight: 400,
              marginBottom: '2px',
            }}>
              {activeDoor?.label.toUpperCase() || 'ALL WORKS'}
            </h2>
            <Ornament />
            <p style={{
              fontFamily: "'Crimson Text', serif",
              fontStyle: 'italic',
              color: '#7a6548',
              fontSize: '1.05rem',
            }}>
              {active === 'all'
                ? `${works.length} works in the archive.`
                : `${filtered.length} ${activeDoor?.sub?.toLowerCase() || 'works'} in the collection.`
              }
            </p>
          </div>

          {/* Category tabs (secondary filter) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
            {DOORS.map(d => (
              <button
                key={d.key}
                onClick={() => setActive(d.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: active === d.key ? '1px solid #1c140a' : '1px solid transparent',
                  color: active === d.key ? '#1c140a' : '#8a7a65',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: '4px 0',
                  transition: 'color 0.2s',
                }}
              >
                {d.key === 'all' ? 'All' : d.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}>
              {filtered.map(work => <WorkCard key={work.id} work={work} />)}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#8a7a65', fontStyle: 'italic', fontFamily: "'Crimson Text', serif", padding: '3rem 0' }}>
              No works in this category yet.
            </p>
          )}

          {/* Back link */}
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link
              to="/works"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#1c140a',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              ← BACK TO WORKS
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
