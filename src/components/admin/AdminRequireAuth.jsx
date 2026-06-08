import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { auth } from '../../firebase'
import { onAuthChange } from '../../data/api'

export default function AdminRequireAuth({ children }) {
  const [user, setUser] = useState(auth.currentUser)
  const [loading, setLoading] = useState(!auth.currentUser)

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading) return null
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}
