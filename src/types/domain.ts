export type TournamentAccessMode =
  | 'ANONYMOUS'
  | 'DISPLAY_NAME'
  | 'EMAIL_PASSWORD'

export type TournamentStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'CLOSED'
  | 'FINISHED'
  | 'CANCELLED'

export type RoundStatus =
  | 'PENDING'
  | 'OPEN'
  | 'CLOSED'
  | 'PROCESSING'
  | 'PUBLISHED'

export type MatchStatus =
  | 'PENDING'
  | 'OPEN'
  | 'CLOSED'
  | 'RESOLVED'
  | 'TIED'
  | 'CANCELLED'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
  role: string
}

export interface LoginResponse {
  tokens: AuthTokens
  user: AuthUser
}

export interface TournamentSummary {
  id: string
  title: string
  description: string | null
  type: string
  accessMode: TournamentAccessMode
  status: TournamentStatus
  startAt: string | null
  endAt: string | null
}

export interface TournamentAccessConfig {
  tournamentId: string
  mode: TournamentAccessMode
  joinPin: string
  qrToken: string
  joinUrl: string
}

export interface JoinInfo {
  tournamentId: string
  mode: TournamentAccessMode
  joinPin: string
  qrToken: string
  joinUrl: string
}

export interface JoinSession {
  tournamentId: string
  tournamentTitle: string
  mode: TournamentAccessMode
  sessionToken: string
  displayName: string | null
  userId: string | null
  joinedAt: string
  expiresAt: string | null
}

export interface RoundSummary {
  id: string
  tournamentId: string
  title: string
  status: RoundStatus
}

export interface MatchSummary {
  id: string
  roundId: string
  status: MatchStatus
  participantAId: string | null
  participantBId: string | null
}

export interface VoteRecord {
  id: string
  tournamentId: string
  roundId: string
  matchId: string
  voterId: string | null
  joinSessionId: string
  selectedParticipantId: string
  createdAt: string
}

export interface MyVote {
  hasVoted: boolean
  selectedParticipantId: string | null
  votedAt: string | null
}

export interface RealtimeEvent<TPayload = unknown> {
  eventType: string
  tournamentId: string
  roundId?: string
  matchId?: string
  message: string
  payload: TPayload
  emittedAt: string
}
