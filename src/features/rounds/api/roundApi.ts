import { apiGet, apiPatch, apiPost } from '@/core/api/client'
import type { RoundResults } from '@/core/types/domain'
import type { RoundPayload } from '@/features/rounds/types/round.types'
import { normalizeRound, type ApiRound } from '@/features/rounds/utils/normalizeRound'

export const roundApi = {
  async list(tournamentId: string) {
    const response = await apiGet<ApiRound[]>(`/api/v1/tournaments/${tournamentId}/rounds`)
    return response.map(normalizeRound)
  },
  async byId(id: string) {
    const response = await apiGet<ApiRound>(`/api/v1/rounds/${id}`)
    return normalizeRound(response)
  },
  async create(tournamentId: string, payload: RoundPayload) {
    const response = await apiPost<ApiRound, RoundPayload>(
      `/api/v1/tournaments/${tournamentId}/rounds`,
      payload,
    )
    return normalizeRound(response)
  },
  async open(id: string) {
    const response = await apiPatch<ApiRound>(`/api/v1/rounds/${id}/open`)
    return normalizeRound(response)
  },
  async close(id: string) {
    const response = await apiPatch<ApiRound>(`/api/v1/rounds/${id}/close`)
    return normalizeRound(response)
  },
  async process(id: string) {
    const response = await apiPatch<ApiRound>(`/api/v1/rounds/${id}/process`)
    return normalizeRound(response)
  },
  async publishResults(id: string) {
    const response = await apiPatch<ApiRound>(`/api/v1/rounds/${id}/publish-results`)
    return normalizeRound(response)
  },
  results(id: string) {
    return apiGet<RoundResults>(`/api/v1/rounds/${id}/results`)
  },
}
