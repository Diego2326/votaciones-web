import { ROLES } from '@/core/constants/roles'
import type { Tournament, User } from '@/core/types/domain'

export function isAdminUser(user: User | null) {
  return Boolean(user?.roles.includes(ROLES.ADMIN))
}

export function canManageTournament(
  user: User | null,
  tournament: Pick<Tournament, 'organizerId'> | null | undefined,
) {
  if (!user) {
    return false
  }

  if (isAdminUser(user)) {
    return true
  }

  const organizerId = tournament?.organizerId

  return Boolean(organizerId) && organizerId === user.id
}
