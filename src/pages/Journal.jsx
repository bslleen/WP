import { useState, useEffect } from 'react'
import { fetchJournal } from '../data/api'
import { normalizeJournal } from '../data/normalize'

function OrnamentRule() {
  const s = { width: 3, height: 3, border: '0.5px solid var(--border)', transform: 'rotate(45deg)', flexShrink: 0 }
  const d = { width: 5, height: 5, border: '0.5px solid var(--text-faint)', transform: 'rotate(45deg)', flexShrink: 0 }
  const f = { ...d, background: 'var(--accent)', borderColor: 'var(--accent)' }
  return (
    <div style={{ maxWidth: 900, margin: '48px auto 0' }} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:px-12">
      <div style={{ height: '0.5px', background: 'var(--border)' }} />
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <div style={s} /><div style={d} /><div style={s} /><div style={f} /><div style={s} /><div style={d} /><div style={s} />
      </div>
      <div style={{ height: '0.5px', background: 'var(--border)' }} />
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
      className="journal-modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflowY: 'auto',
        padding: '80px 16px 40px',
        background: 'var(--overlay)',
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
          background: 'linear-gradient(160deg, var(--bg-secondary), var(--bg-primary))',
          border: '0.5px solid var(--text-faint)',
        }}
        className="journal-modal-content p-8 md:p-14"
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 24,
            fontFamily: "'Cinzel', serif", fontSize: 9,
            letterSpacing: '0.25em', color: 'var(--text-faint)',
            cursor: 'pointer', background: 'none', border: 'none',
            transition: 'color 0.2s',
            minHeight: '44px', minWidth: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
        >
          ✕ CLOSE
        </button>

        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
          {entry.category}
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontStyle: 'italic', fontWeight: 300, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.2 }}>
          {entry.title}
        </h2>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--text-faint)', marginBottom: 32, textTransform: 'uppercase' }}>
          {entry.date}{entry.readTime ? ` · ${entry.readTime} READ` : ''}
        </p>

        <div style={{ height: '0.5px', background: 'var(--border)', marginBottom: 32 }} />

        <div style={{ fontSize: 17, lineHeight: 1.9, color: 'var(--text-secondary)' }}>
          {(entry.body || entry.excerpt || '').split('\n\n').map((p, i) => (
            <p key={i} style={{ marginBottom: '1.4em' }}>{p}</p>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 40, fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--text-faint)' }}>
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
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', fontFamily: "'EB Garamond', Georgia, serif", color: 'var(--text-secondary)' }} className="pt-20 md:pt-[72px]">

      {/* ── Header ── */}
      <div style={{ maxWidth: 900, margin: '0 auto' }} className="px-4 md:px-12 pt-10 md:pt-16 pb-0">
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.4em', color: 'var(--text-faint)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--accent)', fontSize: 8 }}>✦</span>
          THE JOURNAL
          <span style={{ color: 'var(--accent)', fontSize: 8 }}>✦</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 8vw, 3.5rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1, marginBottom: 20 }}>
          Writing &amp; Observations
        </h1>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, fontStyle: 'italic', color: 'var(--text-faint)', lineHeight: 1.6, maxWidth: 440 }}>
          Notes on the craft. Records of the days. Moments worth keeping.
        </p>
      </div>

      <OrnamentRule />

      {/* ── Entry list ── */}
      <div style={{ maxWidth: 900, margin: '0 auto' }} className="px-4 md:px-12 pb-20">
        {loading && (
          <p style={{ textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--text-faint)', padding: '48px 0' }}>
            Consulting the archive…
          </p>
        )}
        {!loading && entries.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: "'IM Fell English', serif", fontStyle: 'italic', color: 'var(--text-faint)', fontSize: '1rem', padding: '64px 0', lineHeight: 1.9 }}>
            The journal has not yet been opened.<br />The first entry is forthcoming.
          </p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="journal-entry-row"
            onClick={() => setActive(entry)}
            style={{
              display: 'flex',
              gap: '32px',
              alignItems: 'flex-start',
              padding: '32px 0',
              borderBottom: '1px solid var(--border)',
              background: 'transparent',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              const t = e.currentTarget.querySelector('.j-title')
              if (t) t.style.color = 'var(--accent)'
              const c = e.currentTarget.querySelector('.j-cta')
              if (c) c.style.color = 'var(--accent)'
            }}
            onMouseLeave={e => {
              const t = e.currentTarget.querySelector('.j-title')
              if (t) t.style.color = 'var(--text-primary)'
              const c = e.currentTarget.querySelector('.j-cta')
              if (c) c.style.color = 'var(--accent-dim)'
            }}
          >
            {/* Left — category + date */}
            <div style={{ flexShrink: 0, width: '110px', paddingTop: '4px' }}>
              <p className="entry-category" style={{
                fontFamily: "'Cinzel', serif", fontSize: '8px',
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'var(--accent)', marginBottom: '6px',
              }}>
                {entry.category}
              </p>
              <p className="entry-date" style={{
                fontFamily: "'Cinzel', serif", fontSize: '8px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'var(--text-faint)', lineHeight: 1.6,
              }}>
                {entry.date}
              </p>
            </div>

            {/* Right — title + excerpt + cta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 className="j-title" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.25rem', fontStyle: 'italic', fontWeight: 400,
                color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3,
                transition: 'color 0.2s',
              }}>
                {entry.title}
              </h2>
              {entry.excerpt && (
                <p className="entry-excerpt" style={{
                  fontSize: '14px', color: 'var(--text-muted)',
                  lineHeight: 1.7, marginBottom: '12px',
                }}>
                  {entry.excerpt}
                </p>
              )}
              <span className="j-cta read-link" style={{
                fontFamily: "'Cinzel', serif", fontSize: '8px',
                letterSpacing: '0.25em', textTransform: 'uppercase',
                color: 'var(--accent-dim)', transition: 'color 0.2s',
              }}>
                Read entry →
              </span>
            </div>
          </div>
        ))}
      </div>

      <OrnamentRule />

      <p style={{ maxWidth: 900, margin: '32px auto 60px', textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--border)' }}
        className="px-4 md:px-12">
        ✦ &nbsp; MORE ENTRIES FORTHCOMING &nbsp; ✦
      </p>

      <EntryModal entry={active} onClose={() => setActive(null)} />
    </div>
  )
}
