import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { OrnateDivider, OrnateFrame, SectionTitle } from '../components/OrnateElements'
import { fetchWorks, fetchJournal } from '../data/api'
import { normalizeWork, normalizeJournal } from '../data/normalize'
import { featuredWorks as mockWorks, journalEntries as mockJournal } from '../data/content'
import heroBg        from '../assets/study.jpg'
import parchmentBg   from '../assets/parchment.jpg'
import cardQuill     from '../assets/card-quill.jpg'
import cardManuscripts from '../assets/card-manuscripts.jpg'
import cardBooks     from '../assets/card-books.jpg'
import cardBooksAlt  from '../assets/books.jpg'

const CARD_PHOTOS = {
  'Novel':       cardManuscripts,
  'novel':       cardManuscripts,
  'Poetry':      cardQuill,
  'poetry':      cardQuill,
  'Short Story': cardBooks,
  'short story': cardBooks,
}

function HeroSection() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

      {/* ── Photo background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        filter: 'brightness(0.38) sepia(0.35) saturate(1.2) contrast(1.05)',
      }} />

      {/* ── Layered dark overlays ── */}
      {/* Base darkening */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, rgba(8,5,2,0.78) 0%, rgba(8,5,2,0.35) 55%, rgba(8,5,2,0.7) 100%)',
      }} />
      {/* Bottom fade to solid */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 55%, rgba(8,5,2,0.95) 100%)',
      }} />
      {/* Edge vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 110% 100% at 50% 50%, transparent 38%, rgba(0,0,0,0.72) 100%)',
      }} />
      {/* Warm candle glow — lower right, like a lamp on a desk */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 45% 38% at 72% 68%, rgba(201,168,76,0.22) 0%, rgba(180,120,30,0.06) 55%, transparent 75%)',
      }} />

      {/* ── Content ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: '1200px', margin: '0 auto',
        padding: '0 3rem', paddingTop: '9rem', paddingBottom: '7rem',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center',
      }} className="hero-grid">

        {/* Left — main text */}
        <div className="animate-fadeInUp">
          {/* Eye label */}
          <p style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: '0.65rem', letterSpacing: '0.5em',
            textTransform: 'uppercase', color: '#8a6d2f',
            marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem',
          }}>
            <span style={{ display: 'inline-block', width: '28px', height: '1px', background: '#8a6d2f', opacity: 0.6 }} />
            Author &amp; Poet
            <span style={{ display: 'inline-block', width: '28px', height: '1px', background: '#8a6d2f', opacity: 0.6 }} />
          </p>

          {/* Main heading */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
            lineHeight: 1.06,
            fontWeight: 400,
            marginBottom: '0.2rem',
            color: '#f0e6c8',
            letterSpacing: '-0.01em',
          }}>
            Words that
          </h1>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
            lineHeight: 1.06,
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#c9a84c',
            marginBottom: '0.2rem',
            letterSpacing: '-0.01em',
          }}>
            endure
          </h1>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
            lineHeight: 1.06,
            fontWeight: 400,
            color: '#f0e6c8',
            marginBottom: '2rem',
            letterSpacing: '-0.01em',
          }}>
            the dark.
          </h1>

          {/* Ornament rule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'linear-gradient(to right, transparent, #8a6d2f)' }} />
            <span style={{ color: '#c9a84c', fontSize: '0.6rem' }}>✦</span>
            <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'linear-gradient(to left, transparent, #8a6d2f)' }} />
          </div>

          {/* Tagline */}
          <p style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: '1.15rem',
            lineHeight: 1.75,
            color: '#a89060',
            maxWidth: '380px',
            marginBottom: '2.5rem',
          }}>
            Eleanor Ashworth writes novels, poems, and stories that live
            in the borderlands between the known and the haunted.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Link to="/works">
              <button className="btn-gold" style={{ padding: '12px 32px' }}>View the Works</button>
            </Link>
            <Link to="/about" style={{
              fontFamily: "'Crimson Text', serif",
              color: '#6b5a3e', fontSize: '0.85rem',
              letterSpacing: '0.12em', textDecoration: 'none',
              transition: 'color 0.3s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b5a3e'}
            >
              About the Author →
            </Link>
          </div>
        </div>

        {/* Right — pull quote, framed */}
        <div className="animate-fadeInUp delay-400" style={{ animationFillMode: 'forwards', opacity: 0 }}>
          {/* Outer ornate frame lines */}
          <div style={{
            padding: '2.5rem',
            border: '1px solid rgba(201,168,76,0.25)',
            position: 'relative',
            background: 'rgba(8,5,2,0.55)',
            backdropFilter: 'blur(2px)',
          }}>
            {/* Corner accents */}
            {[['top:0;left:0', 'M0 20 L0 0 L20 0'], ['top:0;right:0', 'M0 0 L20 0 L20 20'], ['bottom:0;left:0', 'M0 0 L0 20 L20 20'], ['bottom:0;right:0', 'M20 0 L20 20 L0 20']].map(([pos, d], i) => (
              <svg key={i} viewBox="0 0 20 20" fill="none" style={{ position: 'absolute', width: '20px', height: '20px', ...Object.fromEntries(pos.split(';').map(p => p.split(':'))) }}>
                <path d={d} stroke="#c9a84c" strokeWidth="0.8" opacity="0.7" />
              </svg>
            ))}

            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '0.55rem', letterSpacing: '0.35em',
              textTransform: 'uppercase', color: '#6b5a3e',
              marginBottom: '1.25rem',
            }}>
              From the Archive
            </p>
            <p style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: '1.25rem',
              fontStyle: 'italic',
              lineHeight: 1.7,
              color: '#d4c49a',
              marginBottom: '1.25rem',
            }}>
              "The light came not from any star, but from something older —
              something that had learned, long ago, to imitate the sky."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ height: '1px', flex: 1, background: 'rgba(138,109,47,0.3)' }} />
              <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#4a3520', whiteSpace: 'nowrap' }}>
                The Amber Meridian, 2023
              </p>
            </div>
          </div>

          {/* Study notes card below */}
          <div style={{
            marginTop: '1.25rem',
            padding: '1.25rem 1.5rem',
            background: 'rgba(201,168,76,0.04)',
            border: '1px solid rgba(201,168,76,0.12)',
            display: 'flex', gap: '1rem', alignItems: 'center',
          }}>
            <span style={{ color: '#c9a84c', fontSize: '1.2rem', opacity: 0.5 }}>✒</span>
            <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: 'italic', color: '#6b5a3e', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Study. Read. Discover. — <span style={{ color: '#4a3520' }}>The work continues.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#3d2b14' }}>Scroll</p>
        <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, #8a6d2f, transparent)', animation: 'pulse 2s ease-in-out infinite' }} />
      </div>

      {/* Mobile single-column fix */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          .hero-grid > div:last-child { display: none; }
        }
      `}</style>
    </section>
  )
}

function WorkCard({ work }) {
  const photo = work.cover_image || CARD_PHOTOS[work.category] || cardBooksAlt
  return (
    <Link
      to="/works"
      style={{
        flex: '0 0 300px',
        scrollSnapAlign: 'start',
        display: 'block',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          border: '1px solid #b8a98e',
          background: '#1c140a',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.35)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {/* Photo — 3:4 */}
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          <img
            src={photo}
            alt={work.title}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              filter: 'brightness(0.82) sepia(0.15) saturate(1.1)',
              display: 'block',
              transition: 'transform 0.5s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          {/* Category ribbon top-left */}
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'rgba(10,7,3,0.72)',
            color: '#c9a84c',
            fontSize: '0.5rem', letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: "'Playfair Display', serif",
            padding: '4px 10px',
            border: '1px solid rgba(201,168,76,0.3)',
          }}>
            {work.category}
          </div>
          {/* + expand button */}
          <button
            onClick={e => e.preventDefault()}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              width: '28px', height: '28px',
              background: 'rgba(240,230,200,0.15)',
              border: '1px solid rgba(240,230,200,0.4)',
              color: '#f0e6c8',
              fontSize: '1.1rem', lineHeight: 1,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >+</button>
        </div>

        {/* Info block — parchment coloured */}
        <div style={{
          padding: '16px 18px 20px',
          borderTop: '1px solid #c8b89a',
          background: '#f0e8d8',
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            color: '#1c140a',
            fontSize: '1rem',
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
            fontSize: '0.88rem',
            marginBottom: '6px',
            lineHeight: 1.4,
          }}>
            {work.description.substring(0, 60)}…
          </p>
          <p style={{
            fontFamily: "'Crimson Text', serif",
            fontStyle: 'italic',
            color: '#4a3820',
            fontSize: '0.82rem',
            marginBottom: '10px',
          }}>
            "{work.excerpt.substring(0, 55)}…"
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", color: '#1c140a', fontSize: '0.75rem' }}>
              {work.year}
            </span>
            <span style={{ fontFamily: "'Crimson Text', serif", color: '#7a6548', fontSize: '0.75rem', fontStyle: 'italic' }}>
              {work.pages > 0 ? `${work.pages} pp.` : 'In progress'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function BookCoverSVG({ work }) {
  const initial = work.category ? work.category.charAt(0).toUpperCase() : '✦'
  const c = work.accentColor || '#c9a84c'
  return (
    <svg viewBox="0 0 300 400" style={{ width: '100%', display: 'block' }} fill="none">
      {/* Background fill */}
      <rect width="300" height="400" fill={work.coverColor || '#1a1209'} />
      <rect width="300" height="400" fill="url(#coverGrad)" />
      <defs>
        <linearGradient id={`coverGrad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Large faded category initial behind ornament */}
      <text
        x="150" y="235"
        textAnchor="middle" dominantBaseline="middle"
        fontFamily="Playfair Display, serif"
        fontSize="200"
        fontStyle="italic"
        fill={c}
        fillOpacity="0.05"
      >{initial}</text>

      {/* Outer border with corner ornaments */}
      <rect x="14" y="14" width="272" height="372" fill="none" stroke={c} strokeWidth="0.7" opacity="0.45" />
      <rect x="22" y="22" width="256" height="356" fill="none" stroke={c} strokeWidth="0.3" opacity="0.25" />
      {/* Corner marks */}
      <path d="M14 44 L14 14 L44 14" stroke={c} strokeWidth="1.2" opacity="0.7" />
      <path d="M256 14 L286 14 L286 44" stroke={c} strokeWidth="1.2" opacity="0.7" />
      <path d="M14 356 L14 386 L44 386" stroke={c} strokeWidth="1.2" opacity="0.7" />
      <path d="M256 386 L286 386 L286 356" stroke={c} strokeWidth="1.2" opacity="0.7" />

      {/* Title block lines (upper area) */}
      <line x1="50" y1="90" x2="250" y2="90" stroke={c} strokeWidth="0.6" opacity="0.5" />
      <line x1="70" y1="100" x2="230" y2="100" stroke={c} strokeWidth="0.3" opacity="0.3" />

      {/* Center compass/diamond ornament */}
      <path d="M150 175 L170 210 L150 245 L130 210 Z" fill="none" stroke={c} strokeWidth="0.8" opacity="0.7" />
      <path d="M150 185 L163 210 L150 235 L137 210 Z" fill={c} fillOpacity="0.1" stroke={c} strokeWidth="0.5" opacity="0.5" />
      <circle cx="150" cy="210" r="18" fill="none" stroke={c} strokeWidth="0.6" opacity="0.4" />
      <circle cx="150" cy="210" r="4" fill={c} opacity="0.5" />
      {/* Cardinal marks */}
      <line x1="150" y1="163" x2="150" y2="173" stroke={c} strokeWidth="0.7" opacity="0.5" />
      <line x1="150" y1="247" x2="150" y2="257" stroke={c} strokeWidth="0.7" opacity="0.5" />
      <line x1="118" y1="210" x2="128" y2="210" stroke={c} strokeWidth="0.7" opacity="0.5" />
      <line x1="172" y1="210" x2="182" y2="210" stroke={c} strokeWidth="0.7" opacity="0.5" />

      {/* Bottom rule lines */}
      <line x1="50" y1="310" x2="250" y2="310" stroke={c} strokeWidth="0.6" opacity="0.5" />
      <line x1="70" y1="318" x2="230" y2="318" stroke={c} strokeWidth="0.3" opacity="0.3" />

      {/* Bottom strip */}
      <rect x="14" y="360" width="272" height="26" fill={c} fillOpacity="0.07" />
      <text
        x="150" y="377"
        textAnchor="middle"
        fontFamily="Playfair Display, serif"
        fontSize="8"
        letterSpacing="4"
        fill={c}
        fillOpacity="0.5"
        textTransform="uppercase"
      >EST. MMXXIV</text>
    </svg>
  )
}

