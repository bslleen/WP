import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchWorks, fetchJournal } from '../data/api'
import { normalizeWork, normalizeJournal } from '../data/normalize'
import heroBg from '../assets/study.jpg'
import FadeIn from '../components/FadeIn'

function useFonts() {
  useEffect(() => {
    const id = 'aw-fonts'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id  = id
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Cinzel:wght@400;500&display=swap'
    document.head.appendChild(link)
  }, [])
}

function Ornament() {
  const dot = { width: 5, height: 5, border: '0.5px solid #3a2e1a', transform: 'rotate(45deg)' }
  const sm  = { width: 3, height: 3, border: '0.5px solid #2a2010', transform: 'rotate(45deg)' }
  const filled = { ...dot, background: '#c9a85c', borderColor: '#c9a85c' }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center', margin: '0 0 48px' }}>
      <div style={sm} /><div style={dot} /><div style={sm} />
      <div style={filled} />
      <div style={sm} /><div style={dot} /><div style={sm} />
    </div>
  )
}

/* ── Castle Gallery Components ───────────────────────────────────────────── */

function AtmosphericSVG({ category, accentColor }) {
  const c = accentColor || '#8a6d2f'
  const cat = (category || '').toLowerCase()

  if (cat.includes('novel')) {
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 200 165" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="100" cy="100" rx="90" ry="55" fill={c} fillOpacity="0.07" />
        {[0,1,2,3].map(i => (
          <rect key={i} x={50 + i*3} y={55 - i*13} width={100 - i*6} height={11}
            fill="none" stroke={c} strokeWidth="0.5" strokeOpacity={0.32 - i*0.06} />
        ))}
        <path d="M130 18 Q142 38 122 58 Q116 70 124 82"
          fill="none" stroke={c} strokeWidth="0.7" strokeOpacity="0.22" />
        <path d="M130 18 L124 30" fill="none" stroke={c} strokeWidth="0.4" strokeOpacity="0.18" />
        <ellipse cx="100" cy="140" rx="50" ry="12" fill={c} fillOpacity="0.04" />
      </svg>
    )
  }

  if (cat.includes('poetry')) {
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 200 165" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i} x1={i * 10} y1={0} x2={i * 10 - 12} y2={100}
            stroke={c} strokeWidth="0.35" strokeOpacity={0.12 + (i % 4) * 0.04} />
        ))}
        <path d="M0 110 Q25 82 55 95 Q80 105 100 82 Q122 60 155 76 Q178 88 200 70 L200 165 L0 165 Z"
          fill={c} fillOpacity="0.10" />
        <circle cx="158" cy="32" r="18" fill="none" stroke={c} strokeWidth="0.5" strokeOpacity="0.18" />
        <circle cx="165" cy="30" r="15" fill="#0d0a05" />
      </svg>
    )
  }

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 200 165" preserveAspectRatio="xMidYMid slice">
      {[[38,38],[100,65],[162,45],[78,108],[132,96]].map(([x,y], i, arr) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.5" fill="none" stroke={c} strokeWidth="0.5" strokeOpacity="0.28" />
          {i < arr.length - 1 && (
            <line x1={x} y1={y} x2={arr[i+1][0]} y2={arr[i+1][1]}
              stroke={c} strokeWidth="0.3" strokeOpacity="0.18" strokeDasharray="4 3" />
          )}
        </g>
      ))}
      <g transform="translate(158 118)">
        <line x1="0" y1="-16" x2="0" y2="16" stroke={c} strokeWidth="0.4" strokeOpacity="0.22" />
        <line x1="-16" y1="0" x2="16" y2="0" stroke={c} strokeWidth="0.4" strokeOpacity="0.22" />
        <line x1="-10" y1="-10" x2="10" y2="10" stroke={c} strokeWidth="0.25" strokeOpacity="0.14" />
        <line x1="10" y1="-10" x2="-10" y2="10" stroke={c} strokeWidth="0.25" strokeOpacity="0.14" />
        <circle cx="0" cy="0" r="4" fill="none" stroke={c} strokeWidth="0.4" strokeOpacity="0.28" />
      </g>
    </svg>
  )
}

