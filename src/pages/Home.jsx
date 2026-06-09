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
  const dot = { width: 5, height: 5, border: '0.5px solid var(--bg-tertiary)', transform: 'rotate(45deg)' }
  const sm  = { width: 3, height: 3, border: '0.5px solid var(--text-faint)', transform: 'rotate(45deg)' }
  const filled = { ...dot, background: 'var(--accent)', borderColor: 'var(--accent)' }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center', margin: '0 0 48px' }}>
      <div style={sm} /><div style={dot} /><div style={sm} />
      <div style={filled} />
      <div style={sm} /><div style={dot} /><div style={sm} />
    </div>
  )
}

const DAILY_QUOTES = [
  { content: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
  { content: "Fill your paper with the breathings of your heart.", author: "William Wordsworth" },
  { content: "The purpose of a writer is to keep civilization from destroying itself.", author: "Albert Camus" },
  { content: "You can always edit a bad page. You can't edit a blank page.", author: "Jodi Picoult" },
  { content: "A word after a word after a word is power.", author: "Margaret Atwood" },
  { content: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { content: "One must always be careful of books, and what is inside them, for words have the power to change us.", author: "Cassandra Clare" },
  { content: "The most courageous act is still to think for yourself. Aloud.", author: "Coco Chanel" },
  { content: "We are all of us stars, and we deserve to twinkle.", author: "Marilyn Monroe" },
  { content: "If you only read the books that everyone else is reading, you can only think what everyone else is thinking.", author: "Haruki Murakami" },
  { content: "I am not afraid of storms, for I am learning how to sail my ship.", author: "Louisa May Alcott" },
  { content: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { content: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { content: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
  { content: "Writing is the painting of the voice.", author: "Voltaire" },
  { content: "You don't write because you want to say something; you write because you have something to say.", author: "F. Scott Fitzgerald" },
  { content: "The road to hell is paved with adverbs.", author: "Stephen King" },
  { content: "Start writing, no matter what. The water does not flow until the faucet is turned on.", author: "Louis L'Amour" },
  { content: "Every secret of a writer's soul, every experience of his life, every quality of his mind, is written large in his works.", author: "Virginia Woolf" },
  { content: "A story has no beginning or end; arbitrarily one chooses that moment of experience from which to look back or from which to look ahead.", author: "Graham Greene" },
  { content: "Literature is the art of discovering something extraordinary about ordinary people, and saying with ordinary words something extraordinary.", author: "Boris Pasternak" },
  { content: "The greatest part of a writer's time is spent in reading, in order to write.", author: "Samuel Johnson" },
]

function DailyQuote() {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('daily_quote')
    if (cached) {
      setQuote(JSON.parse(cached))
      setLoading(false)
      return
    }

    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    const fallback = DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length]

    fetch('/api/quote')
      .then(r => r.json())
      .then(data => {
        if (data.content && data.author) {
          sessionStorage.setItem('daily_quote', JSON.stringify(data))
          setQuote(data)
        } else {
          setQuote(fallback)
        }
      })
      .catch(() => setQuote(fallback))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{
      border: '1px solid rgba(138,109,47,0.4)',
      padding: '28px 32px',
      background: 'rgba(26,18,9,0.6)',
      backdropFilter: 'blur(4px)',
      position: 'relative',
      minHeight: '120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <p style={{
        fontSize: '9px',
        letterSpacing: '0.45em',
        textTransform: 'uppercase',
        color: '#8a6d2f',
        marginBottom: '16px',
      }}>
        ✦ &nbsp; Today's Ink &nbsp; ✦
      </p>

      {loading ? (
        <p style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: '1rem',
          fontStyle: 'italic',
          color: 'rgba(138,109,47,0.4)',
          letterSpacing: '0.05em',
        }}>
          Consulting the archive...
        </p>
      ) : (
        <div>
          <p style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: '1.05rem',
            fontStyle: 'italic',
            color: '#d4c49a',
            lineHeight: '1.75',
            marginBottom: '14px',
          }}>
            "{quote?.content}"
          </p>
          <p style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#8a6d2f',
          }}>
            — {quote?.author}
          </p>
        </div>
      )}
    </div>
  )
}

