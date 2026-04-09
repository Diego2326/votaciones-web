import type { Match } from '@/core/types/domain'

export interface ManualMatchPayload {
  participantAId: string
  participantBId: string
}

export interface MatchPayload {
  autoGenerate?: boolean
  matches?: ManualMatchPayload[]
}

export type MatchDetails = Match
