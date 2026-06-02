import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getWork, createWork, updateWork, uploadImage } from '../../data/api'
import { OrnateDivider } from '../../components/OrnateElements'

const CATEGORIES = ['novel', 'poetry', 'short story']
const STATUSES = ['published', 'in progress', 'archived']

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

export default function WorkForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    description: '',
    excerpt: '',
    category: 'novel',
    year: '',
    pages: '',
    status: 'published',
    cover_image: '',
    accent_color: '#c9a84c',
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    getWork(id)
      .then(w => setForm({
        title: w.title || '',
        description: w.description || '',
        excerpt: w.excerpt || '',
        category: w.category || 'novel',
        year: w.year || '',
        pages: w.pages || '',
        status: w.status || 'published',
        cover_image: w.cover_image || '',
        accent_color: w.accent_color || '#c9a84c',
      }))
      .catch(() => setError('Could not load work.'))
      .finally(() => setLoading(false))
  }, [id])

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleImageUpload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await uploadImage(file)
      setForm(f => ({ ...f, cover_image: url }))
    } catch {
      setError('Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title || !form.description || !form.category) {
      setError('Title, description, and category are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const body = { ...form, pages: form.pages ? parseInt(form.pages, 10) : 0 }
      if (isEdit) await updateWork(id, body)
      else await createWork(body)
      navigate('/admin/works')
    } catch (err) {
      setError(err.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p style={{ color: '#4a3520', fontStyle: 'italic', fontFamily: "'IM Fell English', serif" }}>Retrieving…</p>
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#4a3520', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          ✦ &nbsp; {isEdit ? 'Revise Entry' : 'New Entry'} &nbsp; ✦
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8', fontSize: '2.2rem', fontStyle: 'italic' }}>
          {isEdit ? 'Edit Work' : 'New Work'}
        </h1>
      </div>

      <OrnateDivider className="mb-8" />

      <form onSubmit={handleSubmit} style={{ maxWidth: '680px' }}>

        {/* Title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={label}>Title *</label>
          <input type="text" value={form.title} onChange={set('title')} placeholder="The title of the work…" style={field} />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={label}>Description *</label>
          <textarea value={form.description} onChange={set('description')} placeholder="A full description…" rows={5} style={field} />
        </div>

        {/* Excerpt */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={label}>Excerpt</label>
          <textarea value={form.excerpt} onChange={set('excerpt')} placeholder="A short teaser for listings…" rows={3} style={field} />
        </div>

        {/* Category + Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={label}>Category *</label>
            <select value={form.category} onChange={set('category')} style={{ ...field, appearance: 'none', cursor: 'pointer', resize: undefined }}>
              {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#1a1209' }}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Status</label>
            <select value={form.status} onChange={set('status')} style={{ ...field, appearance: 'none', cursor: 'pointer', resize: undefined }}>
              {STATUSES.map(s => <option key={s} value={s} style={{ background: '#1a1209' }}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Year + Pages */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={label}>Year</label>
            <input type="text" value={form.year} onChange={set('year')} placeholder="e.g. 2024" style={{ ...field, resize: undefined }} />
          </div>
          <div>
            <label style={label}>Pages</label>
            <input type="number" value={form.pages} onChange={set('pages')} placeholder="0" min={0} style={{ ...field, resize: undefined }} />
          </div>
        </div>

        {/* Cover image */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={label}>Cover Image</label>
          {form.cover_image && (
            <img
              src={form.cover_image}
              alt="Cover"
              style={{ display: 'block', width: '72px', height: '100px', objectFit: 'cover', border: '1px solid rgba(138,109,47,0.3)', opacity: 0.85, marginBottom: '0.75rem' }}
            />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <label style={{
              padding: '0.45rem 1.1rem',
              cursor: uploading ? 'wait' : 'pointer',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: "'Playfair Display', serif",
              color: '#8a6d2f',
              border: '1px solid rgba(138,109,47,0.3)',
              background: 'transparent',
              display: 'inline-block',
              transition: 'color 0.2s',
            }}>
              {uploading ? 'Uploading…' : form.cover_image ? 'Replace' : 'Upload File'}
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
            {form.cover_image && (
              <button type="button" onClick={() => setForm(f => ({ ...f, cover_image: '' }))}
                style={{ background: 'none', border: 'none', color: '#4a3520', fontSize: '0.62rem', cursor: 'pointer', letterSpacing: '0.1em' }}>
                Remove
              </button>
            )}
          </div>
          <input
            type="text"
            value={form.cover_image}
            onChange={set('cover_image')}
            placeholder="Or paste an image URL…"
            style={{ ...field, resize: undefined, fontSize: '0.8rem', color: '#6b5a3e' }}
          />
        </div>

        {/* Accent color */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={label}>Accent Colour</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="color"
              value={form.accent_color}
              onChange={set('accent_color')}
              style={{
                width: '44px', height: '44px',
                border: '1px solid rgba(138,109,47,0.4)',
                background: 'transparent',
                cursor: 'pointer',
                padding: '2px',
                flexShrink: 0,
              }}
            />
            <input
              type="text"
              value={form.accent_color}
              onChange={set('accent_color')}
              placeholder="#c9a84c"
              style={{ ...field, width: '130px', resize: undefined }}
            />
            <div style={{
              width: '24px', height: '24px',
              background: form.accent_color,
              border: '1px solid rgba(138,109,47,0.3)',
              flexShrink: 0,
            }} />
          </div>
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
            {saving ? 'Saving…' : isEdit ? 'Update Work' : 'Create Work'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/works')}
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
