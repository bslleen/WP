import { useState } from 'react'
import { changePassword, changeEmail } from '../../data/api'
import { OrnateDivider } from '../../components/OrnateElements'

const field = {
  width: '100%',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  outline: 'none',
  padding: '0.7rem 1rem',
  color: 'var(--text-primary)',
  fontFamily: "'IM Fell English', serif",
  fontSize: '0.95rem',
}

const label = {
  display: 'block',
  color: 'var(--accent-dim)',
  fontSize: '0.6rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  fontFamily: "'Playfair Display', serif",
  marginBottom: '0.5rem',
}

function Card({ title, children }) {
  return (
    <div style={{
      padding: '2rem',
      border: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      marginBottom: '1.5rem',
    }}>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        color: 'var(--accent)',
        fontSize: '1.1rem',
        fontStyle: 'italic',
        marginBottom: '1.5rem',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

export default function AdminSettings() {
  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew]         = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const [pwSaving, setPwSaving]   = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwError, setPwError]     = useState('')

  const [emCurrent, setEmCurrent] = useState('')
  const [emNew, setEmNew]         = useState('')
  const [emSaving, setEmSaving]   = useState(false)
  const [emSuccess, setEmSuccess] = useState(false)
  const [emError, setEmError]     = useState('')

  const handlePasswordSubmit = async e => {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)
    if (!pwCurrent) { setPwError('Enter your current passphrase.'); return }
    if (!pwNew) { setPwError('Enter a new passphrase.'); return }
    if (pwNew.length < 6) { setPwError('Passphrase must be at least 6 characters.'); return }
    if (pwNew !== pwConfirm) { setPwError('Passphrases do not match.'); return }
    setPwSaving(true)
    try {
      await changePassword(pwCurrent, pwNew)
      setPwSuccess(true)
      setPwCurrent('')
      setPwNew('')
      setPwConfirm('')
    } catch (err) {
      const msg = err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
        ? 'Current passphrase is incorrect.'
        : err.message || 'Failed to update passphrase.'
      setPwError(msg)
    } finally {
      setPwSaving(false)
    }
  }

  const handleEmailSubmit = async e => {
    e.preventDefault()
    setEmError('')
    setEmSuccess(false)
    if (!emCurrent) { setEmError('Enter your current passphrase.'); return }
    if (!emNew || !emNew.includes('@')) { setEmError('Enter a valid email address.'); return }
    setEmSaving(true)
    try {
      await changeEmail(emCurrent, emNew)
      setEmSuccess(true)
      setEmCurrent('')
      setEmNew('')
    } catch (err) {
      const msg = err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
        ? 'Current passphrase is incorrect.'
        : err.code === 'auth/email-already-in-use'
        ? 'That email is already in use.'
        : err.message || 'Failed to update email.'
      setEmError(msg)
    } finally {
      setEmSaving(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-faint)', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          ✦ &nbsp; Configuration &nbsp; ✦
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', fontSize: '2.2rem', fontStyle: 'italic' }}>
          Settings
        </h1>
      </div>

      <OrnateDivider className="mb-8" />

      <div style={{ maxWidth: '480px' }}>

        {/* ── Change Email ──────────────────────────────────────── */}
        <Card title="Change Email">
          <form onSubmit={handleEmailSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={label}>Current Passphrase</label>
              <input
                type="password"
                value={emCurrent}
                onChange={e => { setEmCurrent(e.target.value); setEmError(''); setEmSuccess(false) }}
                placeholder="Your current passphrase…"
                style={field}
                autoComplete="current-password"
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={label}>New Email Address</label>
              <input
                type="email"
                value={emNew}
                onChange={e => { setEmNew(e.target.value); setEmError(''); setEmSuccess(false) }}
                placeholder="New email address…"
                style={field}
                autoComplete="email"
              />
            </div>

            {emError && (
              <p style={{ color: 'var(--accent)', opacity: 0.75, fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                {emError}
              </p>
            )}
            {emSuccess && (
              <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                ✦ Email updated successfully.
              </p>
            )}

            <button
              type="submit"
              disabled={emSaving}
              className="btn-gold"
              style={{ opacity: emSaving ? 0.5 : 1, cursor: emSaving ? 'not-allowed' : 'pointer' }}
            >
              {emSaving ? 'Sealing…' : 'Update Email'}
            </button>
          </form>
        </Card>

        {/* ── Change Passphrase ─────────────────────────────────── */}
        <Card title="Change Passphrase">
          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={label}>Current Passphrase</label>
              <input
                type="password"
                value={pwCurrent}
                onChange={e => { setPwCurrent(e.target.value); setPwError(''); setPwSuccess(false) }}
                placeholder="Your current passphrase…"
                style={field}
                autoComplete="current-password"
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={label}>New Passphrase</label>
              <input
                type="password"
                value={pwNew}
                onChange={e => { setPwNew(e.target.value); setPwError(''); setPwSuccess(false) }}
                placeholder="Enter new passphrase…"
                style={field}
                autoComplete="new-password"
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={label}>Confirm Passphrase</label>
              <input
                type="password"
                value={pwConfirm}
                onChange={e => { setPwConfirm(e.target.value); setPwError(''); setPwSuccess(false) }}
                placeholder="Confirm new passphrase…"
                style={field}
                autoComplete="new-password"
              />
            </div>

            {pwError && (
              <p style={{ color: 'var(--accent)', opacity: 0.75, fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                {pwError}
              </p>
            )}
            {pwSuccess && (
              <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                ✦ Passphrase updated successfully.
              </p>
            )}

            <button
              type="submit"
              disabled={pwSaving}
              className="btn-gold"
              style={{ opacity: pwSaving ? 0.5 : 1, cursor: pwSaving ? 'not-allowed' : 'pointer' }}
            >
              {pwSaving ? 'Sealing…' : 'Update Passphrase'}
            </button>
          </form>
        </Card>

      </div>
    </div>
  )
}
