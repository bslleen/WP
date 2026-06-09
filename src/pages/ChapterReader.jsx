import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchWork, fetchChapter, fetchPublishedChapters } from '../data/api'

const FONTS = [
  { name: 'Crimson', value: "'Crimson Text', Georgia, serif" },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Lato', value: "'Lato', sans-serif" },
]

const SIZES = [
  { name: 'S', value: '16px' },
  { name: 'M', value: '19px' },
  { name: 'L', value: '22px' },
]

const BG_THEMES = [
  { name: 'Dark',      bg: '#130e07', text: '#e8d5a3' },
  { name: 'Parchment', bg: '#f0e6c8', text: '#3d2b1f' },
  { name: 'White',     bg: '#ffffff', text: '#1a1a1a' },
]

export default function ChapterReader() {
  const { workId, chapterId } = useParams()
  const [work, setWork] = useState(null)
  const [chapter, setChapter] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [font, setFont] = useState(FONTS[0].value)
  const [size, setSize] = useState(SIZES[1].value)
  const [bgTheme, setBgTheme] = useState(BG_THEMES[0])
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [w, ch, allCh] = await Promise.all([
          fetchWork(workId),
          fetchChapter(workId, chapterId),
          fetchPublishedChapters(workId).catch(() => []),
        ])
        setWork(w)
        setChapter(ch)
        setChapters(allCh)
        window.scrollTo(0, 0)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [workId, chapterId])

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <p style={{ color: 'var(--text-muted)', letterSpacing: '0.3em', fontSize: '11px' }}>
        OPENING THE CHAPTER...
      </p>
    </div>
  )

  if (!chapter) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', flexDirection: 'column', gap: '16px',
    }}>
      <p style={{ color: 'var(--text-muted)', letterSpacing: '0.3em', fontSize: '11px' }}>
        CHAPTER NOT FOUND
      </p>
      <Link to={`/works/${workId}`} style={{ color: 'var(--accent)', fontSize: '12px', letterSpacing: '0.2em', textDecoration: 'none' }}>
        ← Return to contents
      </Link>
    </div>
  )

  const currentIndex = chapters.findIndex(c => c.id === chapterId)
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  return (
    <div style={{ minHeight: '100vh', background: bgTheme.bg }}>

      {/* Reader top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backdropFilter: 'blur(8px)',
      }}>
        <Link to={`/works/${workId}`} style={{
          fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'var(--text-muted)', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← {work?.title}
        </Link>

        <p style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '14px',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        }}>
          {chapter?.title}
        </p>

        <button
          onClick={() => setShowControls(!showControls)}
          style={{
            background: 'none', border: '1px solid var(--border)',
            color: 'var(--text-muted)', fontSize: '11px',
            letterSpacing: '0.2em', padding: '4px 12px', cursor: 'pointer',
          }}
        >
          Aa
        </button>
      </div>

      {/* Font/size control panel */}
      {showControls && (
        <div style={{
          position: 'fixed', top: '52px', right: '24px', zIndex: 49,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)',
          padding: '20px',
          minWidth: '200px',
        }}>
          <p style={{
            fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: '12px',
          }}>
            Typeface
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {FONTS.map(f => (
              <button
                key={f.name}
                onClick={() => setFont(f.value)}
                style={{
                  background: font === f.value ? 'var(--accent-faint)' : 'transparent',
                  border: `1px solid ${font === f.value ? 'var(--accent)' : 'var(--border)'}`,
                  color: font === f.value ? 'var(--accent)' : 'var(--text-secondary)',
                  padding: '8px 12px',
                  fontFamily: f.value,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                {f.name}
              </button>
            ))}
          </div>

          <p style={{
            fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: '12px',
          }}>
            Size
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {SIZES.map(s => (
              <button
                key={s.name}
                onClick={() => setSize(s.value)}
                style={{
                  flex: 1,
                  background: size === s.value ? 'var(--accent)' : 'transparent',
                  border: `1px solid ${size === s.value ? 'var(--accent)' : 'var(--border)'}`,
                  color: size === s.value ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  padding: '8px',
                  fontSize: s.value,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {s.name}
              </button>
            ))}
          </div>

          <p style={{
            fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: '12px', marginTop: '20px',
          }}>
            Background
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {BG_THEMES.map(t => (
              <button
                key={t.name}
                onClick={() => setBgTheme(t)}
                title={t.name}
                style={{
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  background: t.bg,
                  border: bgTheme.name === t.name
                    ? '2px solid var(--accent)'
                    : '2px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Chapter content */}
      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '100px 24px 80px',
      }}>
        {/* Chapter number + title */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{
            fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase',
            color: 'var(--accent)', marginBottom: '16px',
          }}>
            Chapter {currentIndex + 1}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontStyle: 'italic',
            color: 'var(--text-primary)',
            fontWeight: '400',
            lineHeight: 1.2,
            marginBottom: '32px',
          }}>
            {chapter?.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ height: '1px', width: '60px', background: 'var(--border)' }}/>
            <span style={{ color: 'var(--accent)', fontSize: '10px' }}>✦</span>
            <div style={{ height: '1px', width: '60px', background: 'var(--border)' }}/>
          </div>
        </div>

        {/* Body text */}
        <div style={{
          fontFamily: font,
          fontSize: size,
          color: bgTheme.text,
          lineHeight: '1.9',
          letterSpacing: '0.01em',
        }}>
          {chapter?.content?.split('\n\n').map((paragraph, i) => (
            paragraph.trim() && (
              <p key={i} style={{
                marginBottom: '1.5em',
                textIndent: i > 0 ? '1.5em' : '0',
              }}>
                {paragraph}
              </p>
            )
          ))}
        </div>

        {/* End of chapter */}
        <div style={{
          textAlign: 'center',
          margin: '60px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
        }}>
          <div style={{ height: '1px', width: '60px', background: 'var(--border)' }}/>
          <span style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.3em' }}>
            END OF CHAPTER
          </span>
          <div style={{ height: '1px', width: '60px', background: 'var(--border)' }}/>
        </div>

        {/* Chapter navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '32px',
          borderTop: '1px solid var(--border)',
        }}>
          {prevChapter ? (
            <Link
              to={`/works/${workId}/chapter/${prevChapter.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{ cursor: 'pointer' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  ← PREVIOUS
                </p>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontStyle: 'italic',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                }}>
                  {prevChapter.title}
                </p>
              </div>
            </Link>
          ) : <div />}

          <Link to={`/works/${workId}`} style={{
            fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--text-muted)', textDecoration: 'none',
          }}>
            Contents
          </Link>

          {nextChapter ? (
            <Link
              to={`/works/${workId}/chapter/${nextChapter.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{ textAlign: 'right', cursor: 'pointer' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  NEXT →
                </p>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontStyle: 'italic',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                }}>
                  {nextChapter.title}
                </p>
              </div>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  )
}
