import type { Participant } from '@/core/types/domain'

export interface ApiParticipant extends Omit<Participant, 'active'> {
  active?: boolean | null
}

export function normalizeParticipant(participant: ApiParticipant): Participant {
  return {
    ...participant,
    description: participant.description ?? null,
    imageUrl: participant.imageUrl ?? null,
    active: participant.active ?? true,
  }
}
