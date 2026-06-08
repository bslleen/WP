import { useState, useEffect } from 'react'
import { OrnateDivider, SectionTitle } from '../components/OrnateElements'
import { fetchAbout } from '../data/api'

const DEFAULT_BIO = [
  { heading: 'What Is Known', text: `Edmund Ashworth was born in 1847 in a town that appeared on only one map, which was later lost. His father was a clockmaker. His mother read to him from books she wouldn't let him see the covers of. He grew up believing stories had no authors — that they simply arrived, like weather, and someone had to be present to receive them.` },
  { heading: 'What Was Said of the Work', text: `The novels were described, by the one reviewer who encountered them during his lifetime, as 'architecturally unsound and emotionally unavoidable.' The poetry was read aloud at three funerals before it was published. The short fiction was found in an envelope addressed to no one.` },
  { heading: 'The Disappearance', text: `At forty-one, Ashworth ceased to appear in any record. No death certificate was filed. No forwarding address was left. What exists is this: a house discovered in 1923 by a surveyor who was not looking for it, containing a library, three manuscripts, a journal kept across forty years, and a candle that was still warm.` },
  { heading: 'What Little Remains', text: `Three witnesses remembered him. None agreed on what he looked like. One said he was tall. One said he was unremarkable in every visible way. The third said only: he listened as though he already knew what you were going to say, and was grateful you said it anyway.` },
]
const DEFAULT_STATS = [
  { num: '4', label: 'Recovered Works' },
  { num: '1', label: 'Known Residence' },
  { num: '1923', label: 'Year of Discovery' },
  { num: '0', label: 'Confirmed Sightings' },
]

