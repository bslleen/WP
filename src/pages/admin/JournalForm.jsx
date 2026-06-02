import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getJournalEntry, createJournalEntry, updateJournalEntry } from '../../data/api'
import { OrnateDivider } from '../../components/OrnateElements'

const field = {
  width: '100%',
  background: 'rgba(13,10,5,0.5)',
  border: '1px solid rgba(138,109,47,0.2)',
  outline: 'none',
  padding: '0.7rem 1rem',
  color: '#d4c49a',
  fontFamily: "'IM Fell English', serif",
  fontSize: '0.95rem',
  resize: 'vertical',
}

const label = {
  display: 'block',
  color: '#8a6d2f',
  fontSize: '0.6rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  fontFamily: "'Playfair Display', serif",
  marginBottom: '0.5rem',
}

export default function JournalForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    body: '',
    excerpt: '',
    category: '',
    read_time: '',
    published: true,
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    getJournalEntry(id)
      .then(e => setForm({
        title: e.title || '',
        body: e.body || '',
        excerpt: e.excerpt || '',
        category: e.category || '',
        read_time: e.read_time || '',
        published: e.published ?? true,
      }))
      .catch(() => setError('Could not load entry.'))
      .finally(() => setLoading(false))
  }, [id])

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title || !form.body) {
      setError('Title and body are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (isEdit) await updateJournalEntry(id, form)
      else await createJournalEntry(form)
      navigate('/admin/journal')
    } catch (err) {
      setError(err.message || 'Failed to save entry.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <p style={{ color: '#4a3520', fontStyle: 'italic', fontFamily: "'IM Fell English', serif" }}>Retrieving…</p>
  )

  return (
    <div className="">
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#4a3520', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          ✦ &nbsp; {isEdit ? 'Revise Entry' : 'New Entry'} &nbsp; ✦
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8', fontSize: '2.2rem', fontStyle: 'italic' }}>
          {isEdit ? 'Edit Entry' : 'New Journal Entry'}
        </h1>
      </div>

      <OrnateDivider className="mb-8" />

      <form onSubmit={handleSubmit} style={{ maxWidth: '680px' }}>

        {/* Title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={label}>Title *</label>
          <input type="text" value={form.title} onChange={set('title')} placeholder="Entry title…" style={{ ...field, resize: undefined }} />
        </div>

        {/* Body */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={label}>Body *</label>
          <textarea
            value={form.body}
            onChange={set('body')}
            placeholder="Begin writing…"
            rows={14}
            style={{ ...field, lineHeight: 1.85, fontSize: '1rem' }}
          />
        </div>

        {/* Excerpt */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={label}>Excerpt</label>
          <textarea value={form.excerpt} onChange={set('excerpt')} placeholder="A short summary for the listing…" rows={3} style={field} />
        </div>

        {/* Category + Read time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={label}>Category</label>
            <input type="text" value={form.category} onChange={set('category')} placeholder="e.g. Reflections" style={{ ...field, resize: undefined }} />
          </div>
          <div>
            <label style={label}>Read Time</label>
            <input type="text" value={form.read_time} onChange={set('read_time')} placeholder="e.g. 4 min read" style={{ ...field, resize: undefined }} />
          </div>
        </div>

        {/* Published toggle */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ ...label, marginBottom: 0 }}>Published</span>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, published: !f.published }))}
            style={{
              background: 'transparent',
              border: `1px solid ${form.published ? 'rgba(201,168,76,0.4)' : 'rgba(107,90,62,0.4)'}`,
              color: form.published ? '#c9a84c' : '#6b5a3e',
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              padding: '4px 14px',
              cursor: 'pointer',
              fontFamily: "'Playfair Display', serif",
              transition: 'all 0.2s',
            }}
          >
            {form.published ? '✦ Published' : '◯ Draft'}
          </button>
        </div>

        {error && (
          <p style={{ color: '#c9a84c', opacity: 0.75, fontSize: '0.75rem', marginBottom: '1rem' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold"
            style={{ opacity: saving ? 0.5 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving…' : isEdit ? 'Update Entry' : 'Create Entry'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/journal')}
            style={{
              background: 'none', border: 'none', color: '#4a3520',
              fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: "'Playfair Display', serif",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
