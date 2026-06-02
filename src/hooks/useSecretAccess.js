import { useEffect, useState, useCallback } from 'react'

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a'
]

const SECRET_PASSWORD = 'AAAA18'

export function useSecretAccess() {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [konamiProgress, setKonamiProgress] = useState(0)

  // Check stored auth on mount
  useEffect(() => {
    const auth = localStorage.getItem('secret_auth')
    if (auth === 'true') setIsAuthenticated(true)
  }, [])

  // Konami code listener
  useEffect(() => {
    let progress = 0
    const onKey = (e) => {
      if (e.key === KONAMI[progress]) {
        progress++
        setKonamiProgress(progress)
        if (progress === KONAMI.length) {
          progress = 0
          setKonamiProgress(0)
          setShowPasswordModal(true)
        }
      } else {
        progress = e.key === KONAMI[0] ? 1 : 0
        setKonamiProgress(progress)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const tryPassword = useCallback((pw) => {
    if (pw === SECRET_PASSWORD) {
      localStorage.setItem('secret_auth', 'true')
      setIsAuthenticated(true)
      setShowPasswordModal(false)
      return true
    }
    return false
  }, [])

  const triggerCandle = useCallback(() => {
    setShowPasswordModal(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('secret_auth')
    setIsAuthenticated(false)
  }, [])

  return {
    showPasswordModal,
    setShowPasswordModal,
    isAuthenticated,
    tryPassword,
    triggerCandle,
    logout,
    konamiProgress,
  }
}