/* ── Castle Gallery Components ───────────────────────────────────────────── */

function AtmosphericSVG({ category, accentColor }) {
  const c = accentColor || 'var(--accent-dim)'
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
        <circle cx="165" cy="30" r="15" fill="var(--bg-primary)" />
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
      className="stone-texture stone-wall-texture"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="stonePattern" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="240" y2="0" stroke="var(--bg-secondary)" strokeWidth="0.5" />
          <line x1="0" y1="120" x2="240" y2="120" stroke="var(--bg-secondary)" strokeWidth="0.5" />
          <line x1="80" y1="0" x2="80" y2="120" stroke="var(--bg-secondary)" strokeWidth="0.5" />
          <line x1="200" y1="0" x2="200" y2="120" stroke="var(--bg-secondary)" strokeWidth="0.5" />
          <line x1="40" y1="120" x2="40" y2="240" stroke="var(--bg-secondary)" strokeWidth="0.5" />
          <line x1="140" y1="120" x2="140" y2="240" stroke="var(--bg-secondary)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stonePattern)" opacity="0.6" />
    </svg>
  )
}

function SideFrameSVG() {
  return (
    <svg className="frame-ornament" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} viewBox="0 0 200 280" preserveAspectRatio="none">
      <rect x="0" y="0" width="200" height="280" fill="none" stroke="var(--accent-dim)" strokeWidth="1.5"/>
      <rect x="6" y="6" width="188" height="268" fill="none" stroke="var(--accent)" strokeWidth="0.5"/>
      <rect x="10" y="10" width="180" height="260" fill="none" stroke="var(--accent-dim)" strokeWidth="0.3"/>
      <circle cx="0" cy="0" r="3" fill="var(--accent)"/>
      <circle cx="200" cy="0" r="3" fill="var(--accent)"/>
      <circle cx="0" cy="280" r="3" fill="var(--accent)"/>
      <circle cx="200" cy="280" r="3" fill="var(--accent)"/>
      <path d="M0 18 L0 0 L18 0" fill="none" stroke="var(--accent)" strokeWidth="1"/>
      <path d="M200 18 L200 0 L182 0" fill="none" stroke="var(--accent)" strokeWidth="1"/>
      <path d="M0 262 L0 280 L18 280" fill="none" stroke="var(--accent)" strokeWidth="1"/>
      <path d="M200 262 L200 280 L182 280" fill="none" stroke="var(--accent)" strokeWidth="1"/>
      <circle cx="100" cy="0" r="2" fill="var(--accent-dim)"/>
      <circle cx="100" cy="280" r="2" fill="var(--accent-dim)"/>
      <circle cx="0" cy="140" r="2" fill="var(--accent-dim)"/>
      <circle cx="200" cy="140" r="2" fill="var(--accent-dim)"/>
    </svg>
  )
}

