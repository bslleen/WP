import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWorks, updateWork, deleteWork } from '../../data/api'
import { OrnateDivider } from '../../components/OrnateElements'

const STATUS_CYCLE = { published: 'in progress', 'in progress': 'archived', archived: 'published' }
const STATUS_COLORS = { published: '#c9a84c', 'in progress': '#8a6d2f', archived: '#4a3520' }

export default function AdminWorks() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    getWorks()
      .then(w => setWorks(w || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleStatus = async (work) => {
    setTogglingId(work.id)
    const next = STATUS_CYCLE[work.status] || 'published'
    try {
      const updated = await updateWork(work.id, { status: next })
      setWorks(ws => ws.map(w => w.id === work.id ? { ...w, status: updated.status } : w))
    } catch {} finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this work permanently?')) return
    setDeletingId(id)
    try {
      await deleteWork(id)
      setWorks(ws => ws.filter(w => w.id !== id))
    } catch {} finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <p style={{ color: '#4a3520', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            ✦ &nbsp; Catalogue &nbsp; ✦
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8', fontSize: '2.2rem', fontStyle: 'italic' }}>
            Works
          </h1>
        </div>
        <Link to="/admin/works/new" className="btn-gold" style={{ textDecoration: 'none', fontSize: '0.62rem' }}>
          + New Work
        </Link>
      </div>

      <OrnateDivider className="mb-8" />

      {loading ? (
        <p style={{ color: '#4a3520', fontStyle: 'italic', fontFamily: "'IM Fell English', serif" }}>
          Consulting the archives…
        </p>
      ) : works.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: '#4a3520', fontStyle: 'italic', fontFamily: "'IM Fell English', serif", fontSize: '1.1rem' }}>
            The shelves are empty.
          </p>
          <Link to="/admin/works/new" style={{ color: '#8a6d2f', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'block', marginTop: '1rem' }}>
            Add a work →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {works.map(work => {
            const statusColor = STATUS_COLORS[work.status] || '#6b5a3e'
            return (
              <div
                key={work.id}
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
                {/* Cover swatch */}
                {work.cover_image ? (
                  <img
                    src={work.cover_image}
                    alt=""
                    style={{ width: '38px', height: '54px', objectFit: 'cover', flexShrink: 0, opacity: 0.8 }}
                  />
                ) : (
                  <div style={{
                    width: '38px', height: '54px', flexShrink: 0,
                    border: '1px solid rgba(138,109,47,0.2)',
                    background: `${work.accent_color || '#c9a84c'}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: work.accent_color || '#8a6d2f', fontSize: '0.75rem', opacity: 0.35 }}>✦</span>
                  </div>
                )}

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
                    {work.title}
                  </p>
                  <p style={{ color: '#4a3520', fontSize: '0.62rem', marginTop: '2px' }}>
                    {[work.category, work.year, work.pages ? `${work.pages}pp` : null].filter(Boolean).join(' · ')}
                  </p>
                </div>

                {/* Status toggle — click to cycle */}
                <button
                  onClick={() => toggleStatus(work)}
                  disabled={togglingId === work.id}
                  title="Click to cycle status"
                  style={{
                    background: 'transparent',
                    border: `1px solid ${statusColor}44`,
                    color: statusColor,
                    fontSize: '0.56rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    cursor: 'pointer',
                    fontFamily: "'Playfair Display', serif",
                    whiteSpace: 'nowrap',
                    opacity: togglingId === work.id ? 0.4 : 1,
                    transition: 'opacity 0.2s',
                    flexShrink: 0,
                  }}
                >
                  {work.status}
                </button>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
                  <Link
                    to={`/admin/works/${work.id}/edit`}
                    style={{ color: '#8a6d2f', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(work.id)}
                    disabled={deletingId === work.id}
                    style={{
                      background: 'none', border: 'none',
                      color: '#4a3520', fontSize: '0.62rem',
                      letterSpacing: '0.15em', textTransform: 'uppercase',
                      cursor: 'pointer', padding: 0,
                      opacity: deletingId === work.id ? 0.4 : 1,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.target.style.color = '#8a3520')}
                    onMouseLeave={e => (e.target.style.color = '#4a3520')}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
