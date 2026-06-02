import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, getToken } from '../../data/api'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (getToken()) navigate('/admin', { replace: true })
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const handleSubmit = async () => {
    if (!password || loading) return
    setLoading(true)
    setError('')
    try {
      await login(password)
      navigate('/admin', { replace: true })
    } catch {
      setError('The ink does not match.')
      setShake(true)
      setTimeout(() => { setShake(false); setPassword('') }, 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d0a05',
    }}>
      <div
        className={shake ? 'admin-login-shake' : ''}
        style={{
          width: '100%',
          maxWidth: '360px',
          margin: '0 1.5rem',
          padding: '3rem 2.5rem',
          background: 'linear-gradient(145deg, #1a1209, #0d0a05)',
          border: '1px solid #8a6d2f',
          boxShadow: '0 0 80px rgba(201,168,76,0.08), inset 0 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <svg viewBox="0 0 40 56" style={{ width: '32px', height: '44px', margin: '0 auto 1.25rem', display: 'block' }} fill="none">
            <circle cx="20" cy="16" r="10" stroke="#c9a84c" strokeWidth="1.5" fill="none" />
            <circle cx="20" cy="16" r="4" fill="#c9a84c" fillOpacity="0.3" />
            <path d="M15 24 L12 48 L28 48 L25 24" stroke="#c9a84c" strokeWidth="1.5" fill="none" />
            <path d="M15 24 L12 48 L28 48 L25 24 Z" fill="#c9a84c" fillOpacity="0.08" />
          </svg>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: '#f0e6c8',
            fontSize: '1.6rem',
            fontStyle: 'italic',
            marginBottom: '0.3rem',
          }}>
            The Inner Study
          </h1>
          <p style={{ color: '#6b5a3e', fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            Admin Entrance
          </p>
        </div>

        {/* Field */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{
            display: 'block',
            color: '#8a6d2f',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: "'Playfair Display', serif",
            marginBottom: '0.6rem',
          }}>
            Passphrase
          </label>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="···"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(138,109,47,0.5)',
              outline: 'none',
              padding: '0.6rem 0',
              textAlign: 'center',
              fontSize: '1.1rem',
              color: '#f0e6c8',
              fontFamily: "'IM Fell English', serif",
              letterSpacing: '0.3em',
            }}
          />
        </div>

        {error && (
          <p style={{
            textAlign: 'center',
            color: '#c9a84c',
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
          disabled={loading || !password}
          className="btn-gold"
          style={{
            width: '100%',
            opacity: loading || !password ? 0.4 : 1,
            cursor: loading || !password ? 'not-allowed' : 'pointer',
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
