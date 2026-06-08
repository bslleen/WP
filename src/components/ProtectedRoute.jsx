import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ isAuthenticated, loading, children }) {
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/" replace />
  return children
}
