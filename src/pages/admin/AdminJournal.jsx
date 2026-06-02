import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllJournalEntries, updateJournalEntry, deleteJournalEntry } from '../../data/api'
import { OrnateDivider } from '../../components/OrnateElements'

export default function AdminJournal() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    getAllJournalEntries()
      .then(e => setEntries(e || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const togglePublished = async entry => {
    setTogglingId(entry.id)
    try {
      const updated = await updateJournalEntry(entry.id, { published: !entry.published })
      setEntries(es => es.map(e => e.id === entry.id ? { ...e, published: updated.published } : e))
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
    <div className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <p style={{ color: '#4a3520', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            ✦ &nbsp; Chronicle &nbsp; ✦
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8', fontSize: '2.2rem', fontStyle: 'italic' }}>
            Journal
          </h1>
        </div>
        <Link to="/admin/journal/new" className="btn-gold" style={{ textDecoration: 'none', fontSize: '0.62rem' }}>
          + New Entry
        </Link>
      </div>

      <OrnateDivider className="mb-8" />

      {loading ? (
        <p style={{ color: '#4a3520', fontStyle: 'italic', fontFamily: "'IM Fell English', serif" }}>
          Consulting the archives…
        </p>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: '#4a3520', fontStyle: 'italic', fontFamily: "'IM Fell English', serif", fontSize: '1.1rem' }}>
            The chronicle is empty.
          </p>
          <Link to="/admin/journal/new" style={{ color: '#8a6d2f', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'block', marginTop: '1rem' }}>
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
                border: '1px solid rgba(138,109,47,0.2)',
                background: 'rgba(26,18,9,0.4)',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(138,109,47,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(138,109,47,0.2)')}
            >
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#d4c49a',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {entry.title}
                </p>
                <p style={{ color: '#4a3520', fontSize: '0.62rem', marginTop: '2px' }}>
                  {[entry.category, entry.read_time].filter(Boolean).join(' · ')}
                </p>
              </div>

              {/* Published toggle */}
              <button
                onClick={() => togglePublished(entry)}
                disabled={togglingId === entry.id}
                title="Toggle published"
                style={{
                  background: 'transparent',
                  border: `1px solid ${entry.published ? 'rgba(201,168,76,0.35)' : 'rgba(107,90,62,0.35)'}`,
                  color: entry.published ? '#c9a84c' : '#6b5a3e',
                  fontSize: '0.56rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  cursor: 'pointer',
                  fontFamily: "'Playfair Display', serif",
                  whiteSpace: 'nowrap',
                  opacity: togglingId === entry.id ? 0.4 : 1,
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {entry.published ? 'Published' : 'Draft'}
              </button>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
                <Link
                  to={`/admin/journal/${entry.id}/edit`}
                  style={{ color: '#8a6d2f', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  style={{
                    background: 'none', border: 'none',
                    color: '#4a3520', fontSize: '0.62rem',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    cursor: 'pointer', padding: 0,
                    opacity: deletingId === entry.id ? 0.4 : 1,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.target.style.color = '#8a3520')}
                  onMouseLeave={e => (e.target.style.color = '#4a3520')}
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
