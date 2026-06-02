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
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        flexShrink: 0,
        borderRight: '1px solid rgba(138,109,47,0.2)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #1a1209 0%, #0d0a05 100%)',
      }}>
        {/* Logotype */}
        <div style={{
          padding: '1.75rem 1.5rem',
          borderBottom: '1px solid rgba(138,109,47,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <svg viewBox="0 0 20 24" style={{ width: '13px', height: '16px', flexShrink: 0 }} fill="none">
              <path d="M10 2 Q14 6 14 12 Q14 18 10 22 Q6 18 6 12 Q6 6 10 2Z" stroke="#c9a84c" strokeWidth="0.8" fill="none" />
              <path d="M4 8 Q8 10 10 12 Q8 14 4 16" stroke="#8a6d2f" strokeWidth="0.5" fill="none" />
              <path d="M16 8 Q12 10 10 12 Q12 14 16 16" stroke="#8a6d2f" strokeWidth="0.5" fill="none" />
              <circle cx="10" cy="12" r="1.5" fill="#c9a84c" opacity="0.5" />
            </svg>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              color: '#f0e6c8',
              fontSize: '1rem',
              fontStyle: 'italic',
            }}>
              The Ledger
            </p>
          </div>
          <p style={{ color: '#3d2b14', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', paddingLeft: '19px' }}>
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
                padding: '0.7rem 1.5rem',
                color: isActive ? '#c9a84c' : '#6b5a3e',
                borderLeft: isActive ? '2px solid #c9a84c' : '2px solid transparent',
                textDecoration: 'none',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: "'Playfair Display', serif",
                background: isActive ? 'rgba(201,168,76,0.05)' : 'transparent',
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
