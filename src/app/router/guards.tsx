import type { PropsWithChildren } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { Loader } from '@/components/ui/Loader'
import { useAuth } from '@/core/hooks/useAuth'
import { ROUTES } from '@/core/constants/routes'
import type { Role } from '@/core/constants/roles'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { hydrated, isAuthenticated } = useAuth()
  const currentUserQuery = useCurrentUser()
  const location = useLocation()

  if (!hydrated) {
    return <Loader label="Restaurando sesion..." />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  if (currentUserQuery.isLoading) {
    return <Loader label="Validando usuario..." />
  }

  return children ?? <Outlet />
}

export function RoleGuard({
  allowedRoles,
  children,
}: PropsWithChildren<{ allowedRoles: Role[] }>) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={ROUTES.login} replace />
  }

  const allowed = user.roles.some((role) => allowedRoles.includes(role))

  if (!allowed) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return children ?? <Outlet />
}
