import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './auth'
import type { Role } from './roles'

export function RequireRole({ roles }: { roles: Role[] }) {
  const { user } = useAuth()
  const next = useLocation().pathname

  if (!user) {
    return <Navigate to={`/login?next=${next}`} replace />
  }
  if (!roles.includes(user.role)) {
    return <Navigate to={`/login?next=${next}`} replace />
  }
  return <Outlet />
}
