import { useState, useEffect } from 'react'
import { fetchJournal } from '../data/api'
import { normalizeJournal } from '../data/normalize'
import { journalEntries as mockJournal } from '../data/content'

// ─── Ornament rule ────────────────────────────────────────────────────────────
function OrnamentRule() {
  const s = { width: 3, height: 3, border: '0.5px solid #1a1410', transform: 'rotate(45deg)', flexShrink: 0 }
  const d = { width: 5, height: 5, border: '0.5px solid #2a1e0a', transform: 'rotate(45deg)', flexShrink: 0 }
  const f = { ...d, background: '#c9a85c', borderColor: '#c9a85c' }
  return (
    <div style={{ maxWidth: 900, margin: '48px auto 0', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16, padding: '0 48px' }}>
      <div style={{ height: '0.5px', background: '#1a1410' }} />
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <div style={s} /><div style={d} /><div style={s} /><div style={f} /><div style={s} /><div style={d} /><div style={s} />
      </div>
      <div style={{ height: '0.5px', background: '#1a1410' }} />
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function EntryModal({ entry, onClose }) {
  if (!entry) return null
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        overflowY: 'auto', padding: '60px 24px',
        background: 'rgba(0,0,0,0.92)',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 640,
        background: 'linear-gradient(160deg, #1a1209, #0d0a05)',
        border: '0.5px solid #3a2e1a',
        padding: '56px 56px 48px',
        position: 'relative', margin: 'auto',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 24,
            fontFamily: "'Cinzel', serif", fontSize: 9,
            letterSpacing: '0.25em', color: '#3a2e1a',
            cursor: 'pointer', background: 'none', border: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#c9a85c'}
          onMouseLeave={e => e.currentTarget.style.color = '#3a2e1a'}
        >
          ✕ CLOSE
        </button>

        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: '#5a4a2a', marginBottom: 6, textTransform: 'uppercase' }}>
          {entry.category}
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontStyle: 'italic', fontWeight: 300, color: '#e8dcc0', marginBottom: 4, lineHeight: 1.2 }}>
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

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Journal() {
  const [active, setActive]   = useState(null)
  const [entries, setEntries] = useState(mockJournal.map(normalizeJournal))

  useEffect(() => {
    fetchJournal()
      .then(data => setEntries(data.map(normalizeJournal)))
      .catch(() => setEntries(mockJournal.map(normalizeJournal)))
  }, [])

  return (
    <div style={{ background: '#0d0a05', minHeight: '100vh', fontFamily: "'EB Garamond', Georgia, serif", color: '#a89060', paddingTop: '72px' }}>

      {/* ── Header ── */}
      <div style={{ padding: '72px 48px 0', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.4em', color: '#3a2e1a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#c9a85c', fontSize: 8 }}>✦</span>
          THE JOURNAL
          <span style={{ color: '#c9a85c', fontSize: 8 }}>✦</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, fontStyle: 'italic', color: '#e8dcc0', lineHeight: 1, marginBottom: 20 }}>
          Writing &amp; Observations
        </h1>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, fontStyle: 'italic', color: '#4a3a20', lineHeight: 1.6, maxWidth: 440 }}>
          Notes on the craft. Records of the days. Moments worth keeping.
        </p>
      </div>

      <OrnamentRule />

      {/* ── Entry list ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 48px 80px' }}>
        {entries.map((entry, i) => (
          <div key={entry.id}>

            {/* ── Featured (first entry) ── */}
            {i === 0 && (
              <div
                onClick={() => setActive(entry)}
                style={{ display: 'grid', gridTemplateColumns: '1fr', cursor: 'pointer' }}
                onMouseEnter={e => { const c = e.currentTarget.querySelector('.j-cta'); if (c) { c.style.opacity='1'; c.style.color='#c9a85c'; } }}
                onMouseLeave={e => { const c = e.currentTarget.querySelector('.j-cta'); if (c) { c.style.opacity='0.5'; c.style.color='#3a2e1a'; } }}
              >
                <div style={{ padding: '48px 0 40px' }}>
                  <div style={{ width: 32, height: '0.5px', background: '#c9a85c', marginBottom: 20 }} />
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: '0.3em', color: '#c9a85c', textTransform: 'uppercase' }}>{entry.category}</span>
                    <span style={{ color: '#1a1410', fontSize: 10 }}>·</span>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: '0.15em', color: '#3a2e1a', textTransform: 'uppercase' }}>{entry.date}</span>
                    {entry.readTime && <>
                      <span style={{ color: '#1a1410', fontSize: 10 }}>·</span>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: '0.15em', color: '#3a2e1a', textTransform: 'uppercase' }}>{entry.readTime} READ</span>
                    </>}
                  </div>
                  <h2 className="j-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontStyle: 'italic', fontWeight: 400, color: '#e8dcc0', marginBottom: 10, lineHeight: 1.2, transition: 'color 0.2s' }}>
                    {entry.title}
                  </h2>
                  <p style={{ fontSize: 17, color: '#5a4a2a', lineHeight: 1.8, marginBottom: 14, maxWidth: 600 }}>{entry.excerpt}</p>
                  <span className="j-cta" style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.25em', color: '#3a2e1a', opacity: 0.5, transition: 'all 0.2s' }}>
                    READ ENTRY →
                  </span>
                </div>
              </div>
            )}

            {/* ── Standard (all other entries) ── */}
            {i > 0 && (
              <div
                onClick={() => setActive(entry)}
                style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 0, cursor: 'pointer' }}
                onMouseEnter={e => {
                  const t = e.currentTarget.querySelector('.j-title'); if (t) t.style.color = '#c9a85c';
                  const c = e.currentTarget.querySelector('.j-cta');   if (c) { c.style.opacity='1'; c.style.color='#c9a85c'; }
                }}
                onMouseLeave={e => {
                  const t = e.currentTarget.querySelector('.j-title'); if (t) t.style.color = '#d4c4a0';
                  const c = e.currentTarget.querySelector('.j-cta');   if (c) { c.style.opacity='0.5'; c.style.color='#3a2e1a'; }
                }}
              >
                {/* Left column */}
                <div style={{ padding: '40px 32px 40px 0', borderRight: '0.5px solid #1a1410', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: '0.3em', color: '#5a4a2a', textAlign: 'right', textTransform: 'uppercase' }}>
                    {entry.category}
                  </span>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: '0.15em', color: '#2a2010', textAlign: 'right', lineHeight: 1.6, textTransform: 'uppercase' }}>
                    {entry.date}
                  </span>
                  {entry.readTime && (
                    <span style={{ fontSize: 11, color: '#2a2010', fontStyle: 'italic', textAlign: 'right', marginTop: 4 }}>
                      {entry.readTime}
                    </span>
                  )}
                </div>

                {/* Right column */}
                <div style={{ padding: '40px 0 40px 40px', minWidth: 0 }}>
                  <h2 className="j-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontStyle: 'italic', fontWeight: 400, color: '#d4c4a0', marginBottom: 10, lineHeight: 1.2, transition: 'color 0.2s' }}>
                    {entry.title}
                  </h2>
                  <p style={{ fontSize: 15, color: '#5a4a2a', lineHeight: 1.8, marginBottom: 14, maxWidth: 520 }}>{entry.excerpt}</p>
                  <span className="j-cta" style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.25em', color: '#3a2e1a', opacity: 0.5, transition: 'all 0.2s' }}>
                    READ ENTRY →
                  </span>
                </div>
              </div>
            )}

            {/* Divider */}
            {i < entries.length - 1 && (
              <div style={{ height: '0.5px', background: '#1a1410' }} />
            )}
          </div>
        ))}
      </div>

      <OrnamentRule />

      <p style={{ maxWidth: 900, margin: '32px auto 60px', padding: '0 48px', textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: '#1a1410' }}>
        ✦ &nbsp; MORE ENTRIES FORTHCOMING &nbsp; ✦
      </p>

      <EntryModal entry={active} onClose={() => setActive(null)} />
    </div>
  )
}
