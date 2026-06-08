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

  // 3 clicks anywhere → open modal (unauthenticated) or logout (authenticated)
  useEffect(() => {
    let count = 0
    let timer = null
    const onClick = () => {
      count++
      clearTimeout(timer)
      if (count >= 3) {
        count = 0
        if (isAuthenticated) {
          doLogout()
        } else {
          setShowModal(true)
        }
      } else {
        timer = setTimeout(() => { count = 0 }, 1500)
      }
    }
    // capture:true fires before React synthetic events and before any stopPropagation
    document.addEventListener('click', onClick, true)
    return () => { document.removeEventListener('click', onClick, true); clearTimeout(timer) }
  }, [isAuthenticated, doLogout])

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
