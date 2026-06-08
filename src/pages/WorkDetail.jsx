import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchWork, fetchPublishedChapters } from '../data/api'

// ── Atmospheric cover placeholders ────────────────────────────────────────────

function CoverPlaceholder({ category, accentColor }) {
  const cat = (category || '').toLowerCase()
  const c = accentColor || '#c9a84c'

  if (cat.includes('novel')) {
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <rect key={i}
            x={28 + i * 3} y={82 + i * 20}
            width={144 - i * 6} height={13}
            fill="none" stroke={c}
            strokeWidth={0.8 - i * 0.08}
            strokeOpacity={0.55 - i * 0.07}
          />
        ))}
        <line x1="58" y1="82" x2="52" y2="202" stroke={c} strokeWidth="0.5" strokeOpacity="0.22" />
        <path d="M100 38 L105 52 L100 66 L95 52 Z" fill="none" stroke={c} strokeWidth="0.8" strokeOpacity="0.5" />
        <circle cx="100" cy="52" r="2.5" fill={c} fillOpacity="0.4" />
        <line x1="38" y1="246" x2="162" y2="246" stroke={c} strokeWidth="0.4" strokeOpacity="0.12" />
      </svg>
    )
  }

  if (cat.includes('poetry')) {
    const lines = [
      { y: 72, x: 36, w: 110 }, { y: 94, x: 44, w: 78 },
      { y: 116, x: 36, w: 128 }, { y: 138, x: 52, w: 58 },
      { y: 160, x: 36, w: 98 }, { y: 182, x: 44, w: 86 },
      { y: 204, x: 36, w: 118 }, { y: 226, x: 56, w: 64 },
    ]
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice">
        {lines.map((l, i) => (
          <line key={i} x1={l.x} y1={l.y} x2={l.x + l.w} y2={l.y}
            stroke={c} strokeWidth="0.6" strokeOpacity={0.28 + (i % 3) * 0.1} />
        ))}
        <path d="M100 28 Q116 38 108 54 Q100 66 104 78"
          fill="none" stroke={c} strokeWidth="0.9" strokeOpacity="0.38" />
        <path d="M100 28 L98 37" fill="none" stroke={c} strokeWidth="0.5" strokeOpacity="0.3" />
        <path d="M30 260 Q60 248 90 256 Q122 264 152 250 Q172 242 184 250"
          fill="none" stroke={c} strokeWidth="0.5" strokeOpacity="0.18" />
      </svg>
    )
  }

  if (cat.includes('short')) {
    const dots = [[62,76],[124,62],[158,98],[84,128],[146,148],[48,172],[112,194],[172,116],[68,222],[136,232]]
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice">
        {dots.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="2.5" fill="none" stroke={c} strokeWidth="0.6" strokeOpacity="0.42" />
            {i < dots.length - 1 && (
              <line x1={x} y1={y} x2={dots[i + 1][0]} y2={dots[i + 1][1]}
                stroke={c} strokeWidth="0.3" strokeDasharray="3 5" strokeOpacity="0.18" />
            )}
          </g>
        ))}
        <circle cx="100" cy="150" r="14" fill="none" stroke={c} strokeWidth="0.5" strokeOpacity="0.22" />
        <circle cx="100" cy="150" r="10" fill="none" stroke={c} strokeWidth="0.25" strokeOpacity="0.14" />
        <line x1="100" y1="136" x2="100" y2="164" stroke={c} strokeWidth="0.45" strokeOpacity="0.28" />
        <line x1="86" y1="150" x2="114" y2="150" stroke={c} strokeWidth="0.45" strokeOpacity="0.28" />
      </svg>
    )
  }

  // Default — ornate diamond
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice">
      <line x1="40" y1="60" x2="160" y2="240" stroke={c} strokeWidth="0.35" strokeOpacity="0.08" />
      <line x1="160" y1="60" x2="40" y2="240" stroke={c} strokeWidth="0.35" strokeOpacity="0.08" />
      <path d="M100 78 L128 126 L100 174 L72 126 Z"
        fill="none" stroke={c} strokeWidth="0.9" strokeOpacity="0.48" />
      <path d="M100 92 L120 126 L100 160 L80 126 Z"
        fill="none" stroke={c} strokeWidth="0.45" strokeOpacity="0.28" />
      <circle cx="100" cy="126" r="6" fill={c} fillOpacity="0.22" />
      <circle cx="100" cy="126" r="2.5" fill={c} fillOpacity="0.45" />
      <line x1="34" y1="126" x2="80" y2="126" stroke={c} strokeWidth="0.4" strokeOpacity="0.22" />
      <line x1="120" y1="126" x2="166" y2="126" stroke={c} strokeWidth="0.4" strokeOpacity="0.22" />
      {[[40, 60], [160, 60], [40, 240], [160, 240]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill={c} fillOpacity="0.2" />
      ))}
    </svg>
  )
}

