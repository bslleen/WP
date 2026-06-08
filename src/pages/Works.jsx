import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import booksImg       from '../assets/photo_2026-06-02 17.29.04.jpeg'
import deskImg        from '../assets/photo_2026-06-02 17.29.07.jpeg'
import manuscriptsImg from '../assets/photo_2026-06-02 17.41.58.jpeg'
import journalImg     from '../assets/photo_2026-06-02 17.41.55.jpeg'
import { fetchWorks } from '../data/api'
import { normalizeWork } from '../data/normalize'
import WorkCard, { StoneWall } from '../components/WorkCard'
import { useTheme } from '../themes/ThemeContext'

const CATEGORIES = ['All', 'Novel', 'Poetry', 'Short Story']

function Ornament() {
  const color = 'var(--accent-dim)'
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

export default function Works() {
  const { isCastle } = useTheme()
  const [works,   setWorks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('All')

  useEffect(() => {
    fetchWorks()
      .then(data => setWorks(data.map(normalizeWork)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All'
    ? works
    : works.filter(w => w.category?.toLowerCase() === filter.toLowerCase())

  return (
    <div style={{ background: 'var(--bg-primary)' }}>

      {!isCastle && (
        <div style={{
          paddingTop: '120px',
          paddingBottom: '48px',
          textAlign: 'center',
          borderBottom: '1px solid #ddd5c8',
          marginBottom: '60px',
          background: '#f5f0e8',
        }}>
          <p style={{
            fontSize: '0.65rem',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: '#8b5e3c',
            marginBottom: '16px',
          }}>
            The Archive
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '400',
            color: '#1c1917',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
          }}>
            Works
          </h1>
          <p style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: '1.1rem',
            color: '#6b5d4f',
            maxWidth: '400px',
            margin: '0 auto',
            lineHeight: '1.7',
          }}>
            Novels, poetry, and short fiction.
          </p>
        </div>
      )}

      {/* ════ HERO ════ */}
      <section className="works-page-hero works-gradient-hero" style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        <div className="works-hero-photo" style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${booksImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: 'brightness(0.38) sepia(0.25)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(100deg, rgba(13,10,5,0.92) 38%, rgba(13,10,5,0.3) 100%)',
        }} />

        <div
          className="relative z-10 w-full px-4 md:px-12 pt-28 md:pt-28"
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '0.6rem', letterSpacing: '0.4em',
            textTransform: 'uppercase', color: 'var(--accent)',
            marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{ opacity: 0.6 }}>·</span>
            Est. 2018
            <span style={{ opacity: 0.6 }}>·</span>
          </p>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--text-primary)',
            fontSize: 'clamp(2.2rem, 6vw, 4.4rem)',
            lineHeight: 1.12,
            fontWeight: 400,
            maxWidth: '540px',
            marginBottom: '1.5rem',
          }}>
            Timeless Words.<br />
            <em>Real Stories.</em>
          </h1>

          <p style={{
            fontFamily: "'Crimson Text', serif",
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            maxWidth: '340px',
            lineHeight: 1.75,
            marginBottom: '2.25rem',
          }}>
            Eleanor Ashworth writes novels, poetry, and short fiction.
            Inspired by memory, crafted with precision, made to endure.
          </p>

          <a
            href="#gallery"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text-primary)',
              fontSize: '0.68rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textDecorationColor: 'var(--accent)',
              textUnderlineOffset: '5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              minHeight: '44px',
            }}
          >
            EXPLORE THE ARCHIVE →
          </a>
        </div>
      </section>

      {/* ════ GALLERY ════ */}
      <section id="gallery" style={{
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 40px',
      }}>
        <StoneWall />

        {/* Warm top glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%)',
        }} />

        {/* Section title */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '40px' }}>
          <p style={{
            fontFamily: "'Cinzel', serif", fontSize: 9,
            letterSpacing: '0.35em', color: 'var(--text-muted)',
            marginBottom: 8, textTransform: 'uppercase',
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
            From the current collection.
          </p>
        </div>

        {/* Category filters */}
        <div className="category-filter" style={{
          position: 'relative', zIndex: 1,
          display: 'flex', justifyContent: 'center',
          gap: '12px', flexWrap: 'wrap',
          marginBottom: '52px',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={filter === cat ? 'active' : ''}
              style={{
                background: 'none',
                border: 'none',
                color: filter === cat ? 'var(--accent)' : 'var(--text-faint)',
                fontFamily: "'Cinzel', serif",
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontSize: '10px',
                padding: '4px 0',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => { if (filter !== cat) e.currentTarget.style.color = 'var(--accent-dim)' }}
              onMouseLeave={e => { if (filter !== cat) e.currentTarget.style.color = 'var(--text-faint)' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        {loading ? (
          <p style={{
            position: 'relative', zIndex: 1, textAlign: 'center',
            fontFamily: "'Cinzel', serif", fontSize: 9,
            letterSpacing: '0.3em', color: 'var(--text-secondary)', padding: '48px 0',
          }}>
            Consulting the archive…
          </p>
        ) : filtered.length === 0 ? (
          <p style={{
            position: 'relative', zIndex: 1, textAlign: 'center',
            fontFamily: "'IM Fell English', serif", fontStyle: 'italic',
            color: 'var(--text-faint)', fontSize: '1rem', padding: '64px 0', lineHeight: 1.9,
          }}>
            No works in this category yet.<br />The archive is being assembled.
          </p>
        ) : (
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexWrap: 'wrap',
            gap: '32px', justifyContent: 'center',
            paddingTop: '28px',
          }}>
            {filtered.map(work => (
              <Link key={work.id} to={`/works/${work.id}`} style={{ textDecoration: 'none' }}>
                <WorkCard work={work} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ════ BOTTOM PANELS ════ */}
      <div className="works-dark-panels grid grid-cols-1 md:grid-cols-3">

        {/* About the Author */}
        <div style={{
          position: 'relative',
          backgroundImage: `url(${deskImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
          borderTop: '1px solid var(--border)',
        }} className="px-10 py-14 flex flex-col items-center justify-center">
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,7,3,0.78)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--text-primary)',
            fontSize: '0.68rem',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            fontWeight: 400,
            marginBottom: '4px',
            textAlign: 'center',
          }}>
            ABOUT THE AUTHOR
          </h3>
          <Ornament />
          <p style={{
            fontFamily: "'Crimson Text', serif",
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            lineHeight: 1.8,
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}>
            We draw from old places, faded photographs, and the people
            who came before. Every sentence carries that spirit forward.
          </p>
          <Link
            to="/about"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text-primary)',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textDecorationColor: 'var(--accent)',
              textUnderlineOffset: '4px',
            }}
          >
            READ MORE →
          </Link>
          </div>
        </div>

        {/* Center image */}
        <div style={{ position: 'relative', minHeight: '320px', overflow: 'hidden' }}>
          <img
            src={manuscriptsImg}
            alt=""
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              filter: 'brightness(0.55) sepia(0.3)',
              display: 'block',
            }}
          />
        </div>

        {/* The Journal */}
        <div style={{
          position: 'relative',
          backgroundImage: `url(${journalImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          borderTop: '1px solid var(--border)',
          overflow: 'hidden',
        }} className="px-10 py-14 flex flex-col items-center justify-center">
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,5,2,0.80)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--text-primary)',
            fontSize: '0.68rem',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            fontWeight: 400,
            marginBottom: '4px',
            textAlign: 'center',
          }}>
            THE JOURNAL
          </h3>
          <Ornament />
          <p style={{
            fontFamily: "'Crimson Text', serif",
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            lineHeight: 1.8,
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}>
            Essays on craft, early access, and dispatches
            from the writing desk. Notes from the travels.
          </p>
          <Link
            to="/journal"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text-primary)',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textDecorationColor: 'var(--accent)',
              textUnderlineOffset: '4px',
            }}
          >
            EXPLORE JOURNAL →
          </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