function FeaturedWorks({ works }) {
  return (
    <section style={{
      position: 'relative',
      padding: '5rem 3rem 5.5rem',
      overflow: 'hidden',
    }}>
      {/* Parchment background photo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${parchmentBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.92) saturate(0.85)',
      }} />
      {/* Subtle dark vignette on edges */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 110% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.25) 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Section header — Old Harbor style ── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              color: '#1c140a',
              fontSize: '0.65rem',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              fontWeight: 400,
              marginBottom: '6px',
            }}>
              THE COLLECTION
            </p>
            {/* Ornament */}
            <svg viewBox="0 0 140 12" style={{ width: '90px', height: '10px', display: 'block', margin: '0 auto 8px' }} fill="none">
              <line x1="0" y1="6" x2="50" y2="6" stroke="#8a7a65" strokeWidth="0.6" />
              <path d="M55 6 L60 2.5 L65 6 L60 9.5 Z" fill="none" stroke="#8a7a65" strokeWidth="0.9" />
              <circle cx="70" cy="6" r="2" fill="#8a7a65" />
              <path d="M75 6 L80 2.5 L85 6 L80 9.5 Z" fill="none" stroke="#8a7a65" strokeWidth="0.9" />
              <line x1="90" y1="6" x2="140" y2="6" stroke="#8a7a65" strokeWidth="0.6" />
            </svg>
            <p style={{
              fontFamily: "'Crimson Text', serif",
              fontStyle: 'italic',
              color: '#7a6548',
              fontSize: '1rem',
            }}>
              Works from the current archive.
            </p>
          </div>

          {/* View all — right aligned */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/works" style={{
              fontFamily: "'Playfair Display', serif",
              color: '#1c140a',
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            }}>
              VIEW ALL WORKS →
            </Link>
          </div>
        </div>

        {/* ── Horizontally scrollable card track ── */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '1rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {works.map(work => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>

        <style>{`.works-scroll::-webkit-scrollbar { display: none; }`}</style>
      </div>
    </section>
  )
}

