import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../data/api'
import { auth } from '../../firebase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const emailRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.currentUser) navigate('/admin', { replace: true })
    setTimeout(() => emailRef.current?.focus(), 100)
  }, [])

  const handleSubmit = async () => {
    if (!email || !password || loading) return
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      const code = err?.code || ''
      let msg = 'The ink does not match.'
      if (code === 'auth/operation-not-allowed') msg = 'Email/password sign-in is not enabled in Firebase.'
      else if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') msg = 'No account found, or wrong credentials.'
      else if (code === 'auth/wrong-password') msg = 'Wrong passphrase.'
      else if (code === 'auth/invalid-email') msg = 'That correspondence address is invalid.'
      else if (code === 'auth/too-many-requests') msg = 'Too many attempts — try again later.'
      else if (code === 'auth/network-request-failed') msg = 'Network error — check your connection.'
      setError(msg)
      setShake(true)
      setTimeout(() => { setShake(false); setPassword('') }, 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}
      onClick={(e) => e.target === e.currentTarget && navigate(-1)}
    >
      <div
        className={shake ? 'admin-login-shake' : ''}
        style={{
          width: '100%',
          maxWidth: '360px',
          margin: '0 1.5rem',
          padding: '3rem 2.5rem',
          background: 'linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))',
          border: '1px solid var(--accent-dim)',
          boxShadow: '0 0 80px rgba(201,168,76,0.08), inset 0 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <svg viewBox="0 0 40 56" style={{ width: '32px', height: '44px', margin: '0 auto 1.25rem', display: 'block' }} fill="none">
            <circle cx="20" cy="16" r="10" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
            <circle cx="20" cy="16" r="4" fill="var(--accent)" fillOpacity="0.3" />
            <path d="M15 24 L12 48 L28 48 L25 24" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
            <path d="M15 24 L12 48 L28 48 L25 24 Z" fill="var(--accent)" fillOpacity="0.08" />
          </svg>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--text-primary)',
            fontSize: '1.6rem',
            fontStyle: 'italic',
            marginBottom: '0.3rem',
          }}>
            The Inner Study
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            Admin Entrance
          </p>
        </div>

        {/* Correspondence (email) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{
            display: 'block',
            color: 'var(--accent-dim)',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: "'Playfair Display', serif",
            marginBottom: '0.6rem',
          }}>
            Correspondence
          </label>
          <input
            ref={emailRef}
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="···"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border-strong)',
              outline: 'none',
              padding: '0.6rem 0',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              fontFamily: "'IM Fell English', serif",
            }}
          />
        </div>

        {/* Passphrase (password) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{
            display: 'block',
            color: 'var(--accent-dim)',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: "'Playfair Display', serif",
            marginBottom: '0.6rem',
          }}>
            Passphrase
          </label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="···"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border-strong)',
              outline: 'none',
              padding: '0.6rem 0',
              textAlign: 'center',
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              fontFamily: "'IM Fell English', serif",
              letterSpacing: '0.3em',
            }}
          />
        </div>

        {error && (
          <p style={{
            textAlign: 'center',
            color: 'var(--accent)',
            opacity: 0.75,
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
          }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className="btn-gold"
          style={{
            width: '100%',
            opacity: loading || !email || !password ? 0.4 : 1,
            cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Opening…' : 'Enter'}
        </button>
      </div>

      <style>{`
        @keyframes adminLoginShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .admin-login-shake { animation: adminLoginShake 0.4s ease; }
      `}</style>
    </div>
  )
}
