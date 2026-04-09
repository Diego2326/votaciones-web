import type { Tournament, User } from '@/core/types/domain'
import { isAdminUser } from '@/features/tournaments/utils/ownership'

interface TournamentCollections {
  hasOwnershipData: boolean
  mine: Tournament[]
  others: Tournament[]
  visible: Tournament[]
}

export function getTournamentCollections(
  tournaments: Tournament[],
  user: User | null,
): TournamentCollections {
  const hasOwnershipData = tournaments.some((tournament) => Boolean(tournament.organizerId))

  if (!user) {
    return {
      hasOwnershipData,
      mine: tournaments,
      others: [],
      visible: tournaments,
    }
  }

  if (isAdminUser(user)) {
    return {
      hasOwnershipData,
      mine: tournaments,
      others: [],
      visible: tournaments,
    }
  }

  if (!hasOwnershipData) {
    return {
      hasOwnershipData,
      mine: [],
      others: [],
      visible: [],
    }
  }

  const mine = tournaments.filter((tournament) => tournament.organizerId === user.id)

  return {
    hasOwnershipData,
    mine,
    others: [],
    visible: mine,
  }
}
