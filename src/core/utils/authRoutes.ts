import { ROLES, type Role } from '@/core/constants/roles'
import { ROUTES } from '@/core/constants/routes'
import type { User } from '@/core/types/domain'

export function getDefaultRouteForRoles(roles: Role[] = []) {
  if (roles.includes(ROLES.ADMIN) || roles.includes(ROLES.ORGANIZER)) {
    return ROUTES.dashboard
  }

  if (roles.includes(ROLES.VOTER)) {
    return ROUTES.voteHome
  }

  return ROUTES.root
}

export function getDefaultRouteForUser(user: User | null | undefined) {
  return getDefaultRouteForRoles(user?.roles ?? [])
}
