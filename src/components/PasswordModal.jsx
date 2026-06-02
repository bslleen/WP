import { useState, useEffect, useRef } from 'react'
import { OrnateFrame } from './OrnateElements'
import { useNavigate } from 'react-router-dom'

export default function PasswordModal({ isOpen, onClose, onSuccess }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setValue('')
      setError('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSubmit = () => {
    const ok = onSuccess(value)
    if (!ok) {
      setError('The ink does not match.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setValue('')
    } else {
      navigate('/secret')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative w-full max-w-sm mx-4 p-8 transition-all ${shake ? 'animate-shake' : ''}`}
        style={{
          background: 'linear-gradient(135deg, #1a1209, #0d0a05)',
          border: '1px solid #8a6d2f',
          boxShadow: '0 0 60px rgba(201, 168, 76, 0.15), inset 0 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xs tracking-widest"
          style={{ color: '#6b5a3e', fontFamily: "'Crimson Text', serif" }}
        >
          ✕
        </button>

        <div className="text-center mb-6">
          {/* Keyhole SVG */}
          <svg viewBox="0 0 40 56" className="w-8 h-10 mx-auto mb-4" fill="none">
            <circle cx="20" cy="16" r="10" stroke="#c9a84c" strokeWidth="1.5" fill="none" />
            <circle cx="20" cy="16" r="4" fill="#c9a84c" opacity="0.3" />
            <path d="M15 24 L12 48 L28 48 L25 24" stroke="#c9a84c" strokeWidth="1.5" fill="none" />
            <path d="M15 24 L12 48 L28 48 L25 24 Z" fill="#c9a84c" opacity="0.1" />
          </svg>
          <h3
            className="text-2xl italic mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6c8' }}
          >
            Speak the Word
          </h3>
          <p className="text-xs tracking-widest uppercase" style={{ color: '#6b5a3e' }}>
            Private Chambers
          </p>
        </div>

        <div className="mb-4">
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="..."
            className="w-full bg-transparent text-center text-lg py-3 outline-none border-b"
            style={{
              borderColor: '#8a6d2f',
              color: '#f0e6c8',
              fontFamily: "'IM Fell English', serif",
              letterSpacing: '0.3em',
            }}
          />
        </div>

        {error && (
          <p className="text-center text-xs mb-4 tracking-widest" style={{ color: '#c9a84c', opacity: 0.7 }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 text-xs tracking-[0.3em] uppercase transition-all duration-300"
          style={{
            background: 'transparent',
            border: '1px solid #8a6d2f',
            color: '#c9a84c',
            fontFamily: "'Playfair Display', serif",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#c9a84c'
            e.target.style.color = '#0d0a05'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent'
            e.target.style.color = '#c9a84c'
          }}
        >
          Enter
        </button>

        <p className="text-center mt-4 text-xs" style={{ color: '#3d2b14' }}>
          Hint: ink &amp; ashes
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s ease; }
      `}</style>
    </div>
  )
}
