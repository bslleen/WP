import { useState, useEffect, useCallback, useRef } from 'react'
import { login, logout, onAuthChange } from '../data/api'

export function useSecretAccess() {
  const [showModal, setShowModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Ref so the click handler always reads the latest auth state
  // without needing to re-register the listener
  const isAuthRef = useRef(false)

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      const authed = !!user
      isAuthRef.current = authed
      setIsAuthenticated(authed)
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
    isAuthRef.current = false
    setIsAuthenticated(false)
  }, [])

  // Runs once on mount. Uses isAuthRef so it never needs to re-register.
  useEffect(() => {
    let count = 0
    let timer = null
    const onClick = () => {
      count++
      clearTimeout(timer)
      if (count >= 3) {
        count = 0
        if (isAuthRef.current) {
          doLogout()
        } else {
          setShowModal(true)
        }
      } else {
        timer = setTimeout(() => { count = 0 }, 1500)
      }
    }
    document.addEventListener('click', onClick, true)
    return () => { document.removeEventListener('click', onClick, true); clearTimeout(timer) }
  }, [doLogout]) // doLogout is stable (useCallback []), effectively runs once

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
