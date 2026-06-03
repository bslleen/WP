import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchWorks, fetchJournal } from '../data/api'
import { normalizeWork, normalizeJournal } from '../data/normalize'
import { featuredWorks as mockWorks, journalEntries as mockJournal } from '../data/content'
import heroBg          from '../assets/study.jpg'
import FadeIn          from '../components/FadeIn'
import parchmentBg     from '../assets/parchment.jpg'
import cardManuscripts from '../assets/card-manuscripts.jpg'
import cardQuill       from '../assets/card-quill.jpg'
import cardBooks       from '../assets/card-books.jpg'
import booksAlt        from '../assets/books.jpg'

const CARD_PHOTOS = {
  'Novel':       cardManuscripts,
  'novel':       cardManuscripts,
  'Poetry':      cardQuill,
  'poetry':      cardQuill,
  'Short Story': cardBooks,
  'short story': cardBooks,
}

// ─── font injection ───────────────────────────────────────────────────────────
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

// ─── category emoji placeholder ──────────────────────────────────────────────
const CATEGORY_EMOJI = {
  'Novel':       '📖',
  'novel':       '📖',
  'Poetry':      '🪶',
  'poetry':      '🪶',
  'Short Story': '🗺',
  'short story': '🗺',
}

// ─── Ornament row ─────────────────────────────────────────────────────────────
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

// ─── Work card ────────────────────────────────────────────────────────────────
function WorkCard({ work, loading }) {
  const hasPhoto = work.cover_image && work.cover_image.trim() !== ''
  return (
    <div style={{ background: '#fff', cursor: 'pointer', opacity: loading ? 0.45 : 1, transition: 'opacity 0.3s' }}>
      {/* Image area */}
      {hasPhoto ? (
        <img
          src={work.cover_image}
          alt={work.title}
          style={{
            width: '100%', aspectRatio: '4/3', objectFit: 'cover',
            display: 'block', filter: 'sepia(30%) brightness(0.9)',
          }}
        />
      ) : (
        <div style={{
          width: '100%', aspectRatio: '4/3',
          backgroundImage: `url(${CARD_PHOTOS[work.category] || booksAlt})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'sepia(30%) brightness(0.9)',
        }} />
      )}

      {/* Info block */}
      <div style={{ padding: 20, background: '#faf6ed' }}>
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: 9,
          letterSpacing: '0.3em', color: '#8a7a5a', marginBottom: 8,
          textTransform: 'uppercase',
        }}>
          {work.category}
        </p>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 21, fontWeight: 500, color: '#1a140a', marginBottom: 6,
        }}>
          {work.title}
        </h3>
        <p style={{
          fontSize: 13, fontStyle: 'italic', color: '#7a6a4a',
          marginBottom: 8, lineHeight: 1.5,
        }}>
          {work.description ? work.description.substring(0, 70) + '…' : ''}
        </p>
        <p style={{ fontSize: 13, color: '#5a4a2a', lineHeight: 1.5, marginBottom: 14 }}>
          "{work.excerpt ? work.excerpt.substring(0, 55) + '…' : ''}"
        </p>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'Cinzel', serif", fontSize: 10,
          letterSpacing: '0.15em', color: '#8a7a5a',
          borderTop: '0.5px solid #e0d8c8', paddingTop: 12,
        }}>
          <span>{work.year}</span>
          <span>{work.pages > 0 ? `${work.pages} pp.` : 'In progress'}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Home() {
  useFonts()

  const [works,   setWorks]   = useState(mockWorks.slice(0, 3).map(normalizeWork))
  const [journal, setJournal] = useState(mockJournal.slice(0, 2).map(normalizeJournal))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchWorks({ status: 'published' })
      .then(data => { if (data.length > 0) setWorks(data.slice(0, 3).map(normalizeWork)) })
      .catch(() => {})
      .finally(() => setLoading(false))
    fetchJournal()
      .then(data => { if (data.length > 0) setJournal(data.slice(0, 2).map(normalizeJournal)) })
      .catch(() => {})
  }, [])

  const root = {
    fontFamily: "'EB Garamond', Georgia, serif",
    background: '#0e0b07',
    color: '#d4c4a0',
    width: '100%',
    overflowX: 'hidden',
  }

  return (
    <div style={root}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '92vh',
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        padding: '80px 40px 60px',
        gap: 60,
        position: 'relative',
        overflow: 'hidden',
      }}>
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
            fontSize: 62, fontWeight: 300, lineHeight: 1.1,
            color: '#e8dcc0', marginBottom: 6,
          }}>
            Words that<br />
            <em style={{ fontStyle: 'italic', color: '#c9a85c', fontSize: 68 }}>endure</em><br />
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link to="/works" style={{
              fontFamily: "'Cinzel', serif", fontSize: 11,
              letterSpacing: '0.2em', color: '#c9a85c',
              border: '0.5px solid #c9a85c', padding: '14px 28px',
              textDecoration: 'none', background: 'transparent',
            }}>
              VIEW THE WORKS
            </Link>
            <Link to="/about" style={{
              fontFamily: "'Cinzel', serif", fontSize: 11,
              letterSpacing: '0.2em', color: '#7a6a4a', textDecoration: 'none',
            }}>
              About the Author →
            </Link>
          </div>
        </div>

        {/* Right */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
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
      <section style={{ background: '#f5eedf', padding: '80px 40px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', marginBottom: 48,
        }}>
          <FadeIn delay={0}>
          <div>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: '0.35em', color: '#8a7a5a', marginBottom: 8,
              textTransform: 'uppercase',
            }}>
              THE COLLECTION
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36, fontWeight: 400,
              color: '#2a1e0a', lineHeight: 1,
            }}>
              The Archive
            </h2>
            <p style={{
              fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
              fontSize: 15, color: '#8a7a5a', marginTop: 6,
            }}>
              Works from the current archive.
            </p>
          </div>
          </FadeIn>
          <Link to="/works" style={{
            fontFamily: "'Cinzel', serif", fontSize: 10,
            letterSpacing: '0.2em', color: '#5a4a2a',
            textDecoration: 'underline', textUnderlineOffset: 4,
            whiteSpace: 'nowrap', marginBottom: 4,
          }}>
            VIEW ALL WORKS →
          </Link>
        </div>

        {/* 3-column card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {works.map((work, index) => (
            <FadeIn key={work.id} delay={0.1 * index}>
              <Link to="/works" style={{ textDecoration: 'none' }}>
                <WorkCard work={work} loading={loading} />
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── JOURNAL ───────────────────────────────────────────────────────── */}
      <section style={{ background: '#0e0b07', padding: '80px 40px' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', marginBottom: 48,
        }}>
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

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 1, border: '0.5px solid #2a2010',
        }}>
          {journal.map((entry, i) => (
            <FadeIn key={entry.id} delay={0.15 * i}>
            <div style={{
              padding: 32,
              borderRight: i === 0 ? '0.5px solid #2a2010' : 'none',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
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
                textDecoration: 'none',
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
            background: 'transparent',
          }}>
            READ THE JOURNAL
          </Link>
        </div>
      </section>

      {/* ── CLOSING QUOTE ─────────────────────────────────────────────────── */}
      <section style={{
        background: '#0e0b07', padding: '64px 40px',
        textAlign: 'center',
        borderTop: '0.5px solid #1a1410',
        borderBottom: '0.5px solid #1a1410',
      }}>
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
          fontSize: 32, fontStyle: 'italic', fontWeight: 300,
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
        background: '#080604', padding: '60px 40px 32px',
        borderTop: '0.5px solid #1a1410',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
          gap: 48, marginBottom: 48,
        }}>
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
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
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
