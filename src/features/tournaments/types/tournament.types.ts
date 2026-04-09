import type { Tournament, TournamentAccessMode, TournamentType } from '@/core/types/domain'

export const TOURNAMENT_TYPES = [
  'ELIMINATION',
  'ROUND_BASED',
  'POLL',
  'BRACKET',
] as const satisfies readonly TournamentType[]

export const TOURNAMENT_ACCESS_MODES = [
  'EMAIL_PASSWORD',
  'DISPLAY_NAME',
  'ANONYMOUS',
] as const satisfies readonly TournamentAccessMode[]

export interface TournamentPayload {
  title: string
  type: TournamentType
  description?: string | null
  accessMode?: TournamentAccessMode
  startAt?: string
  endAt?: string
}

export type TournamentDetails = Tournament
