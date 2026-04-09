import type { Match, MatchParticipant } from '@/core/types/domain'

export interface ApiMatch
  extends Omit<
    Match,
    | 'participantA'
    | 'participantB'
    | 'winner'
    | 'participantAId'
    | 'participantBId'
    | 'participantAName'
    | 'participantBName'
    | 'winnerId'
    | 'winnerParticipantId'
  > {
  participantA?: MatchParticipant | null
  participantB?: MatchParticipant | null
  winner?: MatchParticipant | null
}

export function normalizeMatch(match: ApiMatch): Match {
  return {
    ...match,
    participantA: match.participantA ?? null,
    participantB: match.participantB ?? null,
    winner: match.winner ?? null,
    participantAId: match.participantA?.id ?? null,
    participantBId: match.participantB?.id ?? null,
    participantAName: match.participantA?.name ?? null,
    participantBName: match.participantB?.name ?? null,
    winnerId: match.winner?.id ?? null,
    winnerParticipantId: match.winner?.id ?? null,
  }
}
