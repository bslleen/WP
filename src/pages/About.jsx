import { useState, useEffect } from 'react'
import { OrnateDivider, SectionTitle } from '../components/OrnateElements'
import { fetchAbout } from '../data/api'

const DEFAULT_BIO = [
  { heading: 'What Is Known', text: `The author was born in a house with too many rooms and not enough light. The earliest surviving document — a notebook, water-damaged, pages stuck together — dates to sometime in the last century. The handwriting is careful. The contents are not.` },
  { heading: 'What Was Said of the Work', text: `The first novel was described by one reader as 'a lighthouse of a book — disorienting and, in the end, necessary.' The poetry was shortlisted for a prize whose committee has since dissolved. The short fiction appeared in journals that no longer publish.` },
  { heading: 'What Remained', text: `A writing practice conducted by hand, before dawn. A research archive of found objects: postcards, maps torn from old atlases, photographs of strangers. Every book begins with an object and a question. Neither is ever fully answered.` },
  { heading: 'What Little Is Left', text: `The author was last known to be dividing time between a house with unreliable heating and a manuscript that has not yet declared its intentions.` },
]
const DEFAULT_STATS = [
  { num: '6', label: 'Recovered Volumes' },
  { num: '2', label: 'Prizes, Disputed' },
  { num: '1', label: 'Known Residence' },
  { num: '3', label: 'Countries, Unconfirmed' },
]

export default function About() {
  const [about, setAbout] = useState(null)

  useEffect(() => {
    fetchAbout().then(data => { if (data) setAbout(data) }).catch(() => {})
  }, [])

  const name  = about?.name      || 'Eleanor Ashworth'
  const email = about?.email     || 'eleanor@ashworthwrites.com'
  const photo = about?.photo_url || ''
  const bio   = about?.bio?.length   ? about.bio   : DEFAULT_BIO
  const stats = about?.stats?.length ? about.stats : DEFAULT_STATS

  return (
    <div style={{ background: '#0d0a05', minHeight: '100vh', paddingTop: '80px', paddingBottom: '96px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <SectionTitle subtitle="THE ARCHIVE">{name}</SectionTitle>
          <p style={{ fontStyle: 'italic', fontSize: '15px', color: '#4a3a20', marginTop: '8px' }}>
            What remains of a life spent in letters.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-16 mt-8">

          {/* Portrait column */}
          <div className="lg:col-span-2">
            <div style={{ height: '420px', overflow: 'hidden', border: '1px solid #8a6d2f', position: 'relative' }}>
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'brightness(0.85) sepia(20%)' }}
                />
              ) : (
                <svg viewBox="0 0 300 400" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <radialGradient id="portraitGlow" cx="50%" cy="35%" r="50%">
                      <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#0d0a05" stopOpacity="1" />
                    </radialGradient>
                    <linearGradient id="figureGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2a1f0e" />
                      <stop offset="100%" stopColor="#0d0a05" />
                    </linearGradient>
                  </defs>
                  <rect width="300" height="400" fill="#1a1209" />
                  <rect width="300" height="400" fill="url(#portraitGlow)" />
                  {[0, 1, 2].map(row => (
                    <g key={row} opacity="0.25">
                      {[...Array(8)].map((_, i) => (
                        <rect key={i} x={10 + i * 36} y={20 + row * 80} width={28} height={70} rx="1"
                          fill={['#2a1f0e','#1a1209','#3d2b14','#2a1f0e'][i % 4]}
                          stroke="#8a6d2f" strokeWidth="0.3" />
                      ))}
                    </g>
                  ))}
                  <g opacity="0.7">
                    <rect x="40" y="300" width="220" height="12" rx="2" fill="#3d2b14" />
                    <path d="M130 200 Q130 260 120 300 L180 300 Q170 260 170 200 Z" fill="url(#figureGrad)" />
                    <ellipse cx="150" cy="180" rx="30" ry="35" fill="#2a1f0e" />
                    <path d="M120 170 Q130 140 150 145 Q170 140 180 170" fill="#1a1209" />
                    <path d="M120 260 Q100 280 80 295 L100 300 Q115 285 130 265 Z" fill="#2a1f0e" />
                    <path d="M180 260 Q200 280 220 295 L200 300 Q185 285 170 265 Z" fill="#2a1f0e" />
                    <path d="M90 300 Q150 295 210 300 L210 310 Q150 308 90 310 Z" fill="#f0e6c8" opacity="0.2" />
                    <line x1="150" y1="295" x2="150" y2="310" stroke="#8a6d2f" strokeWidth="0.5" />
                  </g>
                  <ellipse cx="80" cy="280" rx="50" ry="40" fill="#f59e0b" opacity="0.06" />
                  <path d="M5 30 L5 5 L30 5" stroke="#c9a84c" strokeWidth="0.8" fill="none" opacity="0.6" />
                  <path d="M295 30 L295 5 L270 5" stroke="#c9a84c" strokeWidth="0.8" fill="none" opacity="0.6" />
                  <path d="M5 370 L5 395 L30 395" stroke="#c9a84c" strokeWidth="0.8" fill="none" opacity="0.6" />
                  <path d="M295 370 L295 395 L270 395" stroke="#c9a84c" strokeWidth="0.8" fill="none" opacity="0.6" />
                  <circle cx="5" cy="5" r="2" fill="#c9a84c" opacity="0.6" />
                  <circle cx="295" cy="5" r="2" fill="#c9a84c" opacity="0.6" />
                  <circle cx="5" cy="395" r="2" fill="#c9a84c" opacity="0.6" />
                  <circle cx="295" cy="395" r="2" fill="#c9a84c" opacity="0.6" />
                </svg>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', textAlign: 'center', background: 'linear-gradient(to top, #0d0a05, transparent)' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a6d2f' }}>
                  Photograph, provenance unknown.
                </p>
              </div>
            </div>

            {/* One divider after portrait */}
            <OrnateDivider className="my-6" />

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#1a1410' }}>
              {stats.map(({ num, label }) => (
                <div key={label} style={{ background: '#0d0a05', padding: '24px', textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.875rem', fontStyle: 'italic', color: '#c9a84c' }}>
                    {num}
                  </p>
                  <p style={{ fontSize: '12px', marginTop: '4px', color: '#4a3520' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio column */}
          <div className="lg:col-span-3">
            {bio.map((section, i) => (
              <div key={i} style={{ marginBottom: '36px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.125rem', fontStyle: 'italic', color: '#c9a84c', marginBottom: '12px' }}>
                  {section.heading}
                </h3>
                <p style={{ color: '#a89060', fontSize: '1.125rem', lineHeight: '1.9' }}>
                  {section.text}
                </p>
              </div>
            ))}

            {/* One divider before Correspondence */}
            <OrnateDivider className="mb-8" />

            {/* Correspondence */}
            <div style={{ border: '0.5px solid #2a1e0a', padding: '28px 32px', background: 'rgba(26,18,9,0.8)' }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontStyle: 'italic', color: '#f0e6c8', marginBottom: '12px' }}>
                Letters to the Estate
              </h4>
              <p style={{ fontSize: '14px', color: '#6b5a3e', marginBottom: '16px' }}>
                For matters pertaining to the work, the archive, or the whereabouts of the author —
              </p>
              <a href={`mailto:${email}`} style={{ fontSize: '14px', letterSpacing: '0.1em', color: '#c9a84c', fontFamily: "'Crimson Text', serif", textDecoration: 'none' }}>
                {email} →
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
