import type { Role } from '@/core/constants/roles'

export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  enabled: boolean
  roles: Role[]
  createdAt?: string
  updatedAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType?: string
  expiresInSeconds?: number
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user?: User
}

export interface AuthApiResponse {
  tokens: AuthTokens
  user: User
}

export type TournamentStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'CLOSED'
  | 'FINISHED'
  | 'CANCELLED'

export type TournamentType = 'ELIMINATION' | 'ROUND_BASED' | 'POLL' | 'BRACKET'

export type TournamentAccessMode = 'EMAIL_PASSWORD' | 'DISPLAY_NAME' | 'ANONYMOUS'

export interface TournamentCreator {
  id: string
  username: string
  fullName?: string | null
}

export interface Tournament {
  id: string
  name: string
  title: string
  type: TournamentType
  description: string | null
  accessMode: TournamentAccessMode
  startAt?: string | null
  endAt?: string | null
  status: TournamentStatus
  published: boolean
  active: boolean
  createdAt?: string
  updatedAt?: string
  organizerId?: string
  createdBy?: TournamentCreator | null
}

export interface Participant {
  id: string
  tournamentId: string
  name: string
  description?: string | null
  imageUrl?: string | null
  seed?: number | null
  active: boolean
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
  roundNumber: number
  sequence: number
  status: RoundStatus
  opensAt?: string | null
  closesAt?: string | null
  resultsPublishedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export type MatchStatus = 'PENDING' | 'OPEN' | 'CLOSED' | 'RESOLVED'

export interface MatchParticipant {
  id: string
  name: string
  imageUrl?: string | null
  active?: boolean
}

export interface Match {
  id: string
  roundId: string
  participantA?: MatchParticipant | null
  participantB?: MatchParticipant | null
  winner?: MatchParticipant | null
  participantAId: string | null
  participantBId: string | null
  participantAName?: string | null
  participantBName?: string | null
  winnerId?: string | null
  winnerParticipantId?: string | null
  status: MatchStatus
  createdAt?: string
  updatedAt?: string
}

export interface Vote {
  id: string
  tournamentId?: string
  roundId?: string
  matchId: string
  voterId?: string | null
  joinSessionId?: string | null
  participantId: string
  selectedParticipantId: string
  createdAt?: string
}

export interface MatchResultEntry {
  participantId: string
  participantName: string
  votes: number
}

export interface MatchResults {
  matchId: string
  status: MatchStatus
  winnerId?: string | null
  totalVotes: number
  results: MatchResultEntry[]
}

export interface RoundResults {
  roundId: string
  tournamentId: string
  status: RoundStatus
  matches: MatchResults[]
}

export interface TournamentResults {
  tournamentId: string
  status: TournamentStatus
  rounds: RoundResults[]
}

export interface MyVote {
  hasVoted: boolean
  selectedParticipantId?: string | null
  participantId?: string | null
  votedAt?: string | null
}

export interface TournamentAccess {
  tournamentId: string
  mode: TournamentAccessMode
  joinPin: string
  qrToken: string
  joinUrl: string
}

export interface TournamentSession {
  tournamentId: string
  tournamentTitle: string
  mode: TournamentAccessMode
  sessionToken: string
  displayName?: string | null
  userId?: string | null
  joinedAt: string
  expiresAt?: string | null
}

export interface TournamentSessionProfile {
  sessionId: string
  tournamentId: string
  displayName?: string | null
  userId?: string | null
  joinedAt: string
  lastSeenAt?: string | null
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
