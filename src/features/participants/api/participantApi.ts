import { apiDelete, apiGet, apiPost, apiPut } from '@/core/api/client'
import type { ParticipantPayload } from '@/features/participants/types/participant.types'
import {
  normalizeParticipant,
  type ApiParticipant,
} from '@/features/participants/utils/normalizeParticipant'

export const participantApi = {
  async list(tournamentId: string) {
    const response = await apiGet<ApiParticipant[]>(
      `/api/v1/tournaments/${tournamentId}/participants`,
    )
    return response.map(normalizeParticipant)
  },
  async create(tournamentId: string, payload: ParticipantPayload) {
    const response = await apiPost<ApiParticipant, ParticipantPayload>(
      `/api/v1/tournaments/${tournamentId}/participants`,
      payload,
    )
    return normalizeParticipant(response)
  },
  async update(id: string, payload: ParticipantPayload) {
    const response = await apiPut<ApiParticipant, ParticipantPayload>(
      `/api/v1/participants/${id}`,
      payload,
    )
    return normalizeParticipant(response)
  },
  remove(id: string) {
    return apiDelete<void>(`/api/v1/participants/${id}`)
  },
}
