import { NavLink, Link, useNavigate } from 'react-router-dom'
import { logout } from '../../data/api'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '◈', end: true },
  { to: '/admin/works', label: 'Works', icon: '✦' },
  { to: '/admin/journal', label: 'Journal', icon: '✒' },
  { to: '/admin/about', label: 'About', icon: '☽' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙' },
]

const TAB_NAV = [
  { to: '/admin', label: 'Dash', icon: '◈', end: true },
  { to: '/admin/works', label: 'Works', icon: '✦' },
  { to: '/admin/journal', label: 'Journal', icon: '✒' },
  { to: '/admin/about', label: 'About', icon: '☽' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙' },
]

export default function AdminLayout({ children }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar — desktop only */}
      <aside className="admin-sidebar hidden md:flex flex-col" style={{
        width: '220px',
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        boxShadow: '2px 0 20px rgba(0,0,0,0.5)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      }}>
        {/* Logotype */}
        <Link to="/" style={{ display: 'block', padding: '1.75rem 1.5rem', borderBottom: '1px solid var(--border)', textDecoration: 'none', transition: 'opacity 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          title="Go to homepage"
        >
          <svg viewBox="0 0 32 32" style={{ width: '22px', height: '22px', marginBottom: '0.6rem', display: 'block' }} fill="none">
            <path d="M28 2 Q22 4 18 10 Q14 16 10 28 Q14 24 16 20 Q18 16 20 14 Q24 8 28 2 Z" fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="0.7" />
            <path d="M10 28 Q10 22 14 18" stroke="var(--accent-dim)" strokeWidth="0.8" fill="none" />
            <path d="M10 28 L8 30 L12 29 Z" fill="var(--accent-dim)" opacity="0.6" />
            <line x1="9" y1="24" x2="6" y2="27" stroke="var(--accent-dim)" strokeWidth="0.6" opacity="0.5" />
          </svg>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--accent)',
            fontSize: '1.05rem',
            fontStyle: 'italic',
            marginBottom: '0.2rem',
            letterSpacing: '0.02em',
          }}>
            The Ledger
          </p>
          <p style={{ color: 'var(--text-faint)', fontSize: '0.52rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: "'Crimson Text', serif" }}>
            Admin Panel
          </p>
        </Link>

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
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
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
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'var(--text-faint)',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontFamily: "'Crimson Text', serif",
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.target.style.color = 'var(--accent-dim)')}
            onMouseLeave={e => (e.target.style.color = 'var(--text-faint)')}
          >
            View Site ↗
          </a>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-faint)',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: 0,
              textAlign: 'left',
              fontFamily: "'Crimson Text', serif",
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.target.style.color = 'var(--accent-dim)')}
            onMouseLeave={e => (e.target.style.color = 'var(--text-faint)')}
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
      }} className="admin-content p-6 md:p-14 pb-24 md:pb-14">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {TAB_NAV.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
            style={({ isActive }) => ({
              color: isActive ? 'var(--accent)' : 'var(--text-faint)',
              textDecoration: 'none',
              fontSize: '0.42rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: "'Crimson Text', serif",
              borderTop: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'color 0.2s, border-color 0.2s',
              minHeight: '56px',
            })}
          >
            <span style={{ fontSize: '0.85rem' }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
