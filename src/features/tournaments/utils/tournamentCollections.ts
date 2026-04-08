import type { Tournament, User } from '@/core/types/domain'

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

  if (!user || !hasOwnershipData) {
    return {
      hasOwnershipData,
      mine: tournaments,
      others: [],
      visible: tournaments,
    }
  }

  const mine = tournaments.filter((tournament) => tournament.organizerId === user.id)
  const others = tournaments.filter((tournament) => tournament.organizerId !== user.id)

  return {
    hasOwnershipData,
    mine,
    others,
    visible: mine,
  }
}
