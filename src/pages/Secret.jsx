import { useState, useEffect } from 'react'
import { OrnateDivider } from '../components/OrnateElements'

function MessageToSelf() {
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [futureDate, setFutureDate] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('messages_to_self') || '[]')
    setMessages(stored)
  }, [])

  const save = () => {
    if (!newMsg.trim() || !futureDate) return
    setSaving(true)
    const msg = {
      id: Date.now(),
      text: newMsg,
      date: futureDate,
      written: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    }
    const updated = [...messages, msg]
    localStorage.setItem('messages_to_self', JSON.stringify(updated))
    setMessages(updated)
    setNewMsg('')
    setFutureDate('')
    setTimeout(() => setSaving(false), 600)
  }

  const del = (id) => {
    const updated = messages.filter(m => m.id !== id)
    localStorage.setItem('messages_to_self', JSON.stringify(updated))
    setMessages(updated)
  }

  const today = new Date()
  const isReady = (dateStr) => new Date(dateStr) <= today

  return (
    <div
      className="mt-10 p-7"
      style={{
        background: 'rgba(13, 10, 5, 0.7)',
        border: '1px solid rgba(138, 109, 47, 0.2)',
      }}
    >
      <h3
        className="text-lg italic mb-1"
        style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8' }}
      >
        Letters to the Future
      </h3>
      <p className="text-xs mb-6" style={{ color: '#4a3520' }}>
        Write a message. Set a date. It will reveal itself when the day arrives.
      </p>

      {/* Compose */}
      <div className="space-y-3 mb-6">
        <textarea
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Dear future self..."
          rows={4}
          className="w-full bg-transparent resize-none outline-none p-4 text-base leading-relaxed"
          style={{
            border: '1px solid rgba(138,109,47,0.3)',
            color: '#d4c49a',
            fontFamily: "'IM Fell English', serif",
          }}
        />
        <div className="flex gap-3 items-center">
          <input
            type="date"
            value={futureDate}
            onChange={(e) => setFutureDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="bg-transparent outline-none px-3 py-2 text-sm flex-1"
            style={{
              border: '1px solid rgba(138,109,47,0.3)',
              color: '#8a6d2f',
              fontFamily: "'Crimson Text', serif",
              colorScheme: 'dark',
            }}
          />
          <button
            onClick={save}
            disabled={!newMsg.trim() || !futureDate}
            className="px-6 py-2 text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              background: saving ? '#c9a84c' : 'transparent',
              border: '1px solid #8a6d2f',
              color: saving ? '#0d0a05' : '#c9a84c',
              fontFamily: "'Playfair Display', serif",
              opacity: !newMsg.trim() || !futureDate ? 0.4 : 1,
              cursor: !newMsg.trim() || !futureDate ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Sealed ✦' : 'Seal & Send'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#4a3520' }}>
            Sealed letters ({messages.length})
          </p>
          {messages.map((msg) => {
            const ready = isReady(msg.date)
            const revealDate = new Date(msg.date).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric'
            })
            return (
              <div
                key={msg.id}
                className="relative p-5"
                style={{
                  background: ready ? 'rgba(201,168,76,0.05)' : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${ready ? 'rgba(201,168,76,0.3)' : 'rgba(138,109,47,0.15)'}`,
                  overflow: 'hidden',
                }}
              >
                {/* Paper fold corner */}
                {!ready && (
                  <svg viewBox="0 0 24 24" style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', opacity: 0.35 }} fill="none">
                    <path d="M24 0 L24 14 L10 0 Z" fill="#c9a84c" fillOpacity="0.25" />
                    <path d="M10 0 L24 14" stroke="#c9a84c" strokeWidth="0.6" />
                  </svg>
                )}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs tracking-widest" style={{ color: ready ? '#c9a84c' : '#4a3520' }}>
                      {ready ? '✦ Ready to read' : `Opens ${revealDate}`}
                    </p>
                    <p className="text-xs" style={{ color: '#3d2b14' }}>
                      Written {msg.written}
                    </p>
                  </div>
                  <button
                    onClick={() => del(msg.id)}
                    className="text-xs transition-colors hover:opacity-100 opacity-40"
                    style={{ color: '#8a6d2f' }}
                  >
                    ✕
                  </button>
                </div>

                {ready ? (
                  <p
                    className="text-base italic leading-relaxed mt-2"
                    style={{ color: '#a89060', fontFamily: "'IM Fell English', serif" }}
                  >
                    {msg.text}
                  </p>
                ) : (
                  <div
                    className="mt-2 py-3 text-center text-xs tracking-widest"
                    style={{ background: 'rgba(0,0,0,0.3)', color: '#3d2b14' }}
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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('private_journal') || '[]')
    setEntries(stored)
  }, [])

  const save = () => {
    if (!body.trim()) return
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

    let updated
    if (editingId) {
      updated = entries.map(e =>
        e.id === editingId ? { ...e, title: title || 'Untitled', body, edited: `${dateStr}, ${timeStr}` } : e
      )
      setEditingId(null)
    } else {
      const entry = {
        id: Date.now(),
        title: title || 'Untitled',
        body,
        date: dateStr,
        time: timeStr,
      }
      updated = [entry, ...entries]
    }

    localStorage.setItem('private_journal', JSON.stringify(updated))
    setEntries(updated)
    setTitle('')
    setBody('')
  }

  const del = (id) => {
    const updated = entries.filter(e => e.id !== id)
    localStorage.setItem('private_journal', JSON.stringify(updated))
    setEntries(updated)
    if (viewEntry?.id === id) setViewEntry(null)
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
          background: 'rgba(26, 18, 9, 0.8)',
          border: '1px solid rgba(138, 109, 47, 0.3)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg italic"
            style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8' }}
          >
            {editingId ? 'Editing Entry' : 'New Entry'}
          </h3>
          <p className="text-xs" style={{ color: '#4a3520' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full bg-transparent outline-none mb-4 py-2 text-lg italic"
          style={{
            borderBottom: '1px solid rgba(138,109,47,0.2)',
            color: '#d4c49a',
            fontFamily: "'Playfair Display', serif",
          }}
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Begin writing..."
          rows={8}
          className="w-full outline-none resize-none text-base leading-relaxed p-4"
          style={{
            border: '1px solid rgba(138,109,47,0.15)',
            color: '#a89060',
            fontFamily: "'IM Fell English', serif",
            background: 'rgba(15,10,4,0.9)',
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(138,109,47,0.07) 28px)',
            lineHeight: '28px',
            paddingTop: '8px',
          }}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={save}
            disabled={!body.trim()}
            className="px-7 py-2.5 text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              background: 'transparent',
              border: '1px solid #8a6d2f',
              color: '#c9a84c',
              fontFamily: "'Playfair Display', serif",
              opacity: !body.trim() ? 0.4 : 1,
              cursor: !body.trim() ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => { if (body.trim()) { e.target.style.background = '#c9a84c'; e.target.style.color = '#0d0a05' }}}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#c9a84c' }}
          >
            {editingId ? 'Update Entry' : 'Record Entry'}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setTitle(''); setBody('') }}
              className="px-5 py-2.5 text-xs tracking-widest uppercase"
              style={{ color: '#4a3520', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Entry list */}
      {entries.length > 0 && (
        <div className="mt-8 space-y-3">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#4a3520' }}>
            Private Archive — {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
          {entries.map((entry) => (
            <div key={entry.id}>
              {viewEntry?.id === entry.id ? (
                <div
                  className="p-6"
                  style={{
                    background: 'rgba(26,18,9,0.9)',
                    border: '1px solid rgba(201,168,76,0.2)',
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4
                        className="text-xl italic"
                        style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8' }}
                      >
                        {entry.title}
                      </h4>
                      <p className="text-xs mt-1" style={{ color: '#4a3520' }}>
                        {entry.date} &nbsp;·&nbsp; {entry.time}
                        {entry.edited && ` (edited ${entry.edited})`}
                      </p>
                    </div>
                    <button onClick={() => setViewEntry(null)} style={{ color: '#6b5a3e', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
                      ✕
                    </button>
                  </div>
                  <p
                    className="text-base leading-relaxed whitespace-pre-wrap"
                    style={{ color: '#a89060', fontFamily: "'IM Fell English', serif" }}
                  >
                    {entry.body}
                  </p>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => edit(entry)} className="text-xs tracking-widest uppercase" style={{ color: '#8a6d2f', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Edit
                    </button>
                    <button onClick={() => del(entry.id)} className="text-xs tracking-widest uppercase" style={{ color: '#4a3520', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full text-left p-5 group transition-all duration-300"
                  onClick={() => setViewEntry(entry)}
                  style={{
                    background: 'rgba(13,10,5,0.6)',
                    border: '1px solid rgba(138,109,47,0.15)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(138,109,47,0.15)'}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        className="italic text-base"
                        style={{ fontFamily: "'Playfair Display', serif", color: '#d4c49a' }}
                      >
                        {entry.title}
                      </p>
                      <p className="text-xs mt-1 line-clamp-1" style={{ color: '#4a3520' }}>
                        {entry.body.substring(0, 60)}...
                      </p>
                    </div>
                    <p className="text-xs flex-shrink-0 ml-4" style={{ color: '#3d2b14' }}>
                      {entry.date}
                    </p>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Secret({ onLogout }) {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6" style={{ background: '#110e07', position: 'relative', overflow: 'hidden' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.45em] uppercase mb-4" style={{ color: '#4a3520' }}>
            ✦ &nbsp; Private Chambers &nbsp; ✦
          </p>
          <h1
            className="text-5xl italic mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8' }}
          >
            The Inner Study
          </h1>
          <p className="text-base" style={{ color: '#6b5a3e', fontFamily: "'IM Fell English', serif" }}>
            No one reads this. That is why you can write here.
          </p>
          <OrnateDivider className="mt-6" />
        </div>

        {/* Candle ambience — large, dramatic */}
        <div className="text-center mb-10" style={{ position: 'relative' }}>
          {/* Ambient radial warmth from the candle */}
          <div style={{
            position: 'absolute',
            left: '50%', top: '-20px',
            transform: 'translateX(-50%)',
            width: '320px', height: '200px',
            background: 'radial-gradient(ellipse 60% 55% at 50% 30%, rgba(245,158,11,0.12) 0%, rgba(201,168,76,0.04) 50%, transparent 80%)',
            pointerEvents: 'none',
          }} className="animate-flickerGlow" />
          <svg viewBox="0 0 80 140" className="w-20 h-28 mx-auto" fill="none" style={{ position: 'relative', zIndex: 1 }}>
            {/* Outer glow halo */}
            <ellipse cx="40" cy="22" rx="22" ry="26" fill="#f59e0b" fillOpacity="0.08" className="animate-flickerGlow" />
            {/* Main flame */}
            <ellipse cx="40" cy="18" rx="9" ry="16" fill="#f59e0b" opacity="0.85" className="animate-flicker" />
            <ellipse cx="40" cy="20" rx="5.5" ry="10" fill="#fde68a" opacity="0.75" className="animate-flicker" />
            {/* Inner bright core */}
            <ellipse cx="40" cy="23" rx="2.5" ry="4" fill="#fff9c4" opacity="0.9" />
            {/* Wick */}
            <line x1="40" y1="34" x2="40" y2="42" stroke="#2a1f0e" strokeWidth="1.8" />
            {/* Candle body */}
            <rect x="26" y="42" width="28" height="76" rx="2" fill="#f0e6c8" opacity="0.82" />
            {/* Highlight stripe */}
            <rect x="26" y="42" width="7" height="76" rx="0" fill="#d4c49a" opacity="0.35" />
            {/* Wax drips */}
            <path d="M26 58 Q18 64 20 75 L26 75 Z" fill="#f0e6c8" opacity="0.55" />
            <path d="M54 65 Q60 70 58 78 L54 78 Z" fill="#f0e6c8" opacity="0.4" />
            {/* Base plate */}
            <rect x="18" y="118" width="44" height="12" rx="3" fill="#8a6d2f" opacity="0.7" />
            <rect x="20" y="118" width="40" height="3" rx="1" fill="#c9a84c" opacity="0.25" />
          </svg>
        </div>

        {/* Private Journal */}
        <div className="mb-4">
          <h2
            className="text-2xl italic mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c' }}
          >
            Private Journal
          </h2>
          <PrivateJournal />
        </div>

        <OrnateDivider className="my-10" />

        {/* Message to self */}
        <div>
          <h2
            className="text-2xl italic mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c' }}
          >
            Letters to the Future
          </h2>
          <MessageToSelf />
        </div>

        <OrnateDivider className="mt-12" />

        {/* Logout */}
        <div className="text-center mt-8">
          <button
            onClick={onLogout}
            className="text-xs tracking-widest uppercase transition-colors duration-300"
            style={{ color: '#3d2b14', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => e.target.style.color = '#8a6d2f'}
            onMouseLeave={(e) => e.target.style.color = '#3d2b14'}
          >
            Leave the study →
          </button>
        </div>
      </div>
    </div>
  )
}
