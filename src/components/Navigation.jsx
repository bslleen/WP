import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CandleIcon, BookIcon } from './OrnateElements'
import { useTheme } from '../themes/ThemeContext'

export default function Navigation({ onCandleClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { mode, toggle } = useTheme()

  // Draggable candle state
  const [candlePos, setCandlePos] = useState(null) // null = pinned in nav
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const dragMoved = useRef(false)
  const candleRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const onPointerDown = (e) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    dragMoved.current = false
    if (!candlePos) setCandlePos({ x: rect.left, y: rect.top })
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragging) return
    dragMoved.current = true
    setCandlePos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    })
  }

  const onPointerUp = () => {
    setDragging(false)
    if (!dragMoved.current) onCandleClick()
  }

  const candleHandlers = { onPointerDown, onPointerMove, onPointerUp }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/works', label: 'Works' },
    { to: '/about', label: 'About' },
    { to: '/journal', label: 'Journal' },
  ]

  return (
    <>
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'var(--nav-bg)'
          : 'linear-gradient(to bottom, rgba(13,10,5,0.9), transparent)',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="nav-logo flex flex-col items-start group">
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--accent-dim)' }}>
            ✦ &nbsp; Est. MMXXIV
          </span>
          <span
            className="text-xl italic group-hover:text-gold transition-colors"
            style={{ fontFamily: "var(--font-heading)", color: 'var(--text-primary)' }}
          >
            E. Ashworth
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="relative text-sm tracking-[0.2em] uppercase transition-colors duration-300 group"
              style={{
                color: location.pathname === to ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: "var(--font-body)",
              }}
            >
              {label}
              <span
                className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                style={{
                  background: 'var(--accent)',
                  width: location.pathname === to ? '100%' : '0%',
                }}
              />
              <span
                className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: 'var(--accent)' }}
              />
            </Link>
          ))}
        </div>

        {/* Right side: theme toggle + book icon + candle + hamburger */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggle}
            style={{
              display: 'none',
              background: 'none',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              padding: '4px 10px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => (e.target.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.target.style.color = 'var(--text-muted)')}
          >
            {mode === 'castle' ? '☽ Castle' : '○ Parchment'}
          </button>

          <Link
            to="/admin/login"
            title="The Inner Study"
            style={{ display: 'flex', alignItems: 'center', opacity: 0.35, transition: 'opacity 0.3s ease, filter 0.3s ease' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(201,168,76,0.6))' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = 0.35; e.currentTarget.style.filter = 'none' }}
          >
            <BookIcon className="w-6 h-7" />
          </Link>
          {/* Candle — always visible */}
          {candlePos
            ? <div style={{ width: '20px', height: '40px' }} />
            : (
              <div
                {...candleHandlers}
                ref={candleRef}
                style={{ cursor: 'grab', touchAction: 'none', userSelect: 'none' }}
              >
                <CandleIcon onClick={null} />
              </div>
            )
          }
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-11 h-11"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <span
              className="block transition-all duration-300"
              style={{
                width: '22px', height: '2px',
                background: 'var(--accent)',
                transformOrigin: 'center',
                transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block transition-all duration-300"
              style={{
                width: '22px', height: '2px',
                background: 'var(--accent)',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block transition-all duration-300"
              style={{
                width: '22px', height: '2px',
                background: 'var(--accent)',
                transformOrigin: 'center',
                transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile full-screen overlay menu */}
    {menuOpen && (
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
        style={{ background: 'var(--bg-primary)' }}
      >
        <nav className="flex flex-col items-center gap-10">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="text-4xl italic transition-colors duration-300"
              style={{
                fontFamily: "var(--font-heading)",
                color: location.pathname === to ? 'var(--accent)' : 'var(--text-primary)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: '3rem', width: '40px', height: '0.5px', background: 'var(--bg-tertiary)' }} />
        <p
          className="mt-6 text-xs tracking-[0.35em] uppercase"
          style={{ color: 'var(--text-faint)', fontFamily: "'Cinzel', serif" }}
        >
          Est. MMXXIV
        </p>
      </div>
    )}

    {/* Floating candle — rendered outside nav when dragged free */}
    {candlePos && (
      <div
        {...candleHandlers}
        style={{
          position: 'fixed',
          left: candlePos.x,
          top: candlePos.y,
          zIndex: 200,
          cursor: dragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
          filter: dragging
            ? 'drop-shadow(0 0 12px rgba(245,158,11,0.7))'
            : 'drop-shadow(0 0 6px rgba(245,158,11,0.4))',
          transform: dragging ? 'rotate(-8deg) scale(1.15)' : 'rotate(0deg) scale(1)',
          transition: dragging ? 'none' : 'transform 0.3s ease, filter 0.3s ease',
        }}
      >
        <CandleIcon onClick={null} />
      </div>
    )}
    </>
  )
}
