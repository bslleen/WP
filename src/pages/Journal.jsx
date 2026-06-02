import { useState, useEffect } from 'react'
import { SectionTitle, OrnateDivider } from '../components/OrnateElements'
import { fetchJournal } from '../data/api'
import { normalizeJournal } from '../data/normalize'
import { journalEntries as mockJournal } from '../data/content'

function EntryModal({ entry, onClose }) {
  if (!entry) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-12 px-4"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-2xl animate-fadeInUp"
        style={{
          background: 'linear-gradient(135deg, #1a1209, #0d0a05)',
          border: '1px solid #8a6d2f',
          boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-xs tracking-widest transition-colors hover:text-gold"
          style={{ color: '#6b5a3e', fontFamily: "'Crimson Text', serif" }}
        >
          ✕ Close
        </button>

        <div className="p-10 pt-12">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#8a6d2f' }}>
            {entry.category} &nbsp;·&nbsp; {entry.date}
          </p>
          <h2
            className="text-3xl italic mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8' }}
          >
            {entry.title}
          </h2>
          <p className="text-xs mb-6" style={{ color: '#4a3520' }}>
            {entry.readTime} read
          </p>

          <OrnateDivider className="mb-8" />

          <div className="space-y-5">
            {entry.body.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-lg leading-relaxed" style={{ color: '#a89060' }}>
                {paragraph}
              </p>
            ))}
          </div>

          <OrnateDivider className="mt-10" />
          <p className="text-center text-xs tracking-widest uppercase mt-4" style={{ color: '#4a3520' }}>
            ✦ &nbsp; End of Entry &nbsp; ✦
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Journal() {
  const [active, setActive] = useState(null)
  const [entries, setEntries] = useState(mockJournal.map(normalizeJournal))

  useEffect(() => {
    fetchJournal()
      .then(data => setEntries(data.map(normalizeJournal)))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen pt-28 pb-24 px-6" style={{ background: '#0d0a05' }}>
      <div className="max-w-4xl mx-auto">
        <SectionTitle subtitle="The Journal">Writing & Observations</SectionTitle>

        <p
          className="text-center max-w-md mx-auto mt-4 mb-16 text-lg"
          style={{ color: '#6b5a3e', fontFamily: "'Crimson Text', serif" }}
        >
          Notes on the craft. Records of the days. Moments worth keeping.
        </p>

        {/* Entry list — newspaper-style */}
        <div className="space-y-0">
          {entries.map((entry, i) => (
            <div key={entry.id}>
              <button
                className="w-full text-left group py-8 transition-all duration-300"
                onClick={() => setActive(entry)}
              >
                <div className="grid md:grid-cols-4 gap-4 items-start">
                  {/* Date column */}
                  <div className="md:col-span-1">
                    <p className="text-xs tracking-widest uppercase" style={{ color: '#8a6d2f' }}>
                      {entry.category}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#4a3520' }}>
                      {entry.date}
                    </p>
                  </div>

                  {/* Content column */}
                  <div className="md:col-span-3">
                    <h3
                      className="text-2xl italic mb-2 group-hover:text-gold transition-colors duration-300"
                      style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8' }}
                    >
                      {entry.title}
                    </h3>
                    <p className="text-base leading-relaxed mb-3" style={{ color: '#6b5a3e' }}>
                      {entry.excerpt}
                    </p>
                    <span
                      className="text-xs tracking-[0.25em] uppercase transition-colors group-hover:opacity-100 opacity-60"
                      style={{ color: '#c9a84c' }}
                    >
                      Read entry →
                    </span>
                  </div>
                </div>
              </button>

              {i < entries.length - 1 && (
                <div style={{ borderTop: '1px solid rgba(138, 109, 47, 0.15)' }} />
              )}
            </div>
          ))}
        </div>

        <OrnateDivider className="mt-8" />

        <p className="text-center text-xs tracking-widest" style={{ color: '#3d2b14' }}>
          ✦ &nbsp; More entries forthcoming &nbsp; ✦
        </p>
      </div>

      <EntryModal entry={active} onClose={() => setActive(null)} />
    </div>
  )
}
