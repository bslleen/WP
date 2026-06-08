import { useState, useEffect } from 'react'
import { OrnateDivider } from '../components/OrnateElements'
import {
  fetchPrivateEntries, createPrivateEntry, updatePrivateEntry, deletePrivateEntry,
  fetchLetters, createLetter, deleteLetter,
} from '../data/api'

function MessageToSelf() {
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [futureDate, setFutureDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLetters()
      .then(data => setMessages(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    if (!newMsg.trim() || !futureDate) return
    setSaving(true)
    const written = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    try {
      const docRef = await createLetter({ text: newMsg, revealDate: futureDate, written })
      setMessages(prev => [{ id: docRef.id, text: newMsg, revealDate: futureDate, written }, ...prev])
      setNewMsg('')
      setFutureDate('')
    } catch {} finally {
      setSaving(false)
    }
  }

  const del = async (id) => {
    try {
      await deleteLetter(id)
      setMessages(prev => prev.filter(m => m.id !== id))
    } catch {}
  }

  const today = new Date()
  const isReady = (dateStr) => new Date(dateStr) <= today

  return (
    <div
      className="mt-10 p-7"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
      }}
    >
      <h3
        className="text-lg italic mb-1"
        style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}
      >
        Letters to the Future
      </h3>
      <p className="text-xs mb-6" style={{ color: 'var(--text-faint)' }}>
        Write a message. Set a date. It will reveal itself when the day arrives.
      </p>

      {/* Compose */}
      <div className="space-y-3 mb-6">
        <textarea
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Dear future self..."
          rows={4}
          className="resize-none outline-none"
          style={{
            width: '100%', background: 'rgba(255,255,255,0.02)',
            border: '0.5px solid var(--border)', color: 'var(--text-primary)',
            padding: '16px', fontFamily: "'EB Garamond', serif", fontSize: '16px',
            minHeight: '200px',
          }}
        />
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="date"
            value={futureDate}
            onChange={(e) => setFutureDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="outline-none flex-1 w-full sm:w-auto"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '0.5px solid var(--border)', color: 'var(--text-primary)',
              padding: '16px', fontFamily: "'EB Garamond', serif", fontSize: '16px',
              colorScheme: 'dark',
              minHeight: '44px',
            }}
          />
          <button
            onClick={save}
            disabled={!newMsg.trim() || !futureDate || saving}
            className="px-6 py-2 text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              background: saving ? 'var(--accent)' : 'transparent',
              border: '1px solid var(--accent-dim)',
              color: saving ? 'var(--bg-primary)' : 'var(--accent)',
              fontFamily: "'Playfair Display', serif",
              opacity: !newMsg.trim() || !futureDate ? 0.4 : 1,
              cursor: !newMsg.trim() || !futureDate ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Sealed ✦' : 'Seal & Send'}
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-xs tracking-widest" style={{ color: 'var(--text-faint)' }}>
          Consulting the archive…
        </p>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-faint)' }}>
            Sealed letters ({messages.length})
          </p>
          {messages.map((msg) => {
            const ready = isReady(msg.revealDate)
            const revealDate = new Date(msg.revealDate).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric'
            })
            return (
              <div
                key={msg.id}
                className="relative p-5"
                style={{
                  background: ready ? 'rgba(201,168,76,0.05)' : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${ready ? 'var(--border-strong)' : 'var(--border)'}`,
                  overflow: 'hidden',
                }}
              >
                {/* Paper fold corner */}
                {!ready && (
                  <svg viewBox="0 0 24 24" style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', opacity: 0.35 }} fill="none">
                    <path d="M24 0 L24 14 L10 0 Z" fill="var(--accent)" fillOpacity="0.25" />
                    <path d="M10 0 L24 14" stroke="var(--accent)" strokeWidth="0.6" />
                  </svg>
                )}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs tracking-widest" style={{ color: ready ? 'var(--accent)' : 'var(--text-faint)' }}>
                      {ready ? '✦ Ready to read' : `Opens ${revealDate}`}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                      Written {msg.written}
                    </p>
                  </div>
                  <button
                    onClick={() => del(msg.id)}
                    className="text-xs transition-colors hover:opacity-100 opacity-40"
                    style={{ color: 'var(--accent-dim)' }}
                  >
                    ✕
                  </button>
                </div>

                {ready ? (
                  <p
                    className="text-base italic leading-relaxed mt-2"
                    style={{ color: 'var(--text-secondary)', fontFamily: "'IM Fell English', serif" }}
                  >
                    {msg.text}
                  </p>
                ) : (
                  <div
                    className="mt-2 py-3 text-center text-xs tracking-widest"
                    style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-faint)' }}
                  >
                    ✦ &nbsp; Sealed until the appointed day &nbsp; ✦
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PrivateJournal() {
  const [entries, setEntries] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [viewEntry, setViewEntry] = useState(null)
  const [readEntry, setReadEntry] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrivateEntries()
      .then(data => setEntries(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    if (!body.trim()) return
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

    if (editingId) {
      const edited = `${dateStr}, ${timeStr}`
      try {
        await updatePrivateEntry(editingId, { title: title || 'Untitled', body, edited })
        setEntries(prev => prev.map(e =>
          e.id === editingId ? { ...e, title: title || 'Untitled', body, edited } : e
        ))
      } catch {}
      setEditingId(null)
    } else {
      const data = { title: title || 'Untitled', body, date: dateStr, time: timeStr }
      try {
        const docRef = await createPrivateEntry(data)
        setEntries(prev => [{ id: docRef.id, ...data }, ...prev])
      } catch {}
    }
    setTitle('')
    setBody('')
  }

  const del = async (id) => {
    try {
      await deletePrivateEntry(id)
      setEntries(prev => prev.filter(e => e.id !== id))
      if (viewEntry?.id === id) setViewEntry(null)
    } catch {}
  }

  const edit = (entry) => {
    setTitle(entry.title === 'Untitled' ? '' : entry.title)
    setBody(entry.body)
    setEditingId(entry.id)
    setViewEntry(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Editor */}
      <div
        className="p-7"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg italic"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}
          >
            {editingId ? 'Editing Entry' : 'New Entry'}
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="outline-none mb-4"
          style={{
            width: '100%', background: 'rgba(255,255,255,0.02)',
            border: '0.5px solid var(--border)', color: 'var(--text-primary)',
            padding: '16px', fontFamily: "'EB Garamond', serif", fontSize: '16px',
            fontStyle: 'italic',
          }}
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Begin writing..."
          rows={8}
          className="outline-none resize-none"
          style={{
            width: '100%', background: 'rgba(255,255,255,0.02)',
            border: '0.5px solid var(--border)', color: 'var(--text-primary)',
            padding: '16px', fontFamily: "'EB Garamond', serif", fontSize: '16px',
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(42,30,10,0.15) 28px)',
            lineHeight: '28px',
          }}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={save}
            disabled={!body.trim()}
            className="px-7 py-2.5 text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              background: 'transparent',
              border: '1px solid var(--accent-dim)',
              color: 'var(--accent)',
              fontFamily: "'Playfair Display', serif",
              opacity: !body.trim() ? 0.4 : 1,
              cursor: !body.trim() ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => { if (body.trim()) { e.target.style.background = 'var(--accent)'; e.target.style.color = 'var(--bg-primary)' }}}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--accent)' }}
          >
            {editingId ? 'Update Entry' : 'Record Entry'}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setTitle(''); setBody('') }}
              className="px-5 py-2.5 text-xs tracking-widest uppercase"
              style={{ color: 'var(--text-faint)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Entry list */}
      {loading && (
        <p className="mt-6 text-xs tracking-widest" style={{ color: 'var(--text-faint)' }}>
          Consulting the archive…
        </p>
      )}
      {entries.length > 0 && (
        <div className="mt-8 space-y-3">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-faint)' }}>
            Private Archive — {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
          {entries.map((entry) => (
            <div key={entry.id}>
              {viewEntry?.id === entry.id ? (
                <div
                  className="p-6"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-strong)',
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4
                        className="text-xl italic"
                        style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}
                      >
                        {entry.title}
                      </h4>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
                        {entry.date} &nbsp;·&nbsp; {entry.time}
                        {entry.edited && ` (edited ${entry.edited})`}
                      </p>
                    </div>
                    <button onClick={() => setViewEntry(null)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
                      ✕
                    </button>
                  </div>
                  <p
                    className="text-base leading-relaxed whitespace-pre-wrap"
                    style={{ color: 'var(--text-secondary)', fontFamily: "'IM Fell English', serif" }}
                  >
                    {entry.body}
                  </p>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => edit(entry)} className="text-xs tracking-widest uppercase" style={{ color: 'var(--accent-dim)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Edit
                    </button>
                    <button onClick={() => del(entry.id)} className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-faint)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full text-left p-5 transition-all duration-300"
                  onClick={() => setReadEntry(entry)}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <p
                        className="italic text-base"
                        style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}
                      >
                        {entry.title}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>{entry.date}</p>
                      <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                        {entry.body.substring(0, 60)}...
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                      <p className="hidden sm:block text-xs" style={{ color: 'var(--text-faint)' }}>{entry.date}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); edit(entry) }}
                        className="text-xs tracking-widest uppercase"
                        style={{ color: 'var(--accent-dim)', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        EDIT
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); del(entry.id) }}
                        className="text-xs tracking-widest uppercase"
                        style={{ color: 'var(--text-faint)', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Read modal */}
      {readEntry && (
        <div
          onClick={(e) => e.target === e.currentTarget && setReadEntry(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            overflowY: 'auto', padding: '60px 24px',
            background: 'var(--overlay)',
          }}
        >
          <div style={{
            width: '100%', maxWidth: 640,
            background: 'linear-gradient(160deg, var(--bg-secondary), var(--bg-primary))',
            border: '1px solid var(--accent-dim)',
            padding: '56px 56px 48px',
            position: 'relative', margin: 'auto',
          }}>
            <button
              onClick={() => setReadEntry(null)}
              style={{
                position: 'absolute', top: 20, right: 24,
                fontFamily: "'Cinzel', serif", fontSize: 9,
                letterSpacing: '0.25em', color: 'var(--text-faint)',
                cursor: 'pointer', background: 'none', border: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-faint)'}
            >
              ✕ CLOSE
            </button>

            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
              Private Entry
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontStyle: 'italic', fontWeight: 300, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.2 }}>
              {readEntry.title}
            </h2>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--text-faint)', marginBottom: 32, textTransform: 'uppercase' }}>
              {readEntry.date} · {readEntry.time}
              {readEntry.edited && ` (edited ${readEntry.edited})`}
            </p>

            <div style={{ height: '0.5px', background: 'var(--border)', marginBottom: 32 }} />

            <div style={{ fontSize: 17, lineHeight: 1.9, color: 'var(--text-secondary)' }}>
              {(readEntry.body || '').split('\n\n').map((p, i) => (
                <p key={i} style={{ marginBottom: '1.4em' }}>{p}</p>
              ))}
            </div>

            <p style={{ textAlign: 'center', marginTop: 40, fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--text-faint)' }}>
              ✦ &nbsp; END OF ENTRY &nbsp; ✦
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Secret({ onLogout }) {
  return (
    <div data-theme="castle" style={{ background: 'var(--bg-primary)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="max-w-2xl mx-auto px-4 md:px-12 pt-20 md:pt-[72px] pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.45em] uppercase mb-4" style={{ color: 'var(--text-faint)' }}>
            ✦ &nbsp; Private Chambers &nbsp; ✦
          </p>
          <h1 style={{ fontSize: '52px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, color: 'var(--text-primary)', marginBottom: '8px' }}>
            The Inner Study
          </h1>
          <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'var(--text-faint)', marginBottom: '32px' }}>
            No one reads this. That is why you can write here.
          </p>
          <OrnateDivider className="mt-6" />
        </div>

        {/* Candle ambience — large, dramatic */}
        <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: '50%', top: '-20px',
            transform: 'translateX(-50%)',
            width: '260px', height: '160px',
            background: 'radial-gradient(ellipse 60% 55% at 50% 30%, rgba(245,158,11,0.12) 0%, rgba(201,168,76,0.04) 50%, transparent 80%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} className="animate-flickerGlow" />
          <svg viewBox="0 0 80 140" className="w-20 h-28 mx-auto" fill="none" style={{ position: 'relative', zIndex: 1 }}>
            <ellipse cx="40" cy="22" rx="22" ry="26" fill="#f59e0b" fillOpacity="0.08" className="animate-flickerGlow" />
            <ellipse cx="40" cy="18" rx="9" ry="16" fill="#f59e0b" opacity="0.85" className="animate-flicker" />
            <ellipse cx="40" cy="20" rx="5.5" ry="10" fill="#fde68a" opacity="0.75" className="animate-flicker" />
            <ellipse cx="40" cy="23" rx="2.5" ry="4" fill="#fff9c4" opacity="0.9" />
            <line x1="40" y1="34" x2="40" y2="42" stroke="var(--bg-tertiary)" strokeWidth="1.8" />
            <rect x="26" y="42" width="28" height="76" rx="2" fill="var(--text-primary)" opacity="0.82" />
            <rect x="26" y="42" width="7" height="76" rx="0" fill="var(--text-primary)" opacity="0.35" />
            <path d="M26 58 Q18 64 20 75 L26 75 Z" fill="var(--text-primary)" opacity="0.55" />
            <path d="M54 65 Q60 70 58 78 L54 78 Z" fill="var(--text-primary)" opacity="0.4" />
            <rect x="18" y="118" width="44" height="12" rx="3" fill="var(--accent-dim)" opacity="0.7" />
            <rect x="20" y="118" width="40" height="3" rx="1" fill="var(--accent)" opacity="0.25" />
          </svg>
        </div>

        {/* Private Journal */}
        <div className="mb-4">
          <h2 style={{ fontSize: '28px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: 'var(--accent)', marginBottom: '24px', marginTop: '56px' }}>
            Private Journal
          </h2>
          <PrivateJournal />
        </div>

        <OrnateDivider className="my-10" />

        {/* Message to self */}
        <div>
          <h2 style={{ fontSize: '28px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: 'var(--accent)', marginBottom: '24px', marginTop: '56px' }}>
            Letters to the Future
          </h2>
          <MessageToSelf />
        </div>

        <OrnateDivider className="mt-12" />

        {/* Logout */}
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <button
            onClick={onLogout}
            className="text-xs tracking-widest uppercase transition-colors duration-300"
            style={{ color: 'var(--text-faint)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--accent-dim)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-faint)'}
          >
            Leave the study →
          </button>
        </div>
      </div>
    </div>
  )
}