function StoneWall() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="stonePattern" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="240" y2="0" stroke="#1a1209" strokeWidth="0.5" />
          <line x1="0" y1="120" x2="240" y2="120" stroke="#1a1209" strokeWidth="0.5" />
          <line x1="80" y1="0" x2="80" y2="120" stroke="#1a1209" strokeWidth="0.5" />
          <line x1="200" y1="0" x2="200" y2="120" stroke="#1a1209" strokeWidth="0.5" />
          <line x1="40" y1="120" x2="40" y2="240" stroke="#1a1209" strokeWidth="0.5" />
          <line x1="140" y1="120" x2="140" y2="240" stroke="#1a1209" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stonePattern)" opacity="0.6" />
    </svg>
  )
}

function SideFrameSVG() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} viewBox="0 0 200 280" preserveAspectRatio="none">
      <rect x="0" y="0" width="200" height="280" fill="none" stroke="#8a6d2f" strokeWidth="1.5"/>
      <rect x="6" y="6" width="188" height="268" fill="none" stroke="#c9a84c" strokeWidth="0.5"/>
      <rect x="10" y="10" width="180" height="260" fill="none" stroke="#8a6d2f" strokeWidth="0.3"/>
      <circle cx="0" cy="0" r="3" fill="#c9a84c"/>
      <circle cx="200" cy="0" r="3" fill="#c9a84c"/>
      <circle cx="0" cy="280" r="3" fill="#c9a84c"/>
      <circle cx="200" cy="280" r="3" fill="#c9a84c"/>
      <path d="M0 18 L0 0 L18 0" fill="none" stroke="#c9a84c" strokeWidth="1"/>
      <path d="M200 18 L200 0 L182 0" fill="none" stroke="#c9a84c" strokeWidth="1"/>
      <path d="M0 262 L0 280 L18 280" fill="none" stroke="#c9a84c" strokeWidth="1"/>
      <path d="M200 262 L200 280 L182 280" fill="none" stroke="#c9a84c" strokeWidth="1"/>
      <circle cx="100" cy="0" r="2" fill="#8a6d2f"/>
      <circle cx="100" cy="280" r="2" fill="#8a6d2f"/>
      <circle cx="0" cy="140" r="2" fill="#8a6d2f"/>
      <circle cx="200" cy="140" r="2" fill="#8a6d2f"/>
    </svg>
  )
}

function CenterFrameSVG() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} viewBox="0 0 220 308" preserveAspectRatio="none">
      <rect x="0" y="0" width="220" height="308" fill="none" stroke="#c9a84c" strokeWidth="2"/>
      <rect x="6" y="6" width="208" height="296" fill="none" stroke="#c9a84c" strokeWidth="0.5"/>
      <rect x="10" y="10" width="200" height="288" fill="none" stroke="#8a6d2f" strokeWidth="0.3"/>
      <circle cx="0" cy="0" r="4" fill="#e8c86a"/>
      <circle cx="220" cy="0" r="4" fill="#e8c86a"/>
      <circle cx="0" cy="308" r="4" fill="#e8c86a"/>
      <circle cx="220" cy="308" r="4" fill="#e8c86a"/>
      <path d="M0 18 L0 0 L18 0" fill="none" stroke="#e8c86a" strokeWidth="1"/>
      <path d="M220 18 L220 0 L202 0" fill="none" stroke="#e8c86a" strokeWidth="1"/>
      <path d="M0 290 L0 308 L18 308" fill="none" stroke="#e8c86a" strokeWidth="1"/>
      <path d="M220 290 L220 308 L202 308" fill="none" stroke="#e8c86a" strokeWidth="1"/>
      <circle cx="110" cy="0" r="2" fill="#8a6d2f"/>
      <circle cx="110" cy="308" r="2" fill="#8a6d2f"/>
      <circle cx="0" cy="154" r="2" fill="#8a6d2f"/>
      <circle cx="220" cy="154" r="2" fill="#8a6d2f"/>
      <path d="M106 0 L110 -4 L114 0 L110 4 Z" fill="#e8c86a"/>
      <path d="M106 308 L110 304 L114 308 L110 312 Z" fill="#e8c86a"/>
    </svg>
  )
}

