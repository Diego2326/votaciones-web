import type { PropsWithChildren } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { Loader } from '@/components/ui/Loader'
import { ROUTES } from '@/core/constants/routes'
import { useAuth } from '@/core/hooks/useAuth'
import { getDefaultRouteForUser } from '@/core/utils/authRoutes'
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
  const { user, accessToken } = useAuth()
  const currentUserQuery = useCurrentUser()
  const location = useLocation()
  const effectiveUser = user ?? currentUserQuery.data ?? null

  if (!effectiveUser && accessToken && (currentUserQuery.isLoading || currentUserQuery.isFetching)) {
    return <Loader label="Restaurando permisos..." />
  }

  if (!effectiveUser) {
    return <Navigate to={ROUTES.login} replace />
  }

  const allowed = effectiveUser.roles.some((role) => allowedRoles.includes(role))

  if (!allowed) {
    const fallbackRoute = getDefaultRouteForUser(effectiveUser)

    if (fallbackRoute === location.pathname) {
      return <Navigate to={ROUTES.root} replace />
    }

    return <Navigate to={fallbackRoute} replace />
  }

  return children ?? <Outlet />
}
