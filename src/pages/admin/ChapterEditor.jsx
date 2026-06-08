import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchWork, fetchChapter, createChapter, updateChapter, fetchAllChapters } from '../../data/api'

export default function ChapterEditor() {
  const { workId, chapterId } = useParams()
  const navigate = useNavigate()
  const isNew = !chapterId || chapterId === 'new'

  const [work, setWork] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('draft')
  const [order, setOrder] = useState(1)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [wordCount, setWordCount] = useState(0)
  const autoSaveRef = useRef(null)
  const savedIdRef = useRef(chapterId || null)

  useEffect(() => {
    async function load() {
      const w = await fetchWork(workId)
      setWork(w)

      if (!isNew) {
        const ch = await fetchChapter(workId, chapterId)
        if (ch) {
          setTitle(ch.title || '')
          setContent(ch.content || '')
          setStatus(ch.status || 'draft')
          setOrder(ch.order || 1)
        }
      } else {
        const allCh = await fetchAllChapters(workId)
        setOrder(allCh.length + 1)
      }
    }
    load()
  }, [workId, chapterId, isNew])

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length
    setWordCount(content.trim() ? words : 0)
  }, [content])

  const save = useCallback(async (publishStatus = null) => {
    if (!title.trim()) return
    setSaving(true)

    const data = {
      title,
      content,
      order,
      wordCount,
      status: publishStatus || status,
    }

    try {
      if (isNew && !savedIdRef.current) {
        const ref = await createChapter(workId, data)
        savedIdRef.current = ref.id
        navigate(`/admin/works/${workId}/chapters/${ref.id}`, { replace: true })
      } else {
        const id = savedIdRef.current || chapterId
        await updateChapter(workId, id, data)
      }
      if (publishStatus) setStatus(publishStatus)
      setLastSaved(new Date())
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }, [title, content, order, wordCount, status, workId, chapterId, isNew, navigate])

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (title.trim() && content.trim()) save()
    }, 30000)
    return () => clearInterval(autoSaveRef.current)
  }, [save])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Editor top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backdropFilter: 'blur(8px)',
      }}>
        <Link to={`/admin/works/${workId}`} style={{
          fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--text-muted)', textDecoration: 'none',
        }}>
          ← {work?.title}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            {wordCount.toLocaleString()} words
          </span>

          {lastSaved && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {saving ? 'Saving...' : `Saved ${lastSaved.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`}
            </span>
          )}

          <span style={{
            fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '3px 10px',
            background: status === 'published' ? 'rgba(74,164,74,0.1)' : 'var(--accent-faint)',
            border: `1px solid ${status === 'published' ? 'rgba(74,164,74,0.4)' : 'var(--border)'}`,
            color: status === 'published' ? '#4aa44a' : 'var(--accent)',
          }}>
            {status === 'published' ? '✓ Live' : 'Draft'}
          </span>

          <button
            onClick={() => save('draft')}
            disabled={saving || !title.trim()}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '6px 14px', cursor: 'pointer',
              opacity: !title.trim() ? 0.4 : 1,
            }}
          >
            Save Draft
          </button>

          <button
            onClick={() => save('published')}
            disabled={saving || !title.trim()}
            className="btn-gold"
            style={{ fontSize: '10px', letterSpacing: '0.2em', padding: '6px 14px' }}
          >
            {status === 'published' ? '✓ Update' : 'Publish →'}
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '100px 24px 80px',
        width: '100%',
      }}>
        <p style={{
          fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase',
          color: 'var(--accent)', textAlign: 'center', marginBottom: '24px',
        }}>
          Chapter {order}
        </p>

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Chapter Title"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontStyle: 'italic',
            fontWeight: '400',
            padding: '8px 0 16px',
            marginBottom: '40px',
            outline: 'none',
            textAlign: 'center',
          }}
        />

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '12px', marginBottom: '40px',
        }}>
          <div style={{ height: '1px', width: '60px', background: 'var(--border)' }}/>
          <span style={{ color: 'var(--accent)', fontSize: '10px' }}>✦</span>
          <div style={{ height: '1px', width: '60px', background: 'var(--border)' }}/>
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Begin writing..."
          style={{
            width: '100%',
            minHeight: '60vh',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontFamily: "'Crimson Text', Georgia, serif",
            fontSize: '19px',
            lineHeight: '1.9',
            resize: 'none',
            outline: 'none',
            letterSpacing: '0.01em',
          }}
        />
      </div>
    </div>
  )
}
