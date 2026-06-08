import { useState, useEffect, useCallback } from 'react'
import { login, logout, onAuthChange } from '../data/api'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export function useSecretAccess() {
  const [showModal, setShowModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setIsAuthenticated(!!user)
      setLoading(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    let progress = 0
    const onKey = (e) => {
      if (e.key === KONAMI[progress]) {
        progress++
        if (progress === KONAMI.length) {
          progress = 0
          setShowModal(true)
        }
      } else {
        progress = e.key === KONAMI[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const tryPassword = useCallback(async (email, password) => {
    try {
      await login(email, password)
      return { ok: true }
    } catch (err) {
      return { ok: false, code: err?.code || '' }
    }
  }, [])

  const triggerCandle = useCallback(() => setShowModal(true), [])

  const doLogout = useCallback(async () => {
    await logout()
    setIsAuthenticated(false)
  }, [])

  return {
    showPasswordModal: showModal,
    setShowPasswordModal: setShowModal,
    isAuthenticated,
    loading,
    tryPassword,
    triggerCandle,
    logout: doLogout,
  }
}
