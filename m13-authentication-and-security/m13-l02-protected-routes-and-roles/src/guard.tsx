import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './auth'
import { Forbidden } from './pages'
import type { Role } from './roles'

export function RequireRole({ roles }: { roles: Role[] }) {
  const { user } = useAuth()
  const next = useLocation().pathname

  if (!user) {
    return <Navigate to={`/login?next=${next}`} replace />
  }
  if (!roles.includes(user.role)) {
    return <Forbidden role={user.role} />
  }
  return <Outlet />
}
