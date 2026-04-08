import { apiDelete, apiGet, apiPost, apiPut } from '@/core/api/client'
import type { Participant } from '@/core/types/domain'
import type { ParticipantPayload } from '@/features/participants/types/participant.types'

export const participantApi = {
  list(tournamentId: string) {
    return apiGet<Participant[]>(`/api/v1/tournaments/${tournamentId}/participants`)
  },
  create(tournamentId: string, payload: ParticipantPayload) {
    return apiPost<Participant, ParticipantPayload>(
      `/api/v1/tournaments/${tournamentId}/participants`,
      payload,
    )
  },
  update(id: string, payload: ParticipantPayload) {
    return apiPut<Participant, ParticipantPayload>(`/api/v1/participants/${id}`, payload)
  },
  remove(id: string) {
    return apiDelete<void>(`/api/v1/participants/${id}`)
  },
}
