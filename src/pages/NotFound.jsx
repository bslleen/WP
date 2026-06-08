import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0a05',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '0.58rem',
        letterSpacing: '0.55em',
        color: '#3a2e1a',
        marginBottom: '2rem',
        textTransform: 'uppercase',
      }}>
        ✦ &nbsp; 404 &nbsp; ✦
      </p>

      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        color: '#e8dcc0',
        fontSize: 'clamp(2rem, 7vw, 3.8rem)',
        fontStyle: 'italic',
        fontWeight: 300,
        lineHeight: 1.15,
        marginBottom: '1.5rem',
        letterSpacing: '0.01em',
      }}>
        This page was<br />never written.
      </h1>

      <div style={{ width: '40px', height: '0.5px', background: '#3a2e1a', margin: '0 auto 1.5rem' }} />

      <p style={{
        fontFamily: "'IM Fell English', serif",
        color: '#5a4a2a',
        fontSize: '1rem',
        fontStyle: 'italic',
        lineHeight: 1.85,
        maxWidth: '380px',
        marginBottom: '3rem',
      }}>
        Some pages are lost to time. Some were never meant to be found.
        Others are simply waiting to be written.
      </p>

      <Link
        to="/"
        style={{
          fontFamily: "'Playfair Display', serif",
          color: '#c9a84c',
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          border: '1px solid rgba(201,168,76,0.4)',
          padding: '13px 36px',
          display: 'inline-block',
          transition: 'all 0.3s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#c9a84c'; e.currentTarget.style.color = '#0d0a05' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c9a84c' }}
      >
        Return to the Archive
      </Link>
    </div>
  )
}
