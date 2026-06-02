import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CandleIcon, BookIcon } from './OrnateElements'

export default function Navigation({ onCandleClick }) {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

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

  const onPointerDown = (e) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    dragMoved.current = false
    // Initialise floating position the first time
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
          ? 'rgba(13, 10, 5, 0.97)'
          : 'linear-gradient(to bottom, rgba(13,10,5,0.9), transparent)',
        borderBottom: scrolled ? '1px solid rgba(138, 109, 47, 0.3)' : 'none',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start group">
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#8a6d2f' }}>
            ✦ &nbsp; Est. MMXXIV
          </span>
          <span
            className="text-xl italic group-hover:text-gold transition-colors"
            style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8' }}
          >
            E. Ashworth
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="relative text-sm tracking-[0.2em] uppercase transition-colors duration-300 group"
              style={{
                color: location.pathname === to ? '#c9a84c' : '#a89060',
                fontFamily: "'Crimson Text', serif",
              }}
            >
              {label}
              <span
                className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                style={{
                  background: '#c9a84c',
                  width: location.pathname === to ? '100%' : '0%',
                }}
              />
              <span
                className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: '#c9a84c' }}
              />
            </Link>
          ))}
        </div>

        {/* Candle — placeholder keeps the nav space when candle is floating */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/login"
            title="The Inner Study"
            style={{ display: 'flex', alignItems: 'center', opacity: 0.35, transition: 'opacity 0.3s ease, filter 0.3s ease' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(201,168,76,0.6))' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = 0.35; e.currentTarget.style.filter = 'none' }}
          >
            <BookIcon className="w-6 h-7" />
          </Link>
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
        </div>
      </div>
    </nav>

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
