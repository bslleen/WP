import { NavLink, useNavigate } from 'react-router-dom'
import { apiLogout } from '../../data/api'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '◈', end: true },
  { to: '/admin/works', label: 'Works', icon: '✦' },
  { to: '/admin/journal', label: 'Journal', icon: '✒' },
  { to: '/admin/about', label: 'About', icon: '☽' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙' },
]

export default function AdminLayout({ children }) {
  const navigate = useNavigate()

  const logout = () => {
    apiLogout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0a05' }}>
      {/* Sidebar — warm leather */}
      <aside style={{
        width: '220px',
        flexShrink: 0,
        borderRight: '1px solid rgba(201,168,76,0.15)',
        boxShadow: '2px 0 20px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #120d06 0%, #0d0a05 100%)',
      }}>
        {/* Logotype */}
        <div style={{
          padding: '1.75rem 1.5rem',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        }}>
          {/* Quill icon above title */}
          <svg viewBox="0 0 32 32" style={{ width: '22px', height: '22px', marginBottom: '0.6rem', display: 'block' }} fill="none">
            <path d="M28 2 Q22 4 18 10 Q14 16 10 28 Q14 24 16 20 Q18 16 20 14 Q24 8 28 2 Z" fill="#c9a84c" fillOpacity="0.18" stroke="#c9a84c" strokeWidth="0.7" />
            <path d="M10 28 Q10 22 14 18" stroke="#8a6d2f" strokeWidth="0.8" fill="none" />
            <path d="M10 28 L8 30 L12 29 Z" fill="#8a6d2f" opacity="0.6" />
            <line x1="9" y1="24" x2="6" y2="27" stroke="#8a6d2f" strokeWidth="0.6" opacity="0.5" />
          </svg>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            color: '#e8c86a',
            fontSize: '1.05rem',
            fontStyle: 'italic',
            marginBottom: '0.2rem',
            letterSpacing: '0.02em',
          }}>
            The Ledger
          </p>
          <p style={{ color: '#3d2b14', fontSize: '0.52rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: "'Crimson Text', serif" }}>
            Admin Panel
          </p>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '1.25rem 0' }}>
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                padding: '0.65rem 1.5rem',
                color: isActive ? '#e8c86a' : '#6b5a3e',
                borderLeft: isActive ? '2px solid #c9a84c' : '2px solid transparent',
                textDecoration: 'none',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: "'Crimson Text', serif",
                background: isActive ? 'rgba(201,168,76,0.06)' : 'transparent',
                transition: 'color 0.2s, background 0.2s',
              })}
            >
              <span style={{ fontSize: '0.65rem', opacity: 0.7, width: '14px', textAlign: 'center' }}>
                {icon}
              </span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid rgba(138,109,47,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#3d2b14',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontFamily: "'Crimson Text', serif",
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.target.style.color = '#8a6d2f')}
            onMouseLeave={e => (e.target.style.color = '#3d2b14')}
          >
            View Site ↗
          </a>
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: '#3d2b14',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: 0,
              textAlign: 'left',
              fontFamily: "'Crimson Text', serif",
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.target.style.color = '#8a6d2f')}
            onMouseLeave={e => (e.target.style.color = '#3d2b14')}
          >
            Logout →
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        minHeight: '100vh',
        padding: '3rem 3.5rem',
      }}>
        {children}
      </main>
    </div>
  )
}
