import type { Role } from '@/core/constants/roles'

export interface User {
  id: string
  username: string
  email: string
  enabled: boolean
  roles: Role[]
  createdAt?: string
  updatedAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export type TournamentStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ACTIVE'
  | 'CLOSED'
  | 'FINISHED'
  | 'CANCELLED'

export interface Tournament {
  id: string
  name: string
  description: string | null
  status: TournamentStatus
  published: boolean
  active: boolean
  createdAt?: string
  updatedAt?: string
  organizerId?: string
}

export interface Participant {
  id: string
  tournamentId: string
  name: string
  description?: string | null
  seed?: number | null
  active?: boolean
}

export type RoundStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'OPEN'
  | 'CLOSED'
  | 'PROCESSING'
  | 'PUBLISHED'

export interface Round {
  id: string
  tournamentId: string
  name: string
  sequence: number
  status: RoundStatus
  opensAt?: string | null
  closesAt?: string | null
}

export type MatchStatus = 'PENDING' | 'OPEN' | 'CLOSED' | 'RESOLVED'

export interface Match {
  id: string
  roundId: string
  participantAId: string | null
  participantBId: string | null
  participantAName?: string | null
  participantBName?: string | null
  winnerParticipantId?: string | null
  status: MatchStatus
  votesA?: number
  votesB?: number
}

export interface Vote {
  id: string
  matchId: string
  voterId?: string | null
  participantId: string
  createdAt?: string
}

export interface VoteResults {
  matchId: string
  totalVotes: number
  winnerParticipantId?: string | null
  entries: Array<{
    participantId: string
    participantName: string
    voteCount: number
  }>
}

export interface MyVote {
  hasVoted: boolean
  participantId?: string | null
  votedAt?: string | null
}

export interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  userId?: string | null
  username?: string | null
  createdAt: string
  details?: string | null
}

export type WebSocketEventType =
  | 'TOURNAMENT_UPDATED'
  | 'ROUND_OPENED'
  | 'ROUND_CLOSED'
  | 'VOTE_COUNT_UPDATED'
  | 'RESULTS_PUBLISHED'
  | 'PARTICIPATION_UPDATED'

export interface WebSocketEvent<TPayload = unknown> {
  type: WebSocketEventType
  tournamentId?: string
  roundId?: string
  payload: TPayload
  emittedAt: string
}
