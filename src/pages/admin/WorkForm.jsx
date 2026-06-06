import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getWork, createWork, updateWork, uploadImage } from '../../data/api'
import { OrnateDivider } from '../../components/OrnateElements'

const CATEGORIES = ['novel', 'poetry', 'short story']

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

const labelStyle = {
  display: 'block',
  color: '#8a6d2f',
  fontSize: '0.6rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  fontFamily: "'Playfair Display', serif",
  marginBottom: '0.5rem',
}

// ── Inline preview card (mirrors public Works page card) ─────────────────────
function PreviewCard({ work }) {
  const accentColor = work.accent_color || '#c9a84c'
  return (
    <div style={{
      border: '1px solid rgba(201,168,76,0.25)',
      background: '#f0e8d8',
      maxWidth: '260px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    }}>
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        {work.cover_image ? (
          <img src={work.cover_image} alt={work.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%) brightness(0.9)' }} />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(150deg, ${accentColor}33 0%, #080604 100%)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              color: '#f0e6c8',
              fontSize: '1rem',
              fontStyle: 'italic',
              textAlign: 'center',
              lineHeight: 1.35,
            }}>
              {work.title || 'Untitled'}
            </p>
          </div>
        )}
      </div>
      <div style={{ padding: '14px 16px 18px', borderTop: '1px solid #c8b89a' }}>
        <p style={{ fontFamily: "'Playfair Display', serif", color: '#1c140a', fontSize: '0.95rem', fontWeight: 400, lineHeight: 1.3, marginBottom: '4px' }}>
          {work.title || 'Untitled'}
        </p>
        <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: 'italic', color: '#7a6548', fontSize: '0.85rem', marginBottom: '5px' }}>
          {work.category} · {work.year}
        </p>
        <p style={{ fontFamily: "'Crimson Text', serif", color: '#4a3a2a', fontSize: '0.85rem', lineHeight: 1.5 }}>
          {work.description ? work.description.substring(0, 80) + (work.description.length > 80 ? '…' : '') : ''}
        </p>
      </div>
    </div>
  )
}

// ── Preview + publish modal ──────────────────────────────────────────────────
function PreviewModal({ work, savedId, onClose, onPublished }) {
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  const handlePublish = async () => {
    setPublishing(true)
    try {
      await updateWork(savedId, { status: 'published' })
      setPublished(true)
      setTimeout(() => { onPublished(); onClose() }, 1200)
    } catch {
      setPublishing(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'linear-gradient(160deg, #1a1209, #0d0a05)',
        border: '1px solid #3a2e1a',
        padding: '2.5rem',
        width: '100%', maxWidth: '520px',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 20,
            background: 'none', border: 'none',
            color: '#4a3520', cursor: 'pointer',
            fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.target.style.color = '#c9a84c')}
          onMouseLeave={e => (e.target.style.color = '#4a3520')}
        >
          ✕ CLOSE
        </button>

        <p style={{ color: '#4a3520', fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Preview
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8', fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
          How it will appear
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <PreviewCard work={work} />
        </div>

        <div style={{ borderTop: '0.5px solid #2a1e0a', paddingTop: '1.5rem' }}>
          {published ? (
            <p style={{
              textAlign: 'center', color: '#c9a84c',
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
              fontSize: '1rem',
            }}>
              ✦ Published.
            </p>
          ) : (
            <button
              onClick={handlePublish}
              disabled={publishing}
              style={{
                width: '100%', padding: '14px 0',
                background: publishing ? 'rgba(201,168,76,0.3)' : '#c9a84c',
                border: '1px solid #c9a84c',
                color: publishing ? '#c9a84c' : '#0d0a05',
                fontFamily: "'Playfair Display', serif",
                fontSize: '0.68rem', letterSpacing: '0.25em',
                textTransform: 'uppercase', cursor: publishing ? 'wait' : 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {publishing ? 'Publishing…' : 'Publish to site →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
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
    status: 'in progress',
    cover_image: '',
    accent_color: '#c9a84c',
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState(isEdit ? id : null)
  const [draftSaved, setDraftSaved] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getWork(id)
      .then(w => {
        setForm({
          title: w.title || '',
          description: w.description || '',
          excerpt: w.excerpt || '',
          category: w.category || 'novel',
          year: w.year || '',
          pages: w.pages || '',
          status: w.status || 'in progress',
          cover_image: w.cover_image || '',
          accent_color: w.accent_color || '#c9a84c',
        })
        setSavedId(w.id)
      })
      .catch(() => setError('Could not load work.'))
      .finally(() => setLoading(false))
  }, [id])

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))

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
    setDraftSaved(false)
    try {
      const body = {
        ...form,
        pages: form.pages ? parseInt(form.pages, 10) : 0,
        status: 'in progress', // always save as draft
      }
      let result
      if (isEdit) {
        result = await updateWork(id, body)
        setSavedId(result.id || id)
      } else {
        result = await createWork(body)
        setSavedId(result.id)
      }
      setDraftSaved(true)
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
    <div>
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
          <label style={labelStyle}>Title *</label>
          <input type="text" value={form.title} onChange={set('title')} placeholder="The title of the work…" style={field} />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Description *</label>
          <textarea value={form.description} onChange={set('description')} placeholder="A full description…" rows={5} style={field} />
        </div>

        {/* Excerpt */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Excerpt</label>
          <textarea value={form.excerpt} onChange={set('excerpt')} placeholder="A short teaser for listings…" rows={3} style={field} />
        </div>

        {/* Category */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Category *</label>
          <select value={form.category} onChange={set('category')} style={{ ...field, appearance: 'none', cursor: 'pointer', resize: undefined }}>
            {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#1a1209' }}>{c}</option>)}
          </select>
        </div>

        {/* Year + Pages */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Year</label>
            <input type="text" value={form.year} onChange={set('year')} placeholder="e.g. 2024" style={{ ...field, resize: undefined }} />
          </div>
          <div>
            <label style={labelStyle}>Pages</label>
            <input type="number" value={form.pages} onChange={set('pages')} placeholder="0" min={0} style={{ ...field, resize: undefined }} />
          </div>
        </div>

        {/* Cover image */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Cover Image</label>
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
          <label style={labelStyle}>Accent Colour</label>
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

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold"
            style={{ opacity: saving ? 0.5 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving…' : isEdit ? 'Save Draft' : 'Save to Drafts'}
          </button>

          {draftSaved && (
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(201,168,76,0.4)',
                color: '#c9a84c',
                padding: '10px 24px',
                fontFamily: "'Playfair Display', serif",
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.background = 'rgba(201,168,76,0.1)' }}
              onMouseLeave={e => { e.target.style.background = 'transparent' }}
            >
              Preview →
            </button>
          )}

          {draftSaved && (
            <span style={{ color: '#8a6d2f', fontSize: '0.62rem', letterSpacing: '0.15em', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
              Saved to drafts.
            </span>
          )}

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

      {showPreview && savedId && (
        <PreviewModal
          work={form}
          savedId={savedId}
          onClose={() => setShowPreview(false)}
          onPublished={() => navigate('/admin/works')}
        />
      )}
    </div>
  )
}
