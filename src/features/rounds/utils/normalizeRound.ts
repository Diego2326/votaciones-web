import type { Round } from '@/core/types/domain'

export interface ApiRound
  extends Omit<Round, 'roundNumber' | 'sequence' | 'opensAt' | 'closesAt' | 'resultsPublishedAt'> {
  roundNumber?: number | null
  sequence?: number | null
  opensAt?: string | null
  closesAt?: string | null
  resultsPublishedAt?: string | null
}

export function normalizeRound(round: ApiRound): Round {
  const roundNumber = round.roundNumber ?? round.sequence ?? 1

  return {
    ...round,
    roundNumber,
    sequence: roundNumber,
    opensAt: round.opensAt ?? null,
    closesAt: round.closesAt ?? null,
    resultsPublishedAt: round.resultsPublishedAt ?? null,
  }
}
