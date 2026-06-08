import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { fetchWork, createWork, updateWork, uploadImage } from '../../data/api'
import { OrnateDivider } from '../../components/OrnateElements'

const CATEGORIES = ['novel', 'poetry', 'short story']

const field = {
  width: '100%',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  outline: 'none',
  padding: '0.7rem 1rem',
  color: 'var(--text-primary)',
  fontFamily: "'IM Fell English', serif",
  fontSize: '0.95rem',
  resize: 'vertical',
}

const labelStyle = {
  display: 'block',
  color: 'var(--accent-dim)',
  fontSize: '0.6rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  fontFamily: "'Playfair Display', serif",
  marginBottom: '0.5rem',
}

// ── Inline preview card (mirrors public Works page card) ─────────────────────
function PreviewCard({ work }) {
  const accentColor = work.accent_color || 'var(--accent)'
  return (
    <div style={{
      border: '1px solid var(--border-strong)',
      background: 'var(--bg-secondary)',
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
            background: `linear-gradient(150deg, ${accentColor}33 0%, var(--bg-primary) 100%)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text-primary)',
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
      <div style={{ padding: '14px 16px 18px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 400, lineHeight: 1.3, marginBottom: '4px' }}>
          {work.title || 'Untitled'}
        </p>
        <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '5px' }}>
          {work.category} · {work.year}
        </p>
        <p style={{ fontFamily: "'Crimson Text', serif", color: 'var(--text-faint)', fontSize: '0.85rem', lineHeight: 1.5 }}>
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
        background: 'var(--overlay)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'linear-gradient(160deg, var(--bg-secondary), var(--bg-primary))',
        border: '1px solid var(--text-faint)',
        padding: '2.5rem',
        width: '100%', maxWidth: '520px',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 20,
            background: 'none', border: 'none',
            color: 'var(--text-faint)', cursor: 'pointer',
            fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.target.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.target.style.color = 'var(--text-faint)')}
        >
          ✕ CLOSE
        </button>

        <p style={{ color: 'var(--text-faint)', fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Preview
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
          How it will appear
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <PreviewCard work={work} />
        </div>

        <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: '1.5rem' }}>
          {published ? (
            <p style={{
              textAlign: 'center', color: 'var(--accent)',
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
                background: publishing ? 'rgba(201,168,76,0.3)' : 'var(--accent)',
                border: '1px solid var(--accent)',
                color: publishing ? 'var(--accent)' : 'var(--bg-primary)',
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
    storyStatus: 'ongoing',
  })
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState(isEdit ? id : null)
  const [draftSaved, setDraftSaved] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    fetchWork(id)
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
          storyStatus: w.storyStatus || 'ongoing',
        })
        setTags(w.tags || [])
        setSavedId(w.id)
      })
      .catch(() => setError('Could not load work.'))
      .finally(() => setLoading(false))
  }, [id])

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed])
      setTagInput('')
    }
  }

  const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag))

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const handleImageUpload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm(f => ({ ...f, cover_image: url }))
    } catch {
      setError('Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const saveWork = async (publishNow = false) => {
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
        tags,
        pages: form.pages ? parseInt(form.pages, 10) : 0,
        status: publishNow ? 'published' : (isEdit ? form.status : 'in progress'),
      }
      if (isEdit) {
        await updateWork(id, body)
        setSavedId(id)
      } else {
        const result = await createWork(body)
        setSavedId(result.id)
      }
      if (publishNow) {
        navigate('/admin/works')
      } else {
        setDraftSaved(true)
      }
    } catch (err) {
      setError(err.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = e => { e.preventDefault(); saveWork(false) }
  const handlePublishNow = () => saveWork(true)

  if (loading) {
    return <p style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontFamily: "'IM Fell English', serif" }}>Retrieving…</p>
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <Link
            to="/admin/works"
            style={{ color: 'var(--text-faint)', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: "'Playfair Display', serif", textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.target.style.color = 'var(--accent-dim)')}
            onMouseLeave={e => (e.target.style.color = 'var(--text-faint)')}
          >
            ← Works
          </Link>
          <span style={{ color: 'var(--border)', fontSize: '0.58rem' }}>/</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: "'Playfair Display', serif" }}>
            {isEdit ? (form.title || 'Edit') : 'New'}
          </span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', fontSize: '2.2rem', fontStyle: 'italic' }}>
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
            {CATEGORIES.map(c => <option key={c} value={c} style={{ background: 'var(--bg-secondary)' }}>{c}</option>)}
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

        {/* Story Status */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Story Status</label>
          <select value={form.storyStatus} onChange={set('storyStatus')} style={{ ...field, appearance: 'none', cursor: 'pointer', resize: undefined }}>
            <option value="ongoing" style={{ background: 'var(--bg-secondary)' }}>Ongoing</option>
            <option value="completed" style={{ background: 'var(--bg-secondary)' }}>Completed</option>
          </select>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Tags</label>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '11px', padding: '4px 10px',
                  background: 'var(--accent-faint)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px', padding: 0, lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="Add tag (press Enter)"
              style={{ ...field, resize: undefined }}
            />
            <button
              type="button"
              onClick={addTag}
              className="btn-gold"
              style={{ fontSize: '0.6rem', letterSpacing: '0.15em', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Cover image */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Cover Image</label>
          {form.cover_image && (
            <img
              src={form.cover_image}
              alt="Cover"
              style={{ display: 'block', width: '72px', height: '100px', objectFit: 'cover', border: '1px solid var(--border)', opacity: 0.85, marginBottom: '0.75rem' }}
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
              color: 'var(--accent-dim)',
              border: '1px solid var(--border)',
              background: 'transparent',
              display: 'inline-block',
              transition: 'color 0.2s',
            }}>
              {uploading ? 'Uploading…' : form.cover_image ? 'Replace' : 'Upload File'}
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
            {form.cover_image && (
              <button type="button" onClick={() => setForm(f => ({ ...f, cover_image: '' }))}
                style={{ background: 'none', border: 'none', color: 'var(--text-faint)', fontSize: '0.62rem', cursor: 'pointer', letterSpacing: '0.1em' }}>
                Remove
              </button>
            )}
          </div>
          <input
            type="text"
            value={form.cover_image}
            onChange={set('cover_image')}
            placeholder="Or paste an image URL…"
            style={{ ...field, resize: undefined, fontSize: '0.8rem', color: 'var(--text-muted)' }}
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
                border: '1px solid var(--border-strong)',
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
              border: '1px solid var(--border)',
              flexShrink: 0,
            }} />
          </div>
        </div>

        {error && (
          <p style={{ color: 'var(--accent)', opacity: 0.75, fontSize: '0.75rem', marginBottom: '1rem' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold"
            style={{ opacity: saving ? 0.5 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving…' : isEdit ? 'Save' : 'Save to Drafts'}
          </button>

          <button
            type="button"
            onClick={handlePublishNow}
            disabled={saving}
            style={{
              background: form.status === 'published' && isEdit ? 'rgba(201,168,76,0.12)' : 'transparent',
              border: '1px solid var(--border-strong)',
              color: 'var(--accent)',
              padding: '10px 24px',
              fontFamily: "'Playfair Display', serif",
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.background = 'rgba(201,168,76,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.background = form.status === 'published' && isEdit ? 'rgba(201,168,76,0.12)' : 'transparent' }}
          >
            {form.status === 'published' && isEdit ? '✦ Live — Save' : 'Save & Publish →'}
          </button>

          {draftSaved && (
            <>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', padding: '10px 20px',
                  fontFamily: "'Playfair Display', serif", fontSize: '0.62rem',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--accent-dim)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                Preview
              </button>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.62rem', letterSpacing: '0.15em', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                Saved.
              </span>
            </>
          )}

          <button
            type="button"
            onClick={() => navigate('/admin/works')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-faint)',
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
