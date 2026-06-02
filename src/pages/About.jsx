import { useState, useEffect } from 'react'
import { OrnateDivider, OrnateFrame, SectionTitle } from '../components/OrnateElements'
import { fetchAbout } from '../data/api'

const DEFAULT_BIO = [
  { heading: 'The Beginning', text: `Eleanor Ashworth grew up in a house that held more books than furniture, in a town where winters lasted six months and stories lasted longer. She wrote her first poem at nine, about the death of a crow she found in the garden. Her mother kept it in a bureau drawer for twenty years.` },
  { heading: 'The Work', text: `Her debut novel, The Amber Meridian, was called "a lighthouse of a book — disorienting and, in the end, necessary" by the Times Literary Supplement. Her poetry collection Salt & Silence won the Calvert Prize for voice and was shortlisted for the Forward.` },
  { heading: 'The Process', text: `She writes by hand, in the morning, before light if possible. She keeps a research archive of found objects: postcards, newspaper clippings, photographs of strangers, maps torn from old atlases. Every book begins with an object and a question.` },
  { heading: 'The Life', text: `She has been writer-in-residence on the Orkney Islands and a visiting fellow at Pembroke College, Oxford. She divides her time between a house with unreliable heating and a manuscript that requires her full attention.` },
]
const DEFAULT_STATS = [
  { num: '6', label: 'Published Works' },
  { num: '2', label: 'Awards' },
  { num: '1', label: 'Residency' },
  { num: '3', label: 'Countries Written In' },
]

export default function About() {
  const [about, setAbout] = useState(null)

  useEffect(() => {
    fetchAbout().then(data => { if (data) setAbout(data) }).catch(() => {})
  }, [])

  const name    = about?.name    || 'Eleanor Ashworth'
  const email   = about?.email   || 'eleanor@ashworthwrites.com'
  const photo   = about?.photo_url || ''
  const bio     = about?.bio?.length   ? about.bio   : DEFAULT_BIO
  const stats   = about?.stats?.length ? about.stats : DEFAULT_STATS

  return (
    <div className="min-h-screen pt-28 pb-24 px-6" style={{ background: '#0d0a05' }}>
      <div className="max-w-5xl mx-auto">
        <SectionTitle subtitle="The Author">{name}</SectionTitle>

        <div className="grid lg:grid-cols-5 gap-16 mt-16">
          {/* Portrait column */}
          <div className="lg:col-span-2">
            <div
              className="relative aspect-[3/4] overflow-hidden"
              style={{ border: '1px solid #8a6d2f' }}
            >
              {photo ? (
                <img src={photo} alt={name} className="w-full h-full object-cover object-center" />
              ) : (
              <svg viewBox="0 0 300 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
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

                {/* Bookshelf background */}
                {[0, 1, 2].map(row => (
                  <g key={row} opacity="0.25">
                    {[...Array(8)].map((_, i) => (
                      <rect key={i}
                        x={10 + i * 36} y={20 + row * 80}
                        width={28} height={70}
                        rx="1"
                        fill={['#2a1f0e','#1a1209','#3d2b14','#2a1f0e'][i % 4]}
                        stroke="#8a6d2f" strokeWidth="0.3"
                      />
                    ))}
                  </g>
                ))}

                {/* Figure silhouette - reading at a desk */}
                <g opacity="0.7">
                  {/* Desk */}
                  <rect x="40" y="300" width="220" height="12" rx="2" fill="#3d2b14" />
                  {/* Body */}
                  <path d="M130 200 Q130 260 120 300 L180 300 Q170 260 170 200 Z"
                    fill="url(#figureGrad)" />
                  {/* Head */}
                  <ellipse cx="150" cy="180" rx="30" ry="35" fill="#2a1f0e" />
                  {/* Hair */}
                  <path d="M120 170 Q130 140 150 145 Q170 140 180 170"
                    fill="#1a1209" />
                  {/* Arms on desk */}
                  <path d="M120 260 Q100 280 80 295 L100 300 Q115 285 130 265 Z"
                    fill="#2a1f0e" />
                  <path d="M180 260 Q200 280 220 295 L200 300 Q185 285 170 265 Z"
                    fill="#2a1f0e" />
                  {/* Open book on desk */}
                  <path d="M90 300 Q150 295 210 300 L210 310 Q150 308 90 310 Z"
                    fill="#f0e6c8" opacity="0.2" />
                  <line x1="150" y1="295" x2="150" y2="310" stroke="#8a6d2f" strokeWidth="0.5" />
                </g>

                {/* Lamp glow */}
                <ellipse cx="80" cy="280" rx="50" ry="40" fill="#f59e0b" opacity="0.06" />

                {/* Frame corners */}
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

              <div
                className="absolute bottom-0 left-0 right-0 p-4 text-center"
                style={{ background: 'linear-gradient(to top, #0d0a05, transparent)' }}
              >
                <p className="text-xs tracking-widest uppercase" style={{ color: '#8a6d2f' }}>
                  {name}, at work
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {stats.map(({ num, label }) => (
                <div
                  key={label}
                  className="p-4 text-center"
                  style={{ border: '1px solid rgba(138,109,47,0.2)' }}
                >
                  <p
                    className="text-3xl italic"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c' }}
                  >
                    {num}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#4a3520' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio column */}
          <div className="lg:col-span-3">
            <div className="prose prose-lg max-w-none">
              {bio.map((section, i) => (
                <div
                  key={i}
                  className="mb-8"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <h3
                    className="text-lg italic mb-3"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c' }}
                  >
                    {section.heading}
                  </h3>
                  <p className="leading-relaxed text-lg" style={{ color: '#a89060' }}>
                    {section.text}
                  </p>
                  {i < bio.length - 1 && <OrnateDivider className="mt-6" />}
                </div>
              ))}
            </div>

            {/* Contact */}
            <div
              className="mt-10 p-6"
              style={{
                background: 'rgba(26, 18, 9, 0.8)',
                border: '1px solid rgba(138,109,47,0.3)',
              }}
            >
              <h4
                className="text-base italic mb-3"
                style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8' }}
              >
                Correspondence
              </h4>
              <p className="text-sm mb-4" style={{ color: '#6b5a3e' }}>
                For rights inquiries, speaking engagements, or letters —
              </p>
              <a
                href={`mailto:${email}`}
                className="text-sm tracking-widest transition-colors duration-300"
                style={{ color: '#c9a84c', fontFamily: "'Crimson Text', serif" }}
              >
                {email} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