function LatestJournal({ entries }) {
  const latest = entries.slice(0, 2)
  return (
    <section className="py-24 px-6" style={{ background: '#0a0806' }}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle subtitle="From the Journal">Recent Entries</SectionTitle>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {latest.map((entry) => (
            <Link key={entry.id} to="/journal" className="group">
              <div
                className="p-8 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #1a1209, #0d0a05)',
                  border: '1px solid rgba(138, 109, 47, 0.2)',
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs tracking-widest uppercase" style={{ color: '#8a6d2f' }}>
                    {entry.category}
                  </span>
                  <span className="text-xs" style={{ color: '#4a3520' }}>{entry.date}</span>
                </div>
                <h3
                  className="text-xl italic mb-3 group-hover:text-gold transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8' }}
                >
                  {entry.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b5a3e' }}>
                  {entry.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="h-px flex-1" style={{ background: 'rgba(138,109,47,0.3)' }} />
                  <span className="text-xs tracking-widest uppercase" style={{ color: '#8a6d2f' }}>
                    {entry.readTime} read
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/journal">
            <button className="btn-gold">Read the Journal</button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function ClosingQuote() {
  return (
    <section
      className="py-24 px-6 text-center relative overflow-hidden"
      style={{ background: '#1a1209' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-2xl mx-auto relative z-10">
        <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: '#8a6d2f' }}>
          ✦ &nbsp; A Note &nbsp; ✦
        </p>
        <p
          className="text-3xl md:text-4xl italic leading-relaxed"
          style={{ fontFamily: "'IM Fell English', serif", color: '#d4c49a' }}
        >
          "Every good sentence is a small room <br />
          with light coming in from the right."
        </p>
        <OrnateDivider className="mt-8" />
      </div>
    </section>
  )
}

export default function Home() {
  const [works, setWorks] = useState(mockWorks.map(normalizeWork))
  const [journal, setJournal] = useState(mockJournal.map(normalizeJournal))

  useEffect(() => {
    fetchWorks({ status: 'published' })
      .then(data => { if (data.length > 0) setWorks(data.map(normalizeWork)) })
      .catch(() => {})
    fetchJournal()
      .then(data => { if (data.length > 0) setJournal(data.map(normalizeJournal)) })
      .catch(() => {})
  }, [])

  return (
    <div className="">
      <HeroSection />
      <FeaturedWorks works={works.slice(0, 3)} />
      <LatestJournal entries={journal} />
      <ClosingQuote />
    </div>
  )
}
