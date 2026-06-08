import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { fetchJournalEntry, createJournalEntry, updateJournalEntry } from '../../data/api'
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

const labelStyle = {
  display: 'block',
  color: '#8a6d2f',
  fontSize: '0.6rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  fontFamily: "'Playfair Display', serif",
  marginBottom: '0.5rem',
}

// ── Preview card (mirrors public Journal entry list item) ─────────────────────
function PreviewCard({ entry }) {
  return (
    <div style={{
      background: 'rgba(13,10,5,0.7)',
      border: '0.5px solid #3a2e1a',
      padding: '2rem',
      maxWidth: '420px',
    }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: '#5a4a2a', marginBottom: 6, textTransform: 'uppercase' }}>
        {entry.category || 'Journal'}
      </p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontStyle: 'italic', fontWeight: 300, color: '#e8dcc0', marginBottom: 10, lineHeight: 1.2 }}>
        {entry.title || 'Untitled'}
      </h2>
      {entry.read_time && (
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: '#2a2010', marginBottom: 16, textTransform: 'uppercase' }}>
          {entry.read_time} READ
        </p>
      )}
      <div style={{ height: '0.5px', background: '#1a1410', marginBottom: 20 }} />
      <div style={{ fontSize: 15, lineHeight: 1.85, color: '#8a7a5a', maxHeight: '200px', overflow: 'hidden' }}>
        {(entry.body || entry.excerpt || '').split('\n\n').slice(0, 3).map((p, i) => (
          <p key={i} style={{ marginBottom: '1em' }}>{p}</p>
        ))}
      </div>
      {(entry.body || '').split('\n\n').length > 3 && (
        <p style={{ color: '#3a2e1a', fontSize: 11, fontStyle: 'italic', marginTop: 8 }}>… continues</p>
      )}
    </div>
  )
}

// ── Preview + publish modal ────────────────────────────────────────────────────
function PreviewModal({ entry, savedId, onClose, onPublished }) {
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  const handlePublish = async () => {
    setPublishing(true)
    try {
      await updateJournalEntry(savedId, { published: true })
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
        maxHeight: '90vh', overflowY: 'auto',
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
          <PreviewCard entry={entry} />
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
    published: false,
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState(isEdit ? id : null)
  const [draftSaved, setDraftSaved] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    fetchJournalEntry(id)
      .then(e => {
        setForm({
          title: e.title || '',
          body: e.body || '',
          excerpt: e.excerpt || '',
          category: e.category || '',
          read_time: e.read_time || '',
          published: e.published ?? false,
        })
        setSavedId(e.id || id)
      })
      .catch(() => setError('Could not load entry.'))
      .finally(() => setLoading(false))
  }, [id])

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const saveEntry = async (publishNow = false) => {
    if (!form.title || !form.body) {
      setError('Title and body are required.')
      return
    }
    setSaving(true)
    setError('')
    setDraftSaved(false)
    try {
      const body = {
        ...form,
        published: publishNow ? true : (isEdit ? form.published : false),
      }
      if (isEdit) {
        await updateJournalEntry(id, body)
        setSavedId(id)
      } else {
        const result = await createJournalEntry(body)
        setSavedId(result?.id)
      }
      if (publishNow) {
        navigate('/admin/journal')
      } else {
        setDraftSaved(true)
      }
    } catch (err) {
      setError(err.message || 'Failed to save entry.')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = e => { e.preventDefault(); saveEntry(false) }
  const handlePublishNow = () => saveEntry(true)

  if (loading) return (
    <p style={{ color: '#4a3520', fontStyle: 'italic', fontFamily: "'IM Fell English', serif" }}>Retrieving…</p>
  )

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <Link
            to="/admin/journal"
            style={{ color: '#4a3520', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: "'Playfair Display', serif", textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.target.style.color = '#8a6d2f')}
            onMouseLeave={e => (e.target.style.color = '#4a3520')}
          >
            ← Journal
          </Link>
          <span style={{ color: '#2a1e0a', fontSize: '0.58rem' }}>/</span>
          <span style={{ color: '#6b5a3e', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: "'Playfair Display', serif" }}>
            {isEdit ? (form.title || 'Edit') : 'New'}
          </span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8', fontSize: '2.2rem', fontStyle: 'italic' }}>
          {isEdit ? 'Edit Entry' : 'New Journal Entry'}
        </h1>
      </div>

      <OrnateDivider className="mb-8" />

      <form onSubmit={handleSubmit} style={{ maxWidth: '680px' }}>

        {/* Title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Title *</label>
          <input type="text" value={form.title} onChange={set('title')} placeholder="Entry title…" style={{ ...field, resize: undefined }} />
        </div>

        {/* Body */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Body *</label>
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
          <label style={labelStyle}>Excerpt</label>
          <textarea value={form.excerpt} onChange={set('excerpt')} placeholder="A short summary for the listing…" rows={3} style={field} />
        </div>

        {/* Category + Read time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Category</label>
            <input type="text" value={form.category} onChange={set('category')} placeholder="e.g. Reflections" style={{ ...field, resize: undefined }} />
          </div>
          <div>
            <label style={labelStyle}>Read Time</label>
            <input type="text" value={form.read_time} onChange={set('read_time')} placeholder="e.g. 4 min read" style={{ ...field, resize: undefined }} />
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
            {saving ? 'Saving…' : isEdit ? 'Save' : 'Save to Drafts'}
          </button>

          <button
            type="button"
            onClick={handlePublishNow}
            disabled={saving}
            style={{
              background: form.published && isEdit ? 'rgba(201,168,76,0.12)' : 'transparent',
              border: '1px solid rgba(201,168,76,0.5)',
              color: '#c9a84c',
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
            onMouseLeave={e => { e.currentTarget.style.background = form.published && isEdit ? 'rgba(201,168,76,0.12)' : 'transparent' }}
          >
            {form.published && isEdit ? '✦ Live — Save' : 'Save & Publish →'}
          </button>

          {draftSaved && (
            <>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                style={{
                  background: 'transparent', border: '1px solid rgba(138,109,47,0.3)',
                  color: '#6b5a3e', padding: '10px 20px',
                  fontFamily: "'Playfair Display', serif", fontSize: '0.62rem',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(138,109,47,0.6)'; e.currentTarget.style.color = '#8a6d2f' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(138,109,47,0.3)'; e.currentTarget.style.color = '#6b5a3e' }}
              >
                Preview
              </button>
              <span style={{ color: '#6b5a3e', fontSize: '0.62rem', letterSpacing: '0.15em', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                Saved.
              </span>
            </>
          )}

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

      {showPreview && savedId && (
        <PreviewModal
          entry={form}
          savedId={savedId}
          onClose={() => setShowPreview(false)}
          onPublished={() => navigate('/admin/journal')}
        />
      )}
    </div>
  )
}
