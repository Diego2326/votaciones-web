import type { Tournament } from '@/core/types/domain'

export interface TournamentPayload {
  name: string
  description?: string | null
}

export type TournamentDetails = Tournament
