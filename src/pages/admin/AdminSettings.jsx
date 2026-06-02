import { useState } from 'react'
import { changePassword } from '../../data/api'
import { OrnateDivider } from '../../components/OrnateElements'

const field = {
  width: '100%',
  background: 'rgba(13,10,5,0.5)',
  border: '1px solid rgba(138,109,47,0.2)',
  outline: 'none',
  padding: '0.7rem 1rem',
  color: '#d4c49a',
  fontFamily: "'IM Fell English', serif",
  fontSize: '0.95rem',
}

const label = {
  display: 'block',
  color: '#8a6d2f',
  fontSize: '0.6rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  fontFamily: "'Playfair Display', serif",
  marginBottom: '0.5rem',
}

export default function AdminSettings() {
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (!newPassword) { setError('Enter a new passphrase.'); return }
    if (newPassword.length < 6) { setError('Passphrase must be at least 6 characters.'); return }
    if (newPassword !== confirm) { setError('Passphrases do not match.'); return }
    setSaving(true)
    try {
      await changePassword(newPassword)
      setSuccess(true)
      setNewPassword('')
      setConfirm('')
    } catch (err) {
      setError(err.message || 'Failed to update passphrase.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#4a3520', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          ✦ &nbsp; Configuration &nbsp; ✦
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8', fontSize: '2.2rem', fontStyle: 'italic' }}>
          Settings
        </h1>
      </div>

      <OrnateDivider className="mb-8" />

      <div style={{ maxWidth: '480px' }}>
        <div style={{
          padding: '2rem',
          border: '1px solid rgba(138,109,47,0.2)',
          background: 'rgba(26,18,9,0.5)',
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            color: '#c9a84c',
            fontSize: '1.1rem',
            fontStyle: 'italic',
            marginBottom: '1.5rem',
          }}>
            Change Passphrase
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={label}>New Passphrase</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); setError(''); setSuccess(false) }}
                placeholder="Enter new passphrase…"
                style={field}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={label}>Confirm Passphrase</label>
              <input
                type="password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError(''); setSuccess(false) }}
                placeholder="Confirm new passphrase…"
                style={field}
              />
            </div>

            {error && (
              <p style={{ color: '#c9a84c', opacity: 0.75, fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                {error}
              </p>
            )}
            {success && (
              <p style={{ color: '#c9a84c', fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                ✦ Passphrase updated successfully.
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn-gold"
              style={{ opacity: saving ? 0.5 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Sealing…' : 'Update Passphrase'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
