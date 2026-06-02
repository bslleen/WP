import { Navigate } from 'react-router-dom'
import { getToken } from '../../data/api'

export default function AdminRequireAuth({ children }) {
  if (!getToken()) return <Navigate to="/admin/login" replace />
  return children
}