export default function About() {
  const [about, setAbout] = useState(null)

  useEffect(() => {
    fetchAbout().then(data => { if (data) setAbout(data) }).catch(() => {})
  }, [])

  const name  = about?.name      || 'E. Ashworth'
  const email = about?.email     || 'eleanor@ashworthwrites.com'
  const photo = about?.photo_url || ''
  const bio   = about?.bio?.length   ? about.bio   : DEFAULT_BIO
  const stats = about?.stats?.length ? about.stats : DEFAULT_STATS

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '120px' }} className="about-page pb-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <SectionTitle subtitle="THE ARCHIVE">{name}</SectionTitle>
          <p style={{ fontStyle: 'italic', fontSize: '15px', color: 'var(--text-faint)', marginTop: '8px' }}>
            What remains of a life spent in letters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 mt-8">

          {/* Portrait column */}
          <div className="lg:col-span-2 pl-6 lg:pl-0">
            <div className="w-full max-w-xs mx-auto lg:max-w-none portrait-frame" style={{ height: '420px', overflow: 'hidden', border: '1px solid var(--accent-dim)', position: 'relative' }}>
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
                      <stop offset="0%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.12 }} />
                      <stop offset="100%" style={{ stopColor: 'var(--bg-primary)', stopOpacity: 1 }} />
                    </radialGradient>
                    <linearGradient id="figureGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" style={{ stopColor: 'var(--bg-tertiary)' }} />
                      <stop offset="100%" style={{ stopColor: 'var(--bg-primary)' }} />
                    </linearGradient>
                  </defs>
                  <rect width="300" height="400" fill="var(--bg-secondary)" />
                  <rect width="300" height="400" fill="url(#portraitGlow)" />
                  {[0, 1, 2].map(row => (
                    <g key={row} opacity="0.25">
                      {[...Array(8)].map((_, i) => (
                        <rect key={i} x={10 + i * 36} y={20 + row * 80} width={28} height={70} rx="1"
                          fill={['var(--bg-tertiary)','var(--bg-secondary)','var(--bg-tertiary)','var(--bg-tertiary)'][i % 4]}
                          stroke="var(--accent-dim)" strokeWidth="0.3" />
                      ))}
                    </g>
                  ))}
                  <g opacity="0.7">
                    <rect x="40" y="300" width="220" height="12" rx="2" fill="var(--bg-tertiary)" />
                    <path d="M130 200 Q130 260 120 300 L180 300 Q170 260 170 200 Z" fill="url(#figureGrad)" />
                    <ellipse cx="150" cy="180" rx="30" ry="35" fill="var(--bg-tertiary)" />
                    <path d="M120 170 Q130 140 150 145 Q170 140 180 170" fill="var(--bg-secondary)" />
                    <path d="M120 260 Q100 280 80 295 L100 300 Q115 285 130 265 Z" fill="var(--bg-tertiary)" />
                    <path d="M180 260 Q200 280 220 295 L200 300 Q185 285 170 265 Z" fill="var(--bg-tertiary)" />
                    <path d="M90 300 Q150 295 210 300 L210 310 Q150 308 90 310 Z" fill="var(--text-primary)" opacity="0.2" />
                    <line x1="150" y1="295" x2="150" y2="310" stroke="var(--accent-dim)" strokeWidth="0.5" />
                  </g>
                  <ellipse cx="80" cy="280" rx="50" ry="40" fill="#f59e0b" opacity="0.06" />
                  <path d="M5 30 L5 5 L30 5" stroke="var(--accent)" strokeWidth="0.8" fill="none" opacity="0.6" />
                  <path d="M295 30 L295 5 L270 5" stroke="var(--accent)" strokeWidth="0.8" fill="none" opacity="0.6" />
                  <path d="M5 370 L5 395 L30 395" stroke="var(--accent)" strokeWidth="0.8" fill="none" opacity="0.6" />
                  <path d="M295 370 L295 395 L270 395" stroke="var(--accent)" strokeWidth="0.8" fill="none" opacity="0.6" />
                  <circle cx="5" cy="5" r="2" fill="var(--accent)" opacity="0.6" />
                  <circle cx="295" cy="5" r="2" fill="var(--accent)" opacity="0.6" />
                  <circle cx="5" cy="395" r="2" fill="var(--accent)" opacity="0.6" />
                  <circle cx="295" cy="395" r="2" fill="var(--accent)" opacity="0.6" />
                </svg>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', textAlign: 'center', background: 'linear-gradient(to top, var(--bg-primary), transparent)' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-dim)' }}>
                  Photograph recovered from the study. Date and subject unconfirmed.
                </p>
              </div>
            </div>

            {/* One divider after portrait */}
            <OrnateDivider className="my-6" />

            {/* Stats grid */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)' }}>
              {stats.map(({ num, label }) => (
                <div key={label} style={{ background: 'var(--bg-primary)', padding: '24px', textAlign: 'center' }}>
                  <p className="stat-number" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.875rem', fontStyle: 'italic', color: 'var(--accent)' }}>
                    {num}
                  </p>
                  <p className="stat-label" style={{ fontSize: '12px', marginTop: '4px', color: 'var(--text-faint)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio column */}
          <div className="lg:col-span-3 px-0">
            {bio.map((section, i) => (
              <div key={i} className="bio-section" style={{ marginBottom: '36px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.125rem', fontStyle: 'italic', color: 'var(--accent)', marginBottom: '12px' }}>
                  {section.heading}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.9' }}>
                  {section.text}
                </p>
              </div>
            ))}

            {/* One divider before Correspondence */}
            <OrnateDivider className="mb-8" />

            {/* Correspondence */}
            <div className="contact-section" style={{ border: '0.5px solid var(--border)', padding: '28px 32px', background: 'var(--bg-secondary)' }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '12px' }}>
                Letters to the Estate
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                For matters pertaining to the work, the archive, or the whereabouts of the author —
              </p>
              <a href={`mailto:${email}`} style={{ fontSize: '14px', letterSpacing: '0.1em', color: 'var(--accent)', fontFamily: "var(--font-body)", textDecoration: 'none' }}>
                {email} →
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
