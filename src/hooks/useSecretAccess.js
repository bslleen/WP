import { useState, useEffect, useCallback } from 'react'
import { login, logout, onAuthChange } from '../data/api'

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
    let count = 0
    let timer = null
    const onKey = () => {
      count++
      clearTimeout(timer)
      if (count >= 5) {
        count = 0
        setShowModal(true)
      } else {
        timer = setTimeout(() => { count = 0 }, 1500)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(timer) }
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
