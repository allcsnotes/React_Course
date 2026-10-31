import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './AuthContext.tsx'
import type { Role } from './schema.ts'

export default function RequireRole({ roles }: { roles: Role[] }) {
  const { user, checking } = useAuth()
  const next = useLocation().pathname

  if (checking) return <p className="note">Checking your session...</p>
  if (!user) return <Navigate to={`/login?next=${next}`} replace />
  if (!roles.includes(user.role)) {
    return <p className="bad">403: not for your role ({user.role})</p>
  }
  return <Outlet />
}
