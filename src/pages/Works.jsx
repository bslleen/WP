import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'
import { fetchWorks } from '../data/api'
import { normalizeWork } from '../data/normalize'
import { works as mockWorks } from '../data/content'

// ── Book cover art rendered entirely in CSS/SVG ──────────────────────────────
function BookCoverArt({ work }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: `linear-gradient(150deg, ${work.coverColor} 0%, #080604 100%)`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '22px 18px',
      overflow: 'hidden',
    }}>
      {/* Outer inset border */}
      <div style={{
        position: 'absolute', inset: '10px',
        border: `1px solid ${work.accentColor}44`,
        pointerEvents: 'none',
      }} />
      {/* Corner marks */}
      {[['top:6px;left:6px', 'M1 10 L1 1 L10 1'], ['top:6px;right:6px', 'M15 10 L15 1 L6 1'], ['bottom:6px;left:6px', 'M1 6 L1 15 L10 15'], ['bottom:6px;right:6px', 'M15 6 L15 15 L6 15']].map(([pos, d], i) => (
        <svg key={i} viewBox="0 0 16 16" fill="none"
          style={{ position: 'absolute', width: '16px', height: '16px', ...Object.fromEntries(pos.split(';').map(p => p.split(':'))) }}>
          <path d={d} stroke={work.accentColor} strokeWidth="1" opacity="0.5" />
        </svg>
      ))}

      {/* Author */}
      <p style={{
        color: work.accentColor,
        fontSize: '0.5rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        fontFamily: "'Crimson Text', serif",
        opacity: 0.75,
        zIndex: 1,
      }}>
        Eleanor Ashworth
      </p>

      {/* Center ornament + title */}
      <div style={{ textAlign: 'center', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        {/* Top rule */}
        <div style={{ width: '55%', height: '1px', background: `linear-gradient(90deg, transparent, ${work.accentColor}99, transparent)` }} />

        {/* Diamond ornament */}
        <svg viewBox="0 0 24 12" style={{ width: '32px' }} fill="none">
          <path d="M12 1 L20 6 L12 11 L4 6 Z" stroke={work.accentColor} strokeWidth="0.7" opacity="0.6" fill={work.accentColor} fillOpacity="0.08" />
          <circle cx="12" cy="6" r="1.5" fill={work.accentColor} opacity="0.5" />
        </svg>

        {/* Title */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          color: '#f0e6c8',
          fontSize: work.title.length > 22 ? '0.85rem' : '1rem',
          fontStyle: 'italic',
          textAlign: 'center',
          lineHeight: 1.35,
          letterSpacing: '0.01em',
        }}>
          {work.title}
        </p>

        {/* Bottom rule */}
        <div style={{ width: '35%', height: '1px', background: `linear-gradient(90deg, transparent, ${work.accentColor}77, transparent)` }} />
      </div>

      {/* Category */}
      <p style={{
        color: work.accentColor,
        fontSize: '0.48rem',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        fontFamily: "'Crimson Text', serif",
        opacity: 0.6,
        zIndex: 1,
      }}>
        {work.category}
      </p>
    </div>
  )
}

// ── Single work card (matches Old Harbor product card exactly) ────────────────
function WorkCard({ work }) {
  return (
    <div
      style={{
        border: '1px solid #b8a98e',
        background: '#f0e8d8',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.18)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Image / cover area */}
      <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
        {work.cover_image
          ? <img src={work.cover_image} alt={work.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%) brightness(0.9)' }} />
          : <BookCoverArt work={work} />
        }

        {/* + button (top-right, same as screenshot) */}
        <button
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '28px', height: '28px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(4px)',
            color: '#f0e6c8',
            fontSize: '1.1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            lineHeight: 1,
            transition: 'background 0.2s',
            fontWeight: 300,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
        >
          +
        </button>

        {/* In Progress tag */}
        {work.status === 'In Progress' && (
          <div style={{
            position: 'absolute', bottom: '10px', left: '10px',
            background: 'rgba(13,10,5,0.75)',
            color: work.accentColor,
            fontSize: '0.5rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            padding: '3px 9px',
            border: `1px solid ${work.accentColor}44`,
            fontFamily: "'Playfair Display', serif",
          }}>
            In Progress
          </div>
        )}
      </div>

      {/* Card info */}
      <div style={{ padding: '14px 16px 18px', borderTop: '1px solid #c8b89a' }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          color: '#1c140a',
          fontSize: '0.95rem',
          fontWeight: 400,
          lineHeight: 1.3,
          marginBottom: '4px',
        }}>
          {work.title}
        </p>
        <p style={{
          fontFamily: "'Crimson Text', serif",
          fontStyle: 'italic',
          color: '#7a6548',
          fontSize: '0.85rem',
          marginBottom: '5px',
        }}>
          {work.category} · {work.year}
        </p>
        <p style={{
          fontFamily: "'Crimson Text', serif",
          color: '#1c140a',
          fontSize: '0.85rem',
          fontWeight: 400,
        }}>
          {work.pages > 0 ? `${work.pages} pages` : 'Coming Soon'}
        </p>
      </div>
    </div>
  )
}

