import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { OrnateDivider, OrnateFrame, SectionTitle } from '../components/OrnateElements'
import { fetchWorks, fetchJournal } from '../data/api'
import { normalizeWork, normalizeJournal } from '../data/normalize'
import { featuredWorks as mockWorks, journalEntries as mockJournal } from '../data/content'

function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0d0a05 0%, #1a1209 40%, #0d0a05 100%)',
      }}
    >
      {/* Atmospheric radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 60% 40%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Decorative large quote marks */}
      <div
        className="absolute top-32 left-8 text-[200px] leading-none select-none pointer-events-none"
        style={{ color: 'rgba(138, 109, 47, 0.08)', fontFamily: "'Playfair Display', serif" }}
      >
        "
      </div>

      {/* Study desk illustration - SVG atmospheric */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 500 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="lampGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a1f0e" />
              <stop offset="100%" stopColor="#1a1209" />
            </linearGradient>
          </defs>
          {/* Lamp glow */}
          <ellipse cx="320" cy="200" rx="160" ry="120" fill="url(#lampGlow)" />
          {/* Desk */}
          <rect x="50" y="420" width="420" height="20" rx="2" fill="url(#deskGrad)" opacity="0.8" />
          {/* Book stack */}
          <rect x="80" y="370" width="60" height="50" rx="2" fill="#3d2b14" opacity="0.9" />
          <rect x="82" y="360" width="56" height="50" rx="2" fill="#2a1f0e" opacity="0.9" />
          <rect x="84" y="350" width="52" height="50" rx="2" fill="#4a3520" opacity="0.9" />
          {/* Open book */}
          <ellipse cx="250" cy="415" rx="90" ry="12" fill="#2a1f0e" opacity="0.6" />
          <path d="M170 390 Q250 380 330 390 L330 415 Q250 410 170 415 Z" fill="#f0e6c8" opacity="0.15" />
          <line x1="250" y1="380" x2="250" y2="415" stroke="#8a6d2f" strokeWidth="0.5" opacity="0.5" />
          {/* Quill */}
          <path d="M280 350 Q320 300 360 260" stroke="#f0e6c8" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M280 350 Q270 340 275 330 Q285 340 280 350 Z" fill="#f0e6c8" opacity="0.4" />
          {/* Ink bottle */}
          <rect x="340" y="390" width="20" height="28" rx="3" fill="#1a1209" opacity="0.9" stroke="#8a6d2f" strokeWidth="0.5" />
          <rect x="343" y="386" width="14" height="6" rx="1" fill="#2a1f0e" opacity="0.9" />
          {/* Candle */}
          <rect x="390" y="375" width="12" height="40" rx="1" fill="#f0e6c8" opacity="0.5" />
          <ellipse cx="396" cy="373" rx="3" ry="4" fill="#f59e0b" opacity="0.7" />
          <ellipse cx="396" cy="374" rx="1.5" ry="2" fill="#fde68a" opacity="0.8" />
          <ellipse cx="396" cy="370" rx="8" ry="8" fill="url(#lampGlow)" />
          {/* Wall texture lines */}
          {[...Array(12)].map((_, i) => (
            <line key={i} x1="0" y1={i * 50} x2="500" y2={i * 50}
              stroke="#2a1f0e" strokeWidth="0.3" opacity="0.3" />
          ))}
        </svg>
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fadeInUp">
          <p
            className="text-xs tracking-[0.45em] uppercase mb-6"
            style={{ color: '#8a6d2f' }}
          >
            ✦ &nbsp; Author &amp; Poet &nbsp; ✦
          </p>

          <h1
            className="text-5xl md:text-7xl leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Words that
            <br />
            <em className="italic" style={{ color: '#c9a84c' }}>endure</em>
            <br />
            the dark.
          </h1>

          <p
            className="text-lg leading-relaxed mb-10 max-w-md"
            style={{ color: '#a89060', fontFamily: "'Crimson Text', serif" }}
          >
            Eleanor Ashworth writes novels, poems, and stories that live
            in the borderlands between the known and the haunted.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/works">
              <button className="btn-gold">View the Works</button>
            </Link>
            <Link to="/about">
              <button
                className="px-7 py-3 text-xs tracking-[0.2em] uppercase transition-colors duration-300"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6b5a3e',
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                About the Author →
              </button>
            </Link>
          </div>
        </div>

        {/* Pull quote */}
        <div
          className="hidden lg:block animate-fadeInUp delay-300 opacity-0"
          style={{ animationFillMode: 'forwards' }}
        >
          <div
            className="p-8 relative"
            style={{ border: '1px solid rgba(138, 109, 47, 0.3)' }}
          >
            <div
              className="absolute -top-4 left-6 px-3 text-xs tracking-widest uppercase"
              style={{ background: '#1a1209', color: '#8a6d2f' }}
            >
              From the Archive
            </div>
            <p
              className="text-xl italic leading-relaxed"
              style={{
                fontFamily: "'IM Fell English', serif",
                color: '#d4c49a',
              }}
            >
              "The light came not from any star, but from something older —
              something that had learned, long ago, to imitate the sky."
            </p>
            <p className="mt-4 text-xs tracking-widest uppercase" style={{ color: '#6b5a3e' }}>
              — The Amber Meridian, 2023
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: '#4a3520' }}>Scroll</p>
        <div className="w-px h-12 animate-pulse" style={{ background: 'linear-gradient(to bottom, #8a6d2f, transparent)' }} />
      </div>
    </section>
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
    <section className="py-24 px-6" style={{ background: '#0d0a05' }}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle subtitle="Selected Works">The Collection</SectionTitle>

        <div
          className="grid md:grid-cols-3 gap-6 mb-16"
          style={{ maxWidth: '900px', margin: '0 auto', marginTop: '4rem' }}
        >
          {works.map((work, i) => (
            <Link key={work.id} to="/works" className="group" style={{ display: 'block' }}>
              <div
                className="relative overflow-hidden"
                style={{
                  background: `linear-gradient(170deg, ${work.coverColor || '#1a1209'} 0%, #0d0a05 100%)`,
                  border: '1px solid rgba(201,168,76,0.2)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08)',
                  padding: 0,
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.85), 0 0 30px rgba(201,168,76,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08)'
                }}
              >
                {/* Full-width book cover SVG — 3:4 aspect ratio */}
                <div style={{ width: '100%', aspectRatio: '3/4' }}>
                  <BookCoverSVG work={work} />
                </div>

                {/* Text block */}
                <div style={{ padding: '20px 20px 24px' }}>
                  {/* Category */}
                  <p
                    className="text-xs uppercase mb-2"
                    style={{ letterSpacing: '0.35em', color: work.accentColor || '#c9a84c' }}
                  >
                    {work.category}
                  </p>

                  {/* Title */}
                  <h3
                    className="text-xl italic mb-2"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8', lineHeight: 1.25 }}
                  >
                    {work.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm mb-3" style={{ color: '#6b5a3e', lineHeight: 1.5 }}>
                    {work.description.substring(0, 85)}…
                  </p>

                  {/* Excerpt */}
                  <p
                    className="text-sm italic mb-4"
                    style={{ color: '#a89060', fontFamily: "'IM Fell English', serif", lineHeight: 1.6 }}
                  >
                    “{work.excerpt.substring(0, 65)}…”
                  </p>

                  {/* Year / Pages */}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-xs" style={{ color: '#3d2b14' }}>{work.year}</span>
                    <span className="text-xs" style={{ color: '#3d2b14' }}>
                      {work.pages > 0 ? `${work.pages} pp.` : 'In progress'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/works">
            <button className="btn-gold">View All Works</button>
          </Link>
        </div>
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