function CenterFrameSVG() {
  return (
    <svg className="frame-ornament" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} viewBox="0 0 220 308" preserveAspectRatio="none">
      <rect x="0" y="0" width="220" height="308" fill="none" stroke="var(--accent)" strokeWidth="2"/>
      <rect x="6" y="6" width="208" height="296" fill="none" stroke="var(--accent)" strokeWidth="0.5"/>
      <rect x="10" y="10" width="200" height="288" fill="none" stroke="var(--accent-dim)" strokeWidth="0.3"/>
      <circle cx="0" cy="0" r="4" fill="var(--accent)"/>
      <circle cx="220" cy="0" r="4" fill="var(--accent)"/>
      <circle cx="0" cy="308" r="4" fill="var(--accent)"/>
      <circle cx="220" cy="308" r="4" fill="var(--accent)"/>
      <path d="M0 18 L0 0 L18 0" fill="none" stroke="var(--accent)" strokeWidth="1"/>
      <path d="M220 18 L220 0 L202 0" fill="none" stroke="var(--accent)" strokeWidth="1"/>
      <path d="M0 290 L0 308 L18 308" fill="none" stroke="var(--accent)" strokeWidth="1"/>
      <path d="M220 290 L220 308 L202 308" fill="none" stroke="var(--accent)" strokeWidth="1"/>
      <circle cx="110" cy="0" r="2" fill="var(--accent-dim)"/>
      <circle cx="110" cy="308" r="2" fill="var(--accent-dim)"/>
      <circle cx="0" cy="154" r="2" fill="var(--accent-dim)"/>
      <circle cx="220" cy="154" r="2" fill="var(--accent-dim)"/>
      <path d="M106 0 L110 -4 L114 0 L110 4 Z" fill="var(--accent)"/>
      <path d="M106 308 L110 304 L114 308 L110 312 Z" fill="var(--accent)"/>
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
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      width: '100%',
      overflowX: 'hidden',
    }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="hero-section relative grid grid-cols-1 lg:grid-cols-2 items-center pt-20 pb-12 lg:px-10 lg:pt-24 gap-8 lg:gap-16"
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
        <div className="hero-bg-photo hero-bg-image" style={{
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
        <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: "'Cinzel', serif", fontSize: 10,
            letterSpacing: '0.35em', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
          }}>
            <span style={{ flex: 1, maxWidth: 40, height: '0.5px', background: 'var(--text-faint)', display: 'inline-block' }} />
            AUTHOR & POET
            <span style={{ flex: 1, maxWidth: 40, height: '0.5px', background: 'var(--text-faint)', display: 'inline-block' }} />
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.4rem, 8vw, 3.9rem)', fontWeight: 300, lineHeight: 1.1,
            color: 'var(--text-primary)', marginBottom: 6,
          }}>
            Words that<br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent)', fontSize: 'clamp(2.6rem, 9vw, 4.3rem)' }}>endure</em><br />
            the dark.
          </h1>

          <div style={{ width: 40, height: '0.5px', background: 'var(--accent)', margin: '28px 0' }} />

          <p style={{
            fontSize: 17, lineHeight: 1.8, color: 'var(--text-secondary)',
            maxWidth: 380, marginBottom: 36,
          }}>
            E. Ashworth wrote novels, poems, and stories that lived
            in the borderlands between the known and the vanished. The archive
            was discovered in 1923. The candle was still warm.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/works" style={{
              fontFamily: "'Cinzel', serif", fontSize: 11,
              letterSpacing: '0.2em', color: 'var(--accent)',
              border: '0.5px solid var(--accent)', padding: '14px 28px',
              textDecoration: 'none', background: 'transparent',
              minHeight: '44px', display: 'flex', alignItems: 'center',
            }}>
              VIEW THE WORKS
            </Link>
            <Link to="/about" style={{
              fontFamily: "'Cinzel', serif", fontSize: 11,
              letterSpacing: '0.2em', color: 'var(--text-muted)', textDecoration: 'none',
              minHeight: '44px', display: 'flex', alignItems: 'center',
            }}>
              About the Author →
            </Link>
          </div>
        </div>

        {/* Right — hidden on mobile */}
        <div className="hidden lg:flex flex-col gap-4" style={{ position: 'relative', zIndex: 1 }}>
          <DailyQuote />

          <div className="hero-tagline-box" style={{
            border: '0.5px solid var(--text-faint)', padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
            fontSize: 14, color: 'var(--text-faint)', fontStyle: 'italic',
          }}>
            <span style={{ color: 'var(--accent)', fontStyle: 'normal', fontSize: 18 }}>✦</span>
            Study. Read. Discover. — <em style={{ color: 'var(--text-faint)', marginLeft: 4 }}>The work itself.</em>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Cinzel', serif", fontSize: 9,
          letterSpacing: '0.3em', color: 'var(--text-faint)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          zIndex: 1,
        }}>
          <span>SCROLL</span>
          <div style={{ width: '0.5px', height: 40, background: 'var(--text-faint)' }} />
        </div>
      </section>

      {/* ── COLLECTION ────────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--bg-primary)',
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
              letterSpacing: '0.35em', color: 'var(--text-muted)', marginBottom: 8,
              textTransform: 'uppercase',
            }}>
              THE COLLECTION
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36, fontWeight: 400,
              color: 'var(--text-primary)', lineHeight: 1,
            }}>
              The Archive
            </h2>
            <p style={{
              fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
              fontSize: 15, color: 'var(--text-muted)', marginTop: 6,
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
            letterSpacing: '0.3em', color: 'var(--text-secondary)', padding: '48px 0',
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
              const accent = work.accentColor || 'var(--accent-dim)'

              return (
                <FadeIn key={work.id} delay={0.12 * i}>
                  <Link to={`/works/${work.id}`} style={{ textDecoration: 'none' }}>
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
                      {/* Floor spotlight glow */}
                      <div style={{
                        position: 'absolute',
                        bottom: isCenter ? '-38px' : '-32px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: isCenter ? '180px' : '150px',
                        height: isCenter ? '48px' : '38px',
                        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.18) 0%, transparent 70%)',
                        pointerEvents: 'none',
                        zIndex: 0,
                      }} />
                      {/* Featured label */}
                      <div style={{
                        position: 'absolute',
                        top: isCenter ? '-48px' : '-42px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap',
                        fontFamily: "'Cinzel', serif",
                        fontSize: '7px',
                        letterSpacing: '0.3em',
                        color: 'rgba(201,168,76,0.55)',
                        textTransform: 'uppercase',
                      }}>
                        ✦ Featured
                      </div>
                      {/* Hanging wire */}
                      <div className="frame-wire" style={{
                        position: 'absolute', top: '-20px', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '1px', height: '20px',
                        background: 'linear-gradient(to bottom, transparent, var(--accent-dim))',
                      }} />
                      <div className="frame-wire" style={{
                        position: 'absolute', top: '-22px', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '6px', height: '6px', borderRadius: '50%',
                        border: '1px solid var(--accent-dim)', background: 'transparent',
                      }} />

                      {/* Card wrapper — SVG frame overlays this */}
                      <div style={{ position: 'relative', width: `${w}px` }}>

                        {/* Painting card */}
                        <div className="frame-card" style={{
                          background: 'var(--bg-secondary)',
                          overflow: 'hidden',
                          boxShadow: hoveredIdx === i
                            ? 'var(--card-shadow)'
                            : '0 10px 50px rgba(0,0,0,0.5)',
                          transition: 'box-shadow 0.4s ease',
                        }}>
                          {/* Image area */}
                          <div style={{
                            height: `${imgH}px`,
                            background: work.cover_image
                              ? `url(${work.cover_image}) center/cover`
                              : `linear-gradient(135deg, var(--bg-tertiary), var(--bg-primary))`,
                            position: 'relative',
                          }}>
                            <div style={{
                              position: 'absolute', inset: 0,
                              background: 'radial-gradient(ellipse at center, transparent 30%, var(--bg-primary) 100%)',
                            }} />
                            {!work.cover_image && (
                              <AtmosphericSVG category={work.category} accentColor={accent} />
                            )}
                          </div>

                          {/* Gold separator */}
                          <div style={{
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, var(--border-strong), transparent)',
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
                              fontFamily: "var(--font-heading)",
                              fontSize: '16px', fontStyle: 'italic',
                              color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.3,
                            }}>
                              {work.title}
                            </h3>
                            <p style={{
                              fontFamily: "var(--font-accent)",
                              fontSize: '11px', fontStyle: 'italic',
                              color: 'var(--accent-dim)', marginBottom: '10px', lineHeight: 1.5,
                            }}>
                              "{work.excerpt?.substring(0, 55)}…"
                            </p>
                            <div style={{
                              display: 'flex', justifyContent: 'space-between',
                              borderTop: '1px solid var(--border)', paddingTop: '8px',
                            }}>
                              <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                                {work.year}
                              </span>
                              <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-faint)', textTransform: 'uppercase' }}>
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
            letterSpacing: '0.2em', color: 'var(--accent)',
            border: '0.5px solid var(--accent)', padding: '14px 28px',
            textDecoration: 'none', background: 'transparent',
            display: 'inline-block', minHeight: '44px',
          }}>
            VIEW ALL WORKS →
          </Link>
        </div>
      </section>

      {/* ── JOURNAL ───────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-primary)' }} className="px-4 md:px-10 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <FadeIn delay={0}>
          <div>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: '0.35em', color: 'var(--text-muted)', marginBottom: 8,
              textTransform: 'uppercase',
            }}>
              FROM THE JOURNAL
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic', fontWeight: 300, fontSize: 42,
              color: 'var(--text-primary)',
            }}>
              Recent Entries
            </h2>
          </div>
          </FadeIn>
        </div>

        <Ornament />

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 1, border: '0.5px solid var(--border)' }}>
          {journal.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--text-faint)' }}>
              Consulting the archive…
            </div>
          )}
          {journal.map((entry, i) => (
            <FadeIn key={entry.id} delay={0.15 * i}>
            <div style={{
              padding: 32,
              borderRight: i === 0 ? '0.5px solid var(--border)' : 'none',
              borderBottom: i === 0 ? '0.5px solid var(--border)' : 'none',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}
            className="journal-preview-card md:[&]:border-b-0">
              <p style={{
                fontFamily: "'Cinzel', serif", fontSize: 9,
                letterSpacing: '0.3em', color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}>
                {entry.category || 'Journal'}
              </p>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24, fontStyle: 'italic',
                color: 'var(--text-primary)', fontWeight: 400,
              }}>
                {entry.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, flex: 1 }}>
                {entry.excerpt || (entry.body ? entry.body.substring(0, 140) + '…' : '')}
              </p>
              <Link to="/journal" className="read-link" style={{
                fontFamily: "'Cinzel', serif", fontSize: 10,
                letterSpacing: '0.2em', color: 'var(--text-muted)',
                alignSelf: 'flex-start',
                borderBottom: '0.5px solid var(--border)', paddingBottom: 2,
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
            letterSpacing: '0.2em', color: 'var(--accent)',
            border: '0.5px solid var(--accent)', padding: '14px 28px',
            textDecoration: 'none', display: 'inline-block',
            background: 'transparent', minHeight: '44px',
          }}>
            READ THE JOURNAL
          </Link>
        </div>
      </section>

      {/* ── CLOSING QUOTE ─────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--bg-primary)',
        textAlign: 'center',
        borderTop: '0.5px solid var(--border)',
        borderBottom: '0.5px solid var(--border)',
      }} className="closing-quote-section px-4 py-16">
        <FadeIn delay={0}>
        <div style={{
          fontFamily: "'Cinzel', serif", fontSize: 9,
          letterSpacing: '0.35em', color: 'var(--text-faint)',
          marginBottom: 28,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 8, color: 'var(--accent)' }}>✦</span>
          A NOTE
          <span style={{ fontSize: 8, color: 'var(--accent)' }}>✦</span>
        </div>
        <blockquote style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontStyle: 'italic', fontWeight: 300,
          color: 'var(--accent)', lineHeight: 1.4,
          maxWidth: 600, margin: '0 auto 28px',
        }}>
          "Every good sentence is a small room with light coming in from the right."
        </blockquote>
        <Ornament />
        </FadeIn>
      </section>

    </div>
  )
}
