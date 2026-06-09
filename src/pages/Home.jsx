import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchWorks, fetchJournal } from '../data/api'
import { normalizeWork, normalizeJournal } from '../data/normalize'
import heroBg from '../assets/study.jpg'
import FadeIn from '../components/FadeIn'
import WorkCard, { StoneWall as WorkCardStoneWall } from '../components/WorkCard'

function useFonts() {
  useEffect(() => {
    const id = 'aw-fonts'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id  = id
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Cinzel:wght@400;500&display=swap'
    document.head.appendChild(link)
  }, [])
}

function Ornament() {
  const dot = { width: 5, height: 5, border: '0.5px solid var(--bg-tertiary)', transform: 'rotate(45deg)' }
  const sm  = { width: 3, height: 3, border: '0.5px solid var(--text-faint)', transform: 'rotate(45deg)' }
  const filled = { ...dot, background: 'var(--accent)', borderColor: 'var(--accent)' }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center', margin: '0 0 48px' }}>
      <div style={sm} /><div style={dot} /><div style={sm} />
      <div style={filled} />
      <div style={sm} /><div style={dot} /><div style={sm} />
    </div>
  )
}

const DAILY_QUOTES = [
  { content: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
  { content: "Fill your paper with the breathings of your heart.", author: "William Wordsworth" },
  { content: "The purpose of a writer is to keep civilization from destroying itself.", author: "Albert Camus" },
  { content: "You can always edit a bad page. You can't edit a blank page.", author: "Jodi Picoult" },
  { content: "A word after a word after a word is power.", author: "Margaret Atwood" },
  { content: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { content: "One must always be careful of books, and what is inside them, for words have the power to change us.", author: "Cassandra Clare" },
  { content: "The most courageous act is still to think for yourself. Aloud.", author: "Coco Chanel" },
  { content: "We are all of us stars, and we deserve to twinkle.", author: "Marilyn Monroe" },
  { content: "If you only read the books that everyone else is reading, you can only think what everyone else is thinking.", author: "Haruki Murakami" },
  { content: "I am not afraid of storms, for I am learning how to sail my ship.", author: "Louisa May Alcott" },
  { content: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { content: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { content: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
  { content: "Writing is the painting of the voice.", author: "Voltaire" },
  { content: "You don't write because you want to say something; you write because you have something to say.", author: "F. Scott Fitzgerald" },
  { content: "The road to hell is paved with adverbs.", author: "Stephen King" },
  { content: "Start writing, no matter what. The water does not flow until the faucet is turned on.", author: "Louis L'Amour" },
  { content: "Every secret of a writer's soul, every experience of his life, every quality of his mind, is written large in his works.", author: "Virginia Woolf" },
  { content: "A story has no beginning or end; arbitrarily one chooses that moment of experience from which to look back or from which to look ahead.", author: "Graham Greene" },
  { content: "Literature is the art of discovering something extraordinary about ordinary people, and saying with ordinary words something extraordinary.", author: "Boris Pasternak" },
  { content: "The greatest part of a writer's time is spent in reading, in order to write.", author: "Samuel Johnson" },
]

function DailyQuote() {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [words, setWords] = useState([])
  const [tone, setTone] = useState('neutral')

  const FALLBACKS = [
    { content: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
    { content: "A writer only begins a book. A reader finishes it.", author: "Samuel Johnson" },
    { content: "Fill your paper with the breathings of your heart.", author: "William Wordsworth" },
    { content: "The purpose of a writer is to keep civilization from destroying itself.", author: "Albert Camus" },
    { content: "You can always edit a bad page. You can't edit a blank page.", author: "Jodi Picoult" },
    { content: "One must always be careful of books, and what is inside them, for words have the power to change us.", author: "Cassandra Clare" },
    { content: "We are all fools in love.", author: "Jane Austen" },
    { content: "It is a truth universally acknowledged that a reader in possession of a good book must be in want of more.", author: "after Jane Austen" },
  ]

  function detectTone(text) {
    const t = text.toLowerCase()
    const dark = ['death', 'dark', 'shadow', 'grave', 'lost', 'alone', 'never', 'end', 'silence', 'void', 'night', 'grief', 'pain', 'cold', 'forgotten']
    const warm = ['love', 'heart', 'warm', 'light', 'hope', 'joy', 'beauty', 'life', 'together', 'dream', 'golden', 'spring', 'sun', 'gentle']
    const melancholic = ['time', 'memory', 'past', 'faded', 'old', 'gone', 'once', 'still', 'quiet', 'slow', 'linger', 'remain', 'always', 'waiting']

    const darkScore = dark.filter(w => t.includes(w)).length
    const warmScore = warm.filter(w => t.includes(w)).length
    const melScore  = melancholic.filter(w => t.includes(w)).length

    if (darkScore >= 2) return 'dark'
    if (warmScore >= 2) return 'warm'
    if (melScore  >= 2) return 'melancholic'
    return 'neutral'
  }

  const TONE_STYLES = {
    dark: {
      accent: 'rgba(138, 109, 47, 0.6)',
      bg: 'rgba(10, 7, 3, 0.85)',
      textColor: '#b8a878',
      label: "✦  Tonight's Ink  ✦",
      animDuration: '0.6s',
    },
    warm: {
      accent: 'rgba(201, 145, 60, 0.7)',
      bg: 'rgba(40, 24, 8, 0.7)',
      textColor: '#f0d9a8',
      label: "✦  Today's Ink  ✦",
      animDuration: '0.4s',
    },
    melancholic: {
      accent: 'rgba(120, 100, 60, 0.5)',
      bg: 'rgba(18, 13, 7, 0.8)',
      textColor: '#c8b888',
      label: '✦  From the Quiet  ✦',
      animDuration: '0.9s',
    },
    neutral: {
      accent: 'rgba(138, 109, 47, 0.4)',
      bg: 'rgba(26, 18, 9, 0.6)',
      textColor: '#d4c49a',
      label: "✦  Today's Ink  ✦",
      animDuration: '0.5s',
    },
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem('quote_history') || '[]') } catch { return [] }
  }
  function addToHistory(content) {
    const h = getHistory()
    localStorage.setItem('quote_history', JSON.stringify([content, ...h].slice(0, 5)))
  }
  function wasSeenRecently(content) {
    return getHistory().includes(content)
  }

  useEffect(() => {
    const cached = sessionStorage.getItem('daily_quote')
    if (cached) {
      const q = JSON.parse(cached)
      setQuote(q)
      setTone(detectTone(q.content))
      setWords(q.content.split(' '))
      setLoading(false)
      setTimeout(() => setVisible(true), 1200)
      return
    }

    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    const fallback = DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length]

    fetch('/api/quote')
      .then(r => r.json())
      .then(data => {
        let q
        if (data.content && data.author && !wasSeenRecently(data.content)) {
          q = { content: data.content, author: data.author }
        } else {
          const unseen = FALLBACKS.filter(f => !wasSeenRecently(f.content))
          q = unseen.length > 0
            ? unseen[Math.floor(Math.random() * unseen.length)]
            : fallback
        }
        addToHistory(q.content)
        sessionStorage.setItem('daily_quote', JSON.stringify(q))
        setQuote(q)
        setTone(detectTone(q.content))
        setWords(q.content.split(' '))
      })
      .catch(() => {
        setQuote(fallback)
        setTone(detectTone(fallback.content))
        setWords(fallback.content.split(' '))
      })
      .finally(() => {
        setLoading(false)
        setTimeout(() => setVisible(true), 1200)
      })
  }, [])

  const style = TONE_STYLES[tone]

  return (
    <>
      <style>{`
        @keyframes wordReveal {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes quoteEntrance {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes breathe {
          0%, 100% { line-height: 1.75; }
          50%       { line-height: 1.82; }
        }
        .quote-word {
          display: inline-block;
          opacity: 0;
          animation: wordReveal 0.35s ease forwards;
        }
        .quote-word:first-child::first-letter {
          font-size: 2.2em;
          line-height: 0.8;
          float: left;
          margin-right: 4px;
          margin-top: 4px;
          font-family: 'Playfair Display', serif;
          color: var(--accent, #c9a84c);
        }
      `}</style>

      <div style={{
        border: `1px solid ${style.accent}`,
        padding: '28px 32px',
        background: style.bg,
        backdropFilter: 'blur(4px)',
        position: 'relative',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'background 1.5s ease, border-color 1.5s ease',
        opacity: visible ? 1 : 0,
        animation: visible ? 'quoteEntrance 0.8s ease forwards' : 'none',
      }}>
        <p style={{
          fontSize: '9px',
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          color: style.accent,
          marginBottom: '18px',
          fontFamily: "'Crimson Text', serif",
        }}>
          {style.label}
        </p>

        {loading ? (
          <p style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'rgba(138,109,47,0.35)',
          }}>
            Consulting the archive...
          </p>
        ) : (
          <div>
            <p style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: '1.05rem',
              fontStyle: 'italic',
              color: style.textColor,
              lineHeight: '1.78',
              marginBottom: '16px',
              animation: 'breathe 6s ease-in-out infinite',
            }}>
              "
              {words.map((word, i) => (
                <span
                  key={i}
                  className="quote-word"
                  style={{ animationDelay: `${1.4 + i * 0.06}s`, marginRight: '0.25em' }}
                >
                  {word}
                </span>
              ))}
              "
            </p>

            <p style={{
              fontSize: '10px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: style.accent,
              textAlign: 'right',
              fontVariant: 'small-caps',
              opacity: 0,
              animation: 'quoteEntrance 0.6s ease forwards',
              animationDelay: `${1.4 + words.length * 0.06 + 0.3}s`,
            }}>
              — {quote?.author}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

function ClosingQuote() {
  const [quote, setQuote] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('closing_quote')
    if (cached) { setQuote(JSON.parse(cached)); return }

    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    const fallback = DAILY_QUOTES[(dayOfYear + 11) % DAILY_QUOTES.length]

    fetch('/api/quote')
      .then(r => r.json())
      .then(data => {
        const q = (data.content && data.author) ? data : fallback
        sessionStorage.setItem('closing_quote', JSON.stringify(q))
        setQuote(q)
      })
      .catch(() => setQuote(fallback))
  }, [])

  if (!quote) return null

  return (
    <>
      <blockquote style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontStyle: 'italic', fontWeight: 300,
        color: 'var(--accent)', lineHeight: 1.4,
        maxWidth: 600, margin: '0 auto 16px',
      }}>
        "{quote.content}"
      </blockquote>
      <p style={{
        fontFamily: "'Cinzel', serif", fontSize: 9,
        letterSpacing: '0.3em', textTransform: 'uppercase',
        color: 'var(--text-faint)', marginBottom: 28,
      }}>
        — {quote.author}
      </p>
    </>
  )
}

