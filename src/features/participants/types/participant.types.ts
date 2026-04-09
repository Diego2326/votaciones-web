import type { Participant } from '@/core/types/domain'

export interface ParticipantPayload {
  name: string
  description?: string | null
  imageUrl?: string | null
  active?: boolean
}

export type ParticipantDetails = Participant
