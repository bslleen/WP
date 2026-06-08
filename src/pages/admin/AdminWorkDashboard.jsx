import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchWork, fetchAllChapters, deleteChapter, updateChapter } from '../../data/api'

export default function AdminWorkDashboard() {
  const { workId } = useParams()
  const [work, setWork] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [w, ch] = await Promise.all([
        fetchWork(workId),
        fetchAllChapters(workId),
      ])
      setWork(w)
      setChapters(ch)
      setLoading(false)
    }
    load()
  }, [workId])

  const toggleChapterStatus = async (chapter) => {
    const newStatus = chapter.status === 'published' ? 'draft' : 'published'
    await updateChapter(workId, chapter.id, { status: newStatus })
    setChapters(prev => prev.map(c =>
      c.id === chapter.id ? { ...c, status: newStatus } : c
    ))
  }

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('Delete this chapter?')) return
    await deleteChapter(workId, chapterId)
    setChapters(prev => prev.filter(c => c.id !== chapterId))
  }

  if (loading) return (
    <div style={{ padding: '40px', color: 'var(--text-muted)', letterSpacing: '0.3em', fontSize: '11px' }}>
      LOADING...
    </div>
  )

  const isCompleted = work?.storyStatus === 'completed'

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      {/* Breadcrumb */}
      <p style={{ fontSize: '11px', letterSpacing: '0.25em', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <Link to="/admin/works" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          ← Works
        </Link>
        {' / '}{work?.title}
      </p>

      {/* Work header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '40px', paddingBottom: '24px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--accent)', textTransform: 'uppercase' }}>
              {work?.category}
            </span>
            <span style={{
              fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '2px 8px', border: '1px solid var(--border)',
              color: isCompleted ? '#4aa44a' : 'var(--accent)',
            }}>
              {isCompleted ? '✓ Completed' : '◉ Ongoing'}
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: '2rem',
            fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '8px',
          }}>
            {work?.title}
          </h1>
          {work?.tags && work.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {work.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '10px', padding: '2px 8px',
                  background: 'var(--accent-faint)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.15em',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to={`/admin/works/${workId}/edit`}>
            <button className="btn-gold" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
              Edit Work
            </button>
          </Link>
          <a href={`/works/${workId}`} target="_blank" rel="noreferrer">
            <button style={{
              background: 'none', border: '1px solid var(--border)',
              color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.25em',
              padding: '8px 16px', cursor: 'pointer', textTransform: 'uppercase',
            }}>
              View Public ↗
            </button>
          </a>
        </div>
      </div>

      {/* Chapters section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: '1.3rem',
          fontStyle: 'italic', color: 'var(--text-primary)',
        }}>
          Chapters ({chapters.length})
        </h2>
        <Link to={`/admin/works/${workId}/chapters/new`}>
          <button className="btn-gold" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
            + New Chapter
          </button>
        </Link>
      </div>

      {chapters.length === 0 ? (
        <div style={{
          padding: '48px', textAlign: 'center',
          border: '1px dashed var(--border)',
        }}>
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '16px' }}>
            No chapters yet. Begin writing.
          </p>
          <Link to={`/admin/works/${workId}/chapters/new`}>
            <button className="btn-gold" style={{ fontSize: '10px', letterSpacing: '0.25em' }}>
              Write First Chapter
            </button>
          </Link>
        </div>
      ) : (
        <div>
          {chapters.map((chapter, i) => (
            <div
              key={chapter.id}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 0', borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--accent)', minWidth: '24px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-heading)', fontStyle: 'italic',
                    color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '2px',
                  }}>
                    {chapter.title}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {chapter.wordCount > 0 ? `${chapter.wordCount.toLocaleString()} words · ` : ''}
                    {chapter.updatedAt?.toDate?.()?.toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    }) || 'Just now'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => toggleChapterStatus(chapter)}
                  style={{
                    fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                    padding: '4px 10px', cursor: 'pointer',
                    background: chapter.status === 'published' ? 'rgba(74,164,74,0.1)' : 'transparent',
                    border: `1px solid ${chapter.status === 'published' ? 'rgba(74,164,74,0.5)' : 'var(--border)'}`,
                    color: chapter.status === 'published' ? '#4aa44a' : 'var(--text-muted)',
                  }}
                >
                  {chapter.status === 'published' ? '✓ Live' : 'Draft'}
                </button>

                <Link to={`/admin/works/${workId}/chapters/${chapter.id}`}>
                  <button style={{
                    fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                    padding: '4px 10px', cursor: 'pointer',
                    background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                  }}>
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => handleDeleteChapter(chapter.id)}
                  style={{
                    fontSize: '9px', letterSpacing: '0.2em',
                    padding: '4px 10px', cursor: 'pointer',
                    background: 'transparent', border: '1px solid rgba(180,60,60,0.3)',
                    color: 'rgba(180,60,60,0.7)',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