// ── Chapter row with hover state ──────────────────────────────────────────────

function ChapterRow({ chapter, index, workId }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link to={`/works/${workId}/chapter/${chapter.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 16px',
          borderBottom: '1px solid rgba(138,109,47,0.15)',
          background: hovered ? 'rgba(201,168,76,0.03)' : 'transparent',
          transition: 'background 0.2s ease',
          cursor: 'pointer',
        }}
      >
        {/* Number */}
        <span style={{
          fontSize: '11px', letterSpacing: '0.2em',
          color: '#8a6d2f', minWidth: '32px',
          fontFamily: "'Cinzel', serif",
          flexShrink: 0,
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Title + word count */}
        <div style={{ flex: 1, padding: '0 24px' }}>
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.05rem',
            fontStyle: 'italic',
            color: hovered ? '#c9a84c' : '#d4c4a8',
            marginBottom: chapter.wordCount > 0 ? '4px' : 0,
            transition: 'color 0.2s ease',
            lineHeight: 1.3,
          }}>
            {chapter.title}
          </p>
          {chapter.wordCount > 0 && (
            <p style={{
              fontSize: '10px', color: '#4a3f2e',
              letterSpacing: '0.12em',
            }}>
              {chapter.wordCount.toLocaleString()} words
            </p>
          )}
        </div>

        {/* Read → */}
        <span style={{
          fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: hovered ? '#c9a84c' : '#4a3f2e',
          fontFamily: "'Cinzel', serif",
          transition: 'color 0.2s ease',
          flexShrink: 0,
        }}>
          Read →
        </span>
      </div>
    </Link>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function WorkDetail() {
  const { workId } = useParams()
  const [work, setWork] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [w, ch] = await Promise.all([
          fetchWork(workId),
          fetchPublishedChapters(workId).catch(() => []),
        ])
        setWork(w)
        setChapters(ch)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [workId])

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0d0a05',
    }}>
      <p style={{ color: '#4a3f2e', letterSpacing: '0.35em', fontSize: '11px', fontFamily: "'Cinzel', serif" }}>
        CONSULTING THE ARCHIVE...
      </p>
    </div>
  )

  if (!work) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0a05' }}>
      <p style={{ color: '#4a3f2e', fontStyle: 'italic' }}>Work not found.</p>
    </div>
  )

  const isCompleted = work.storyStatus === 'completed'

  return (
    <div style={{ background: '#0d0a05', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(180deg, #1a1209 0%, #0d0a05 100%)',
        paddingTop: '120px',
        paddingBottom: '80px',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '2fr 3fr',
          gap: '64px',
          alignItems: 'start',
        }}>

          {/* Left — cover */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              aspectRatio: '2/3',
              background: '#1a1209',
              border: '1px solid rgba(201,168,76,0.25)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              overflow: 'hidden',
            }}>
              {work.cover_image ? (
                <img src={work.cover_image} alt={work.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <CoverPlaceholder category={work.category} accentColor={work.accent_color} />
              )}

              {/* Corner ornaments */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                viewBox="0 0 200 300" preserveAspectRatio="none">
                <path d="M0 26 L0 0 L26 0" fill="none" stroke="rgba(201,168,76,0.65)" strokeWidth="1.2"/>
                <path d="M200 26 L200 0 L174 0" fill="none" stroke="rgba(201,168,76,0.65)" strokeWidth="1.2"/>
                <path d="M0 274 L0 300 L26 300" fill="none" stroke="rgba(201,168,76,0.65)" strokeWidth="1.2"/>
                <path d="M200 274 L200 300 L174 300" fill="none" stroke="rgba(201,168,76,0.65)" strokeWidth="1.2"/>
                <rect x="8" y="8" width="184" height="284" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="0.5"/>
              </svg>
            </div>
          </div>

          {/* Right — info */}
          <div>
            {/* Category + status */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '22px' }}>
              <span style={{
                fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase',
                color: '#c9a84c', fontFamily: "'Cinzel', serif",
              }}>
                {work.category}
              </span>
              <span style={{
                fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase',
                padding: '3px 12px',
                border: '1px solid',
                borderColor: isCompleted ? 'rgba(74,164,74,0.4)' : 'rgba(201,168,76,0.35)',
                color: isCompleted ? '#4aa44a' : '#c9a84c',
              }}>
                {isCompleted ? '✓ Completed' : '◉ Ongoing'}
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
              color: '#f5edd6',
              fontStyle: 'italic',
              fontWeight: '400',
              lineHeight: 1.1,
              marginBottom: '16px',
            }}>
              {work.title}
            </h1>

            {work.year && (
              <p style={{
                fontSize: '10px', letterSpacing: '0.38em', textTransform: 'uppercase',
                color: '#8a6d2f', marginBottom: '24px',
                fontFamily: "'Cinzel', serif",
              }}>
                {work.year}
              </p>
            )}

            {/* Tags — hidden when empty */}
            {work.tags && work.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                {work.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
                    padding: '3px 12px',
                    border: '1px solid rgba(201,168,76,0.3)',
                    color: '#8a6d2f',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Excerpt — gold left border */}
            {work.excerpt && (
              <div style={{
                borderLeft: '2px solid rgba(201,168,76,0.4)',
                paddingLeft: '20px',
                marginBottom: '24px',
              }}>
                <p style={{
                  fontFamily: "'IM Fell English', Georgia, serif",
                  fontSize: '1.05rem',
                  fontStyle: 'italic',
                  color: '#a89070',
                  lineHeight: 1.75,
                }}>
                  {work.excerpt}
                </p>
              </div>
            )}

            {/* Description */}
            {work.description && (
              <p style={{
                fontFamily: "'Crimson Text', Georgia, serif",
                fontSize: '1.05rem',
                color: '#7a6d5a',
                lineHeight: 1.85,
                marginBottom: '36px',
              }}>
                {work.description}
              </p>
            )}

            {/* CTA */}
            {chapters.length > 0 ? (
              <div>
                <Link to={`/works/${workId}/chapter/${chapters[0].id}`}>
                  <button className="btn-gold" style={{ fontSize: '11px', letterSpacing: '0.3em', marginBottom: '14px' }}>
                    Begin Reading →
                  </button>
                </Link>
                <p style={{
                  fontSize: '11px', color: '#4a3f2e',
                  letterSpacing: '0.15em', fontFamily: "'Cinzel', serif",
                }}>
                  {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'} available
                </p>
              </div>
            ) : (
              <p style={{
                fontSize: '11px', color: '#4a3f2e',
                fontStyle: 'italic', letterSpacing: '0.12em',
              }}>
                Chapters forthcoming.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Chapter list ── */}
      {chapters.length > 0 && (
        <section style={{ background: '#0d0a05', padding: '60px 0 80px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>

            {/* Section header */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{
                fontSize: '9px', letterSpacing: '0.45em', textTransform: 'uppercase',
                color: '#4a3f2e', fontFamily: "'Cinzel', serif", marginBottom: '14px',
              }}>
                Table of Contents
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                <div style={{ height: '1px', width: '48px', background: 'rgba(138,109,47,0.3)' }}/>
                <span style={{ color: '#8a6d2f', fontSize: '10px' }}>✦</span>
                <div style={{ height: '1px', width: '48px', background: 'rgba(138,109,47,0.3)' }}/>
              </div>
            </div>

            {chapters.map((chapter, i) => (
              <ChapterRow key={chapter.id} chapter={chapter} index={i} workId={workId} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state when no chapters */}
      {chapters.length === 0 && (
        <section style={{ background: '#0d0a05', padding: '60px 0 80px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '28px' }}>
              <div style={{ height: '1px', width: '48px', background: 'rgba(138,109,47,0.2)' }}/>
              <span style={{ color: '#5a4f3e', fontSize: '10px' }}>✦</span>
              <div style={{ height: '1px', width: '48px', background: 'rgba(138,109,47,0.2)' }}/>
            </div>
            <p style={{
              fontFamily: "'IM Fell English', Georgia, serif",
              fontStyle: 'italic', color: '#4a3f2e', fontSize: '1rem',
            }}>
              Chapters forthcoming.
            </p>
          </div>
        </section>
      )}

    </div>
  )
}
