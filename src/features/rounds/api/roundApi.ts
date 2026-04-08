import { apiGet, apiPatch, apiPost } from '@/core/api/client'
import type { Round, VoteResults } from '@/core/types/domain'
import type { RoundPayload } from '@/features/rounds/types/round.types'

export const roundApi = {
  list(tournamentId: string) {
    return apiGet<Round[]>(`/api/v1/tournaments/${tournamentId}/rounds`)
  },
  byId(id: string) {
    return apiGet<Round>(`/api/v1/rounds/${id}`)
  },
  create(tournamentId: string, payload: RoundPayload) {
    return apiPost<Round, RoundPayload>(`/api/v1/tournaments/${tournamentId}/rounds`, payload)
  },
  open(id: string) {
    return apiPatch<Round>(`/api/v1/rounds/${id}/open`)
  },
  close(id: string) {
    return apiPatch<Round>(`/api/v1/rounds/${id}/close`)
  },
  process(id: string) {
    return apiPatch<Round>(`/api/v1/rounds/${id}/process`)
  },
  publishResults(id: string) {
    return apiPatch<Round>(`/api/v1/rounds/${id}/publish-results`)
  },
  results(id: string) {
    return apiGet<VoteResults>(`/api/v1/rounds/${id}/results`)
  },
}