/* ── Home ──────────────────────────────────────────────────────────────────── */

export default function Home() {
  useFonts()

  const [works,   setWorks]   = useState([])
  const [journal, setJournal] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorks()
      .then(data => setWorks(data.slice(0, 3).map(normalizeWork)))
      .catch(() => {})
      .finally(() => setLoading(false))
    fetchJournal()
      .then(data => setJournal(data.slice(0, 2).map(normalizeJournal)))
      .catch(() => {})
  }, [])

  return (
    <div style={{
      fontFamily: "'EB Garamond', Georgia, serif",
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      width: '100%',
      overflowX: 'hidden',
    }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="hero-section relative grid grid-cols-1 lg:grid-cols-2 items-center pt-20 pb-12 lg:px-10 lg:pt-24 gap-8 lg:gap-16"
        style={{
          minHeight: '92vh',
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          paddingLeft: 'max(24px, env(safe-area-inset-left, 24px))',
          paddingRight: 'max(24px, env(safe-area-inset-right, 24px))',
          overflowX: 'clip',
        }}
      >
        {/* Dark overlay */}
        <div className="hero-bg-photo hero-bg-image" style={{
          position: 'absolute', inset: 0,
          background: 'rgba(14,11,7,0.82)',
          pointerEvents: 'none',
        }} />
        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(201,168,92,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Left */}
        <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: "'Cinzel', serif", fontSize: 10,
            letterSpacing: '0.35em', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
          }}>
            <span style={{ flex: 1, maxWidth: 40, height: '0.5px', background: 'var(--text-faint)', display: 'inline-block' }} />
            AUTHOR & POET
            <span style={{ flex: 1, maxWidth: 40, height: '0.5px', background: 'var(--text-faint)', display: 'inline-block' }} />
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.4rem, 8vw, 3.9rem)', fontWeight: 300, lineHeight: 1.1,
            color: 'var(--text-primary)', marginBottom: 6,
          }}>
            Words that<br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent)', fontSize: 'clamp(2.6rem, 9vw, 4.3rem)' }}>endure</em><br />
            the dark.
          </h1>

          <div style={{ width: 40, height: '0.5px', background: 'var(--accent)', margin: '28px 0' }} />

          <p style={{
            fontSize: 17, lineHeight: 1.8, color: 'var(--text-secondary)',
            maxWidth: 380, marginBottom: 36,
          }}>
            E. Ashworth wrote novels, poems, and stories that lived
            in the borderlands between the known and the vanished. The archive
            was discovered in 1923. The candle was still warm.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/works" style={{
              fontFamily: "'Cinzel', serif", fontSize: 11,
              letterSpacing: '0.2em', color: 'var(--accent)',
              border: '0.5px solid var(--accent)', padding: '14px 28px',
              textDecoration: 'none', background: 'transparent',
              minHeight: '44px', display: 'flex', alignItems: 'center',
            }}>
              VIEW THE WORKS
            </Link>
            <Link to="/about" style={{
              fontFamily: "'Cinzel', serif", fontSize: 11,
              letterSpacing: '0.2em', color: 'var(--text-muted)', textDecoration: 'none',
              minHeight: '44px', display: 'flex', alignItems: 'center',
            }}>
              About the Author →
            </Link>
          </div>
        </div>

        {/* Right — hidden on mobile */}
        <div className="hidden lg:flex flex-col gap-4" style={{ position: 'relative', zIndex: 1 }}>
          <DailyQuote />

          <div className="hero-tagline-box" style={{
            border: '0.5px solid var(--text-faint)', padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
            fontSize: 14, color: 'var(--text-faint)', fontStyle: 'italic',
          }}>
            <span style={{ color: 'var(--accent)', fontStyle: 'normal', fontSize: 18 }}>✦</span>
            Study. Read. Discover. — <em style={{ color: 'var(--text-faint)', marginLeft: 4 }}>The work itself.</em>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Cinzel', serif", fontSize: 9,
          letterSpacing: '0.3em', color: 'var(--text-faint)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          zIndex: 1,
        }}>
          <span>SCROLL</span>
          <div style={{ width: '0.5px', height: 40, background: 'var(--text-faint)' }} />
        </div>
      </section>

      {/* ── COLLECTION ────────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 40px',
      }}>
        <WorkCardStoneWall />

        {/* Warm top glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%)',
        }} />

        {/* Section header */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '60px' }}>
          <FadeIn delay={0}>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: '0.35em', color: 'var(--text-muted)', marginBottom: 8,
              textTransform: 'uppercase',
            }}>
              THE COLLECTION
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36, fontWeight: 400,
              color: 'var(--text-primary)', lineHeight: 1,
            }}>
              The Archive
            </h2>
            <p style={{
              fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
              fontSize: 15, color: 'var(--text-muted)', marginTop: 6,
            }}>
              Works from the current archive.
            </p>
          </FadeIn>
        </div>

        {/* Cards */}
        {loading ? (
          <p style={{
            position: 'relative', zIndex: 1, textAlign: 'center',
            fontFamily: "'Cinzel', serif", fontSize: 9,
            letterSpacing: '0.3em', color: 'var(--text-secondary)', padding: '48px 0',
          }}>
            Consulting the archive…
          </p>
        ) : (
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexWrap: 'wrap',
            gap: '32px', justifyContent: 'center',
            paddingTop: '28px',
          }}>
            {works.map((work, i) => (
              <FadeIn key={work.id} delay={0.12 * i}>
                <Link to={`/works/${work.id}`} style={{ textDecoration: 'none' }}>
                  <WorkCard work={work} />
                </Link>
              </FadeIn>
            ))}
          </div>
        )}

        {/* View all works */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: '48px' }}>
          <Link to="/works" style={{
            fontFamily: "'Cinzel', serif", fontSize: 11,
            letterSpacing: '0.2em', color: 'var(--accent)',
            border: '0.5px solid var(--accent)', padding: '14px 28px',
            textDecoration: 'none', background: 'transparent',
            display: 'inline-block', minHeight: '44px',
          }}>
            VIEW ALL WORKS →
          </Link>
        </div>
      </section>

      {/* ── JOURNAL ───────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-primary)', padding: '80px 40px 40px' }}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <FadeIn delay={0}>
          <div>
            <p style={{
              fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: '0.35em', color: 'var(--text-muted)', marginBottom: 8,
              textTransform: 'uppercase',
            }}>
              FROM THE JOURNAL
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic', fontWeight: 300, fontSize: 42,
              color: 'var(--text-primary)',
            }}>
              Recent Entries
            </h2>
          </div>
          </FadeIn>
        </div>

        <Ornament />

        <div className="grid grid-cols-1 md:grid-cols-2">
          {journal.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--text-faint)' }}>
              Consulting the archive…
            </div>
          )}
          {journal.map((entry, i) => (
            <FadeIn key={entry.id} delay={0.15 * i}>
            <div style={{
              padding: '24px 0',
              minHeight: 120,
              borderBottom: '1px solid rgba(138,109,47,0.15)',
              display: 'flex', flexDirection: 'column', gap: 12,
              gridColumn: journal.length === 1 ? '1 / -1' : 'auto',
            }}
            className="journal-preview-card">
              <p style={{
                fontFamily: "'Cinzel', serif", fontSize: 9,
                letterSpacing: '0.3em', color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}>
                {entry.category || 'Journal'}
              </p>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24, fontStyle: 'italic',
                color: 'var(--text-primary)', fontWeight: 400,
              }}>
                {entry.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, flex: 1 }}>
                {entry.excerpt || (entry.body ? entry.body.substring(0, 140) + '…' : '')}
              </p>
              <Link to="/journal" className="read-link" style={{
                fontFamily: "'Cinzel', serif", fontSize: 10,
                letterSpacing: '0.2em', color: 'var(--text-muted)',
                alignSelf: 'flex-start',
                borderBottom: '0.5px solid var(--border)', paddingBottom: 2,
                textDecoration: 'none', minHeight: '44px', display: 'flex', alignItems: 'center',
                marginTop: '8px',
              }}>
                Read entry →
              </Link>
            </div>
            </FadeIn>
          ))}
        </div>


      </section>

      {/* ── CLOSING QUOTE ─────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--bg-primary)',
        textAlign: 'center',
        borderTop: '0.5px solid var(--border)',
        borderBottom: '0.5px solid var(--border)',
        padding: '40px',
      }} className="closing-quote-section">
        <FadeIn delay={0}>
        <div style={{
          fontFamily: "'Cinzel', serif", fontSize: 9,
          letterSpacing: '0.35em', color: 'var(--text-faint)',
          marginBottom: 28,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 8, color: 'var(--accent)' }}>✦</span>
          A NOTE
          <span style={{ fontSize: 8, color: 'var(--accent)' }}>✦</span>
        </div>
        <blockquote style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontStyle: 'italic', fontWeight: 300,
          color: 'var(--accent)', lineHeight: 1.4,
          maxWidth: 600, margin: '0 auto 16px',
        }}>
          "Every good sentence is a small room with light coming in from the right."
        </blockquote>
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: 9,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'var(--text-faint)', marginBottom: 28,
        }}>
          — attributed to no one, found everywhere
        </p>
        <Ornament />
        </FadeIn>
      </section>

    </div>
  )
}