// ── Ornamental section divider ────────────────────────────────────────────────
function Ornament({ dark = false }) {
  const color = dark ? '#8a7a65' : '#8a7a65'
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

// ── Main Works page ───────────────────────────────────────────────────────────
export default function Works() {
  const [featured, setFeatured] = useState(mockWorks.slice(0, 4).map(normalizeWork))

  useEffect(() => {
    fetchWorks({ status: 'published' })
      .then(data => setFeatured(data.slice(0, 4).map(normalizeWork)))
      .catch(() => {})
  }, [])

  return (
    <div style={{ background: '#0d0a05' }}>

      {/* ════ HERO ════ */}
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Background photo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          filter: 'brightness(0.38) sepia(0.2)',
        }} />
        {/* Left-to-right fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(100deg, rgba(13,10,5,0.92) 38%, rgba(13,10,5,0.3) 100%)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 3rem', paddingTop: '7rem',
          width: '100%',
        }}>
          {/* Est. marker */}
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '0.6rem', letterSpacing: '0.4em',
            textTransform: 'uppercase', color: '#c9a84c',
            marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{ opacity: 0.6 }}>·</span>
            Est. 2018
            <span style={{ opacity: 0.6 }}>·</span>
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: '#f0e6c8',
            fontSize: 'clamp(2.6rem, 5vw, 4.4rem)',
            lineHeight: 1.12,
            fontWeight: 400,
            maxWidth: '540px',
            marginBottom: '1.5rem',
          }}>
            Timeless Words.<br />
            <em>Real Stories.</em>
          </h1>

          {/* Subline */}
          <p style={{
            fontFamily: "'Crimson Text', serif",
            color: '#a89060',
            fontSize: '1.05rem',
            maxWidth: '340px',
            lineHeight: 1.75,
            marginBottom: '2.25rem',
          }}>
            Eleanor Ashworth writes novels, poetry, and short fiction.
            Inspired by memory, crafted with precision, made to endure.
          </p>

          {/* CTA */}
          <Link
            to="/works/all"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#f0e6c8',
              fontSize: '0.68rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textDecorationColor: '#c9a84c',
              textUnderlineOffset: '5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            EXPLORE THE ARCHIVE →
          </Link>
        </div>
      </section>

      {/* ════ FEATURED WORKS — parchment section ════ */}
      <section style={{
        background: '#e8dcc8',
        padding: '5rem 3rem 5.5rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Section header */}
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
              FEATURED WORKS
            </h2>
            <Ornament />
            <p style={{
              fontFamily: "'Crimson Text', serif",
              fontStyle: 'italic',
              color: '#7a6548',
              fontSize: '1.05rem',
            }}>
              From the current collection.
            </p>
          </div>

          {/* View all — right aligned */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.75rem' }}>
            <Link
              to="/works/all"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#1c140a',
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              VIEW ALL WORKS →
            </Link>
          </div>

          {/* 4-column book card grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem',
          }}>
            {featured.map(work => <WorkCard key={work.id} work={work} />)}
          </div>
        </div>
      </section>

      {/* ════ BOTTOM PANELS ════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>

        {/* About the Author */}
        <div style={{
          background: '#1a1209',
          padding: '3.5rem 2.75rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 0,
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            color: '#f0e6c8',
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
            color: '#a89060',
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
              color: '#f0e6c8',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textDecorationColor: '#c9a84c',
              textUnderlineOffset: '4px',
            }}
          >
            READ MORE →
          </Link>
        </div>

        {/* Center image */}
        <div style={{ position: 'relative', minHeight: '420px', overflow: 'hidden' }}>
          <img
            src={heroImg}
            alt=""
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              filter: 'brightness(0.48) sepia(0.35)',
              display: 'block',
            }}
          />
        </div>

        {/* The Journal */}
        <div style={{
          background: '#1a1209',
          padding: '3.5rem 2.75rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            color: '#f0e6c8',
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
            color: '#a89060',
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
              color: '#f0e6c8',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textDecorationColor: '#c9a84c',
              textUnderlineOffset: '4px',
            }}
          >
            EXPLORE JOURNAL →
          </Link>
        </div>
      </div>

    </div>
  )
}
