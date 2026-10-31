import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './auth'

export function RequireAuth() {
  const { user } = useAuth()
  const next = useLocation().pathname

  if (!user) {
    return <Navigate to={`/login?next=${next}`} replace />
  }
  return <Outlet />
}