/* ── Home ──────────────────────────────────────────────────────────────────── */

export default function Home() {
  useFonts()

  const [works,   setWorks]   = useState([])
  const [journal, setJournal] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredIdx, setHoveredIdx] = useState(null)

  useEffect(() => {
    fetchWorks()
      .then(data => setWorks(data.slice(0, 3).map(normalizeWork)))
      .catch(() => {})
      .finally(() => setLoading(false))
    fetchJournal()
      .then(data => setJournal(data.slice(0, 2).map(normalizeJournal)))
      .catch(() => {})
  }, [])

  return (
    <div style={{
      fontFamily: "'EB Garamond', Georgia, serif",
      background: '#0e0b07',
      color: '#d4c4a0',
      width: '100%',
      overflowX: 'hidden',
    }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative grid grid-cols-1 lg:grid-cols-2 items-center pt-20 pb-12 lg:px-10 lg:pt-24 gap-8 lg:gap-16"
        style={{
          minHeight: '92vh',
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          paddingLeft: 'max(24px, env(safe-area-inset-left, 24px))',
          paddingRight: 'max(24px, env(safe-area-inset-right, 24px))',
          overflowX: 'clip',
        }}
      >
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(14,11,7,0.82)',
          pointerEvents: 'none',
        }} />
        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(201,168,92,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Left */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: "'Cinzel', serif", fontSize: 10,
            letterSpacing: '0.35em', color: '#7a6a4a',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
          }}>
            <span style={{ flex: 1, maxWidth: 40, height: '0.5px', background: '#3a2e1a', display: 'inline-block' }} />
            AUTHOR & POET
            <span style={{ flex: 1, maxWidth: 40, height: '0.5px', background: '#3a2e1a', display: 'inline-block' }} />
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.4rem, 8vw, 3.9rem)', fontWeight: 300, lineHeight: 1.1,
            color: '#e8dcc0', marginBottom: 6,
          }}>
            Words that<br />
            <em style={{ fontStyle: 'italic', color: '#c9a85c', fontSize: 'clamp(2.6rem, 9vw, 4.3rem)' }}>endure</em><br />
            the dark.
          </h1>

          <div style={{ width: 40, height: '0.5px', background: '#c9a85c', margin: '28px 0' }} />

          <p style={{
            fontSize: 17, lineHeight: 1.8, color: '#8a7a5a',
            maxWidth: 380, marginBottom: 36,
          }}>
            Edmund Ashworth wrote novels, poems, and stories that lived
            in the borderlands between the known and the vanished. The archive
            was discovered in 1923. The candle was still warm.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/works" style={{
              fontFamily: "'Cinzel', serif", fontSize: 11,
              letterSpacing: '0.2em', color: '#c9a85c',
              border: '0.5px solid #c9a85c', padding: '14px 28px',
              textDecoration: 'none', background: 'transparent',
              minHeight: '44px', display: 'flex', alignItems: 'center',
            }}>
              VIEW THE WORKS
            </Link>
            <Link to="/about" style={{
              fontFamily: "'Cinzel', serif", fontSize: 11,
              letterSpacing: '0.2em', color: '#7a6a4a', textDecoration: 'none',
              minHeight: '44px', display: 'flex', alignItems: 'center',
            }}>
              About the Author →
            </Link>
          </div>
        </div>

        {/* Right — hidden on mobile */}
        <div className="hidden lg:flex flex-col gap-4" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            border: '0.5px solid #3a2e1a', padding: '28px 32px',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: '0.35em', color: '#7a6a4a', marginBottom: 16,
              textTransform: 'uppercase',
            }}>
              From the Archive
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontStyle: 'italic', fontWeight: 300,
              color: '#d4c4a0', lineHeight: 1.6, marginBottom: 20,
            }}>
              "The light came not from any star, but from something older —
              something that had learned, long ago, to imitate the sky."
            </p>
            <div style={{
              fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: '0.25em', color: '#5a4a2a',
              borderTop: '0.5px solid #3a2e1a', paddingTop: 14,
            }}>
              THE AMBER MERIDIAN, 1889
            </div>
          </div>

          <div style={{
            border: '0.5px solid #2a2010', padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
            fontSize: 14, color: '#5a4a2a', fontStyle: 'italic',
          }}>
            <span style={{ color: '#c9a85c', fontStyle: 'normal', fontSize: 18 }}>✦</span>
            Study. Read. Discover. — <em style={{ color: '#3a2e1a', marginLeft: 4 }}>The work itself.</em>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Cinzel', serif", fontSize: 9,
          letterSpacing: '0.3em', color: '#3a2e1a',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          zIndex: 1,
        }}>
          <span>SCROLL</span>
          <div style={{ width: '0.5px', height: 40, background: '#3a2e1a' }} />
        </div>
      </section>

      {/* ── COLLECTION ────────────────────────────────────────────────────── */}
      <section style={{
        background: '#0d0a05',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 40px',
      }}>
        <style>{`
          @media (max-width: 768px) {
            .gallery-row { flex-direction: column !important; align-items: center !important; }
            .work-frame  { margin-bottom: 56px !important; }
            .work-frame-c{ margin-bottom: 56px !important; }
            .frame-card  { width: calc(100vw - 80px) !important; max-width: 300px !important; }
          }
        `}</style>

        {/* Stone wall texture */}
        <StoneWall />

        {/* Warm top glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%)',
        }} />

        {/* Section header */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '60px' }}>
          <FadeIn delay={0}>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: '0.35em', color: '#5a4a2a', marginBottom: 8,
              textTransform: 'uppercase',
            }}>
              THE COLLECTION
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36, fontWeight: 400,
              color: '#f0e6c8', lineHeight: 1,
            }}>
              The Archive
            </h2>
            <p style={{
              fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
              fontSize: 15, color: '#6a5a3a', marginTop: 6,
            }}>
              Works from the current archive.
            </p>
          </FadeIn>
        </div>

        {/* Frames */}
        {loading ? (
          <p style={{
            position: 'relative', zIndex: 1, textAlign: 'center',
            fontFamily: "'Cinzel', serif", fontSize: 9,
            letterSpacing: '0.3em', color: '#8a7a5a', padding: '48px 0',
          }}>
            Consulting the archive…
          </p>
        ) : (
          <div className="gallery-row" style={{
            position: 'relative', zIndex: 1,
            display: 'flex', gap: '32px',
            alignItems: 'flex-end',
            justifyContent: 'center',
            flexWrap: 'wrap',
            paddingTop: '28px',
          }}>
            {works.map((work, i) => {
              const isCenter = i === 1
              const w = isCenter ? 220 : 200
              const imgH = isCenter ? 165 : 150
              const accent = work.accentColor || '#8a6d2f'

              return (
                <FadeIn key={work.id} delay={0.12 * i}>
                  <Link to="/works" style={{ textDecoration: 'none' }}>
                    <div
                      className={isCenter ? 'work-frame work-frame-c' : 'work-frame'}
                      style={{
                        position: 'relative',
                        display: 'inline-block',
                        marginBottom: isCenter ? '14px' : '0',
                        transform: hoveredIdx === i ? 'translateY(-6px)' : 'none',
                        transition: 'transform 0.4s ease',
                      }}
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      {/* Hanging wire */}
                      <div style={{
                        position: 'absolute', top: '-20px', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '1px', height: '20px',
                        background: 'linear-gradient(to bottom, transparent, #8a6d2f)',
                      }} />
                      <div style={{
                        position: 'absolute', top: '-22px', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '6px', height: '6px', borderRadius: '50%',
                        border: '1px solid #8a6d2f', background: 'transparent',
                      }} />

                      {/* Card wrapper — SVG frame overlays this */}
                      <div style={{ position: 'relative', width: `${w}px` }}>

                        {/* Painting card */}
                        <div className="frame-card" style={{
                          background: '#1a1209',
                          overflow: 'hidden',
                          boxShadow: hoveredIdx === i
                            ? '0 20px 60px rgba(0,0,0,0.95), inset 0 0 30px rgba(0,0,0,0.4)'
                            : '0 8px 40px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.4)',
                          transition: 'box-shadow 0.4s ease',
                        }}>
                          {/* Image area */}
                          <div style={{
                            height: `${imgH}px`,
                            background: work.cover_image
                              ? `url(${work.cover_image}) center/cover`
                              : `linear-gradient(135deg, ${work.coverColor || '#2a1f0e'}, #0d0a05)`,
                            position: 'relative',
                          }}>
                            <div style={{
                              position: 'absolute', inset: 0,
                              background: 'radial-gradient(ellipse at center, transparent 30%, #0d0a05 100%)',
                            }} />
                            {!work.cover_image && (
                              <AtmosphericSVG category={work.category} accentColor={accent} />
                            )}
                          </div>

                          {/* Gold separator */}
                          <div style={{
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
                            margin: '0 12px',
                          }} />

                          {/* Text block */}
                          <div style={{ padding: '14px 16px 16px' }}>
                            <p style={{
                              fontSize: '9px', letterSpacing: '0.35em',
                              textTransform: 'uppercase', color: accent, marginBottom: '6px',
                            }}>
                              {work.category}
                            </p>
                            <h3 style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: '16px', fontStyle: 'italic',
                              color: '#f0e6c8', marginBottom: '6px', lineHeight: 1.3,
                            }}>
                              {work.title}
                            </h3>
                            <p style={{
                              fontFamily: "'IM Fell English', serif",
                              fontSize: '11px', fontStyle: 'italic',
                              color: '#8a6d2f', marginBottom: '10px', lineHeight: 1.5,
                            }}>
                              "{work.excerpt?.substring(0, 55)}…"
                            </p>
                            <div style={{
                              display: 'flex', justifyContent: 'space-between',
                              borderTop: '1px solid rgba(138,109,47,0.2)', paddingTop: '8px',
                            }}>
                              <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#4a3520', textTransform: 'uppercase' }}>
                                {work.year}
                              </span>
                              <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#4a3520', textTransform: 'uppercase' }}>
                                {work.status || (work.pages > 0 ? `${work.pages} pp.` : 'In Progress')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Ornate frame overlay */}
                        {isCenter ? <CenterFrameSVG /> : <SideFrameSVG />}
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        )}

        {/* View all works */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: '48px' }}>
          <Link to="/works" style={{
            fontFamily: "'Cinzel', serif", fontSize: 11,
            letterSpacing: '0.2em', color: '#c9a85c',
            border: '0.5px solid #c9a85c', padding: '14px 28px',
            textDecoration: 'none', background: 'transparent',
            display: 'inline-block', minHeight: '44px',
          }}>
            VIEW ALL WORKS →
          </Link>
        </div>
      </section>

      {/* ── JOURNAL ───────────────────────────────────────────────────────── */}
      <section style={{ background: '#0e0b07' }} className="px-4 md:px-10 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <FadeIn delay={0}>
          <div>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: '0.35em', color: '#5a4a2a', marginBottom: 8,
              textTransform: 'uppercase',
            }}>
              FROM THE JOURNAL
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic', fontWeight: 300, fontSize: 42,
              color: '#e8dcc0',
            }}>
              Recent Entries
            </h2>
          </div>
          </FadeIn>
        </div>

        <Ornament />

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 1, border: '0.5px solid #2a2010' }}>
          {journal.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: '#3a2e1a' }}>
              Consulting the archive…
            </div>
          )}
          {journal.map((entry, i) => (
            <FadeIn key={entry.id} delay={0.15 * i}>
            <div style={{
              padding: 32,
              borderRight: i === 0 ? '0.5px solid #2a2010' : 'none',
              borderBottom: i === 0 ? '0.5px solid #2a2010' : 'none',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}
            className="md:[&]:border-b-0">
              <p style={{
                fontFamily: "'Cinzel', serif", fontSize: 9,
                letterSpacing: '0.3em', color: '#5a4a2a',
                textTransform: 'uppercase',
              }}>
                {entry.category || 'Journal'}
              </p>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24, fontStyle: 'italic',
                color: '#d4c4a0', fontWeight: 400,
              }}>
                {entry.title}
              </h3>
              <p style={{ fontSize: 14, color: '#6a5a3a', lineHeight: 1.7, flex: 1 }}>
                {entry.excerpt || (entry.body ? entry.body.substring(0, 140) + '…' : '')}
              </p>
              <Link to="/journal" style={{
                fontFamily: "'Cinzel', serif", fontSize: 10,
                letterSpacing: '0.2em', color: '#5a4a2a',
                alignSelf: 'flex-start',
                borderBottom: '0.5px solid #3a2e1a', paddingBottom: 2,
                textDecoration: 'none', minHeight: '44px', display: 'flex', alignItems: 'center',
              }}>
                READ
              </Link>
            </div>
            </FadeIn>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/journal" style={{
            fontFamily: "'Cinzel', serif", fontSize: 11,
            letterSpacing: '0.2em', color: '#c9a85c',
            border: '0.5px solid #c9a85c', padding: '14px 28px',
            textDecoration: 'none', display: 'inline-block',
            background: 'transparent', minHeight: '44px',
          }}>
            READ THE JOURNAL
          </Link>
        </div>
      </section>

      {/* ── CLOSING QUOTE ─────────────────────────────────────────────────── */}
      <section style={{
        background: '#0e0b07',
        textAlign: 'center',
        borderTop: '0.5px solid #1a1410',
        borderBottom: '0.5px solid #1a1410',
      }} className="px-4 py-16">
        <FadeIn delay={0}>
        <div style={{
          fontFamily: "'Cinzel', serif", fontSize: 9,
          letterSpacing: '0.35em', color: '#3a2e1a',
          marginBottom: 28,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 8, color: '#c9a85c' }}>✦</span>
          A NOTE
          <span style={{ fontSize: 8, color: '#c9a85c' }}>✦</span>
        </div>
        <blockquote style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontStyle: 'italic', fontWeight: 300,
          color: '#c9a85c', lineHeight: 1.4,
          maxWidth: 600, margin: '0 auto 28px',
        }}>
          "Every good sentence is a small room with light coming in from the right."
        </blockquote>
        <Ornament />
        </FadeIn>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{
        background: '#080604',
        borderTop: '0.5px solid #1a1410',
      }} className="px-4 md:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12 mb-12">
          <div>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: 15,
              color: '#c9a85c', marginBottom: 6, letterSpacing: '0.1em',
            }}>
              E. Ashworth
            </p>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: '0.3em', color: '#3a2e1a', marginBottom: 14,
            }}>
              AUTHOR & POET · EST. MMXXIV
            </p>
            <p style={{ fontSize: 13, fontStyle: 'italic', color: '#4a3a20', lineHeight: 1.6 }}>
              For inquiries, speaking,<br />and correspondence.
            </p>
          </div>
          <div>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: '0.3em', color: '#5a4a2a', marginBottom: 16,
              textTransform: 'uppercase',
            }}>
              Navigation
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['/', 'Home'], ['/works', 'Works'], ['/about', 'About'], ['/journal', 'Journal']].map(([to, label]) => (
                <Link key={to} to={to} style={{ fontSize: 13, color: '#5a4a2a', textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: '0.3em', color: '#5a4a2a', marginBottom: 16,
              textTransform: 'uppercase',
            }}>
              Correspondence
            </p>
            <p style={{ fontSize: 13, color: '#6a5a3a', fontStyle: 'italic', marginBottom: 8 }}>
              eleanor@ashworthwrites.com
            </p>
            <p style={{ fontSize: 12, color: '#3a2e1a', lineHeight: 1.6 }}>
              For inquiries, speaking,<br />and correspondence.
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '0.5px solid #1a1410',
          paddingTop: 24,
        }} className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: '#2a2010' }}>
            © THE ASHWORTH ESTATE. ALL RIGHTS RESERVED.
          </span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: '#2a2010' }}>
            BUILT ON WORDS. WORN BY TIME.
          </span>
        </div>
      </footer>

    </div>
  )
}
