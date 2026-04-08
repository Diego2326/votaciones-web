import type { Participant } from '@/core/types/domain'

export interface ParticipantPayload {
  name: string
  description?: string | null
  seed?: number | null
}

export type ParticipantDetails = Participant
