import { useState, useEffect } from 'react'
import { fetchJournal } from '../data/api'
import { normalizeJournal } from '../data/normalize'

function OrnamentRule() {
  const s = { width: 3, height: 3, border: '0.5px solid #1a1410', transform: 'rotate(45deg)', flexShrink: 0 }
  const d = { width: 5, height: 5, border: '0.5px solid #2a1e0a', transform: 'rotate(45deg)', flexShrink: 0 }
  const f = { ...d, background: '#c9a85c', borderColor: '#c9a85c' }
  return (
    <div style={{ maxWidth: 900, margin: '48px auto 0' }} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:px-12">
      <div style={{ height: '0.5px', background: '#1a1410' }} />
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <div style={s} /><div style={d} /><div style={s} /><div style={f} /><div style={s} /><div style={d} /><div style={s} />
      </div>
      <div style={{ height: '0.5px', background: '#1a1410' }} />
    </div>
  )
}

function EntryModal({ entry, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!entry) return null
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflowY: 'auto',
        padding: '80px 16px 40px',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '80vh',
          overflowY: 'auto',
          margin: 'auto',
          background: 'linear-gradient(160deg, #1a1209, #0d0a05)',
          border: '0.5px solid #3a2e1a',
        }}
        className="p-8 md:p-14"
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 24,
            fontFamily: "'Cinzel', serif", fontSize: 9,
            letterSpacing: '0.25em', color: '#3a2e1a',
            cursor: 'pointer', background: 'none', border: 'none',
            transition: 'color 0.2s',
            minHeight: '44px', minWidth: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#c9a85c'}
          onMouseLeave={e => e.currentTarget.style.color = '#3a2e1a'}
        >
          ✕ CLOSE
        </button>

        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: '#5a4a2a', marginBottom: 6, textTransform: 'uppercase' }}>
          {entry.category}
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontStyle: 'italic', fontWeight: 300, color: '#e8dcc0', marginBottom: 4, lineHeight: 1.2 }}>
          {entry.title}
        </h2>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: '#2a2010', marginBottom: 32, textTransform: 'uppercase' }}>
          {entry.date}{entry.readTime ? ` · ${entry.readTime} READ` : ''}
        </p>

        <div style={{ height: '0.5px', background: '#1a1410', marginBottom: 32 }} />

        <div style={{ fontSize: 17, lineHeight: 1.9, color: '#8a7a5a' }}>
          {(entry.body || entry.excerpt || '').split('\n\n').map((p, i) => (
            <p key={i} style={{ marginBottom: '1.4em' }}>{p}</p>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 40, fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: '#2a2010' }}>
          ✦ &nbsp; END OF ENTRY &nbsp; ✦
        </p>
      </div>
    </div>
  )
}

export default function Journal() {
  const [active, setActive]   = useState(null)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJournal()
      .then(data => setEntries(data.map(normalizeJournal)))
      .catch(err => console.error('Journal fetch failed:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ background: '#0d0a05', minHeight: '100vh', fontFamily: "'EB Garamond', Georgia, serif", color: '#a89060' }} className="pt-20 md:pt-[72px]">

      {/* ── Header ── */}
      <div style={{ maxWidth: 900, margin: '0 auto' }} className="px-4 md:px-12 pt-10 md:pt-16 pb-0">
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.4em', color: '#3a2e1a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#c9a85c', fontSize: 8 }}>✦</span>
          THE JOURNAL
          <span style={{ color: '#c9a85c', fontSize: 8 }}>✦</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 8vw, 3.5rem)', fontWeight: 300, fontStyle: 'italic', color: '#e8dcc0', lineHeight: 1, marginBottom: 20 }}>
          Writing &amp; Observations
        </h1>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, fontStyle: 'italic', color: '#4a3a20', lineHeight: 1.6, maxWidth: 440 }}>
          Notes on the craft. Records of the days. Moments worth keeping.
        </p>
      </div>

      <OrnamentRule />

      {/* ── Entry list ── */}
      <div style={{ maxWidth: 900, margin: '0 auto' }} className="px-4 md:px-12 pb-20">
        {loading && (
          <p style={{ textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: '#3a2e1a', padding: '48px 0' }}>
            Consulting the archive…
          </p>
        )}
        {!loading && entries.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: "'IM Fell English', serif", fontStyle: 'italic', color: '#4a3a20', fontSize: '1rem', padding: '64px 0', lineHeight: 1.9 }}>
            The journal has not yet been opened.<br />The first entry is forthcoming.
          </p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setActive(entry)}
            style={{
              display: 'flex',
              gap: '32px',
              alignItems: 'flex-start',
              padding: '32px 0',
              borderBottom: '1px solid rgba(138,109,47,0.15)',
              background: 'transparent',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              const t = e.currentTarget.querySelector('.j-title')
              if (t) t.style.color = '#c9a84c'
              const c = e.currentTarget.querySelector('.j-cta')
              if (c) c.style.color = '#c9a84c'
            }}
            onMouseLeave={e => {
              const t = e.currentTarget.querySelector('.j-title')
              if (t) t.style.color = '#f0e6c8'
              const c = e.currentTarget.querySelector('.j-cta')
              if (c) c.style.color = '#8a6d2f'
            }}
          >
            {/* Left — category + date */}
            <div style={{ flexShrink: 0, width: '110px', paddingTop: '4px' }}>
              <p style={{
                fontFamily: "'Cinzel', serif", fontSize: '8px',
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: '#c9a84c', marginBottom: '6px',
              }}>
                {entry.category}
              </p>
              <p style={{
                fontFamily: "'Cinzel', serif", fontSize: '8px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#3a2e1a', lineHeight: 1.6,
              }}>
                {entry.date}
              </p>
            </div>

            {/* Right — title + excerpt + cta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 className="j-title" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.25rem', fontStyle: 'italic', fontWeight: 400,
                color: '#f0e6c8', marginBottom: '8px', lineHeight: 1.3,
                transition: 'color 0.2s',
              }}>
                {entry.title}
              </h2>
              {entry.excerpt && (
                <p style={{
                  fontSize: '14px', color: '#5a4a2a',
                  lineHeight: 1.7, marginBottom: '12px',
                }}>
                  {entry.excerpt}
                </p>
              )}
              <span className="j-cta" style={{
                fontFamily: "'Cinzel', serif", fontSize: '8px',
                letterSpacing: '0.25em', textTransform: 'uppercase',
                color: '#8a6d2f', transition: 'color 0.2s',
              }}>
                Read entry →
              </span>
            </div>
          </div>
        ))}
      </div>

      <OrnamentRule />

      <p style={{ maxWidth: 900, margin: '32px auto 60px', textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: '#1a1410' }}
        className="px-4 md:px-12">
        ✦ &nbsp; MORE ENTRIES FORTHCOMING &nbsp; ✦
      </p>

      <EntryModal entry={active} onClose={() => setActive(null)} />
    </div>
  )
}
