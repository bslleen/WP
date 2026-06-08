import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllJournal, updateJournalEntry, deleteJournalEntry } from '../../data/api'
import { OrnateDivider } from '../../components/OrnateElements'

// ── Publish popover ───────────────────────────────────────────────────────────
function PublishPopover({ isPublished, onConfirm, onCancel }) {
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onCancel()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onCancel])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        right: 0, top: '110%',
        zIndex: 20,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-strong)',
        padding: '1rem 1.25rem',
        minWidth: '210px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
      }}
    >
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.72rem',
        lineHeight: 1.5,
        marginBottom: '0.9rem',
        fontFamily: "'Crimson Text', serif",
      }}>
        {isPublished
          ? 'Move back to draft? It will be hidden from readers.'
          : 'Make this public? Your readers will see it.'}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={onConfirm}
          style={{
            background: 'var(--accent)', border: 'none',
            color: 'var(--bg-primary)', padding: '5px 14px',
            fontSize: '0.56rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', cursor: 'pointer',
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          style={{
            background: 'none', border: '1px solid var(--border)',
            color: 'var(--text-muted)', padding: '5px 14px',
            fontSize: '0.56rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', cursor: 'pointer',
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── DRAFT / LIVE toggle button ────────────────────────────────────────────────
function PublishToggle({ entry, onToggle, toggling }) {
  const [showPopover, setShowPopover] = useState(false)
  const isLive = entry.published === true

  const handleConfirm = () => {
    setShowPopover(false)
    onToggle(entry, !isLive)
  }

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => !toggling && setShowPopover(o => !o)}
        disabled={toggling}
        title={isLive ? 'Currently live — click to draft' : 'Currently draft — click to publish'}
        style={{
          background: isLive ? 'var(--accent)' : 'transparent',
          border: `1px solid ${isLive ? 'var(--accent)' : 'var(--border-strong)'}`,
          color: isLive ? 'var(--bg-primary)' : 'var(--text-muted)',
          fontSize: '0.52rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          padding: '4px 12px',
          cursor: toggling ? 'wait' : 'pointer',
          fontFamily: "'Playfair Display', serif",
          whiteSpace: 'nowrap',
          opacity: toggling ? 0.4 : 1,
          transition: 'all 0.2s',
          minHeight: '28px',
        }}
      >
        {toggling ? '…' : isLive ? 'LIVE' : 'DRAFT'}
      </button>
      {showPopover && (
        <PublishPopover
          isPublished={isLive}
          onConfirm={handleConfirm}
          onCancel={() => setShowPopover(false)}
        />
      )}
    </div>
  )
}

export default function AdminJournal() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchAllJournal()
      .then(e => setEntries(e || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async (entry, nextPublished) => {
    setTogglingId(entry.id)
    try {
      await updateJournalEntry(entry.id, { published: nextPublished })
      setEntries(es => es.map(e => e.id === entry.id ? { ...e, published: nextPublished } : e))
    } catch {} finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this entry permanently?')) return
    setDeletingId(id)
    try {
      await deleteJournalEntry(id)
      setEntries(es => es.filter(e => e.id !== id))
    } catch {} finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <p style={{ color: 'var(--text-faint)', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            ✦ &nbsp; Chronicle &nbsp; ✦
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', fontSize: '2.2rem', fontStyle: 'italic' }}>
            Journal
          </h1>
        </div>
        <Link to="/admin/journal/new" className="btn-gold" style={{ textDecoration: 'none', fontSize: '0.62rem' }}>
          + New Entry
        </Link>
      </div>

      <OrnateDivider className="mb-8" />

      {loading ? (
        <p style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontFamily: "'IM Fell English', serif" }}>
          Consulting the archives…
        </p>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontFamily: "'IM Fell English', serif", fontSize: '1.1rem' }}>
            The chronicle is empty.
          </p>
          <Link to="/admin/journal/new" style={{ color: 'var(--accent-dim)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'block', marginTop: '1rem' }}>
            Write the first entry →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {entries.map(entry => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--text-primary)',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {entry.title}
                </p>
                <p style={{ color: 'var(--text-faint)', fontSize: '0.62rem', marginTop: '2px' }}>
                  {[entry.category, entry.read_time].filter(Boolean).join(' · ')}
                </p>
              </div>

              {/* DRAFT / LIVE toggle */}
              <PublishToggle
                entry={entry}
                onToggle={handleToggle}
                toggling={togglingId === entry.id}
              />

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', flexShrink: 0, alignItems: 'center' }}>
                {entry.published && (
                  <a
                    href="/journal"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-faint)', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.target.style.color = 'var(--accent-dim)')}
                    onMouseLeave={e => (e.target.style.color = 'var(--text-faint)')}
                  >
                    View ↗
                  </a>
                )}
                <Link
                  to={`/admin/journal/${entry.id}/edit`}
                  style={{ color: 'var(--accent-dim)', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--text-faint)', fontSize: '0.62rem',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    cursor: 'pointer', padding: 0,
                    opacity: deletingId === entry.id ? 0.4 : 1,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.target.style.color = 'var(--accent-dim)')}
                  onMouseLeave={e => (e.target.style.color = 'var(--text-faint)')}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
