import { apiGet, apiPatch, apiPost } from '@/core/api/client'
import type { MatchPayload } from '@/features/matches/types/match.types'
import { normalizeMatch, type ApiMatch } from '@/features/matches/utils/normalizeMatch'

export const matchApi = {
  async list(roundId: string) {
    const response = await apiGet<ApiMatch[]>(`/api/v1/rounds/${roundId}/matches`)
    return response.map(normalizeMatch)
  },
  async byId(id: string) {
    const response = await apiGet<ApiMatch>(`/api/v1/matches/${id}`)
    return normalizeMatch(response)
  },
  async create(roundId: string, payload: MatchPayload) {
    const response = await apiPost<ApiMatch[], MatchPayload>(
      `/api/v1/rounds/${roundId}/matches`,
      payload,
    )
    return response.map(normalizeMatch)
  },
  async assignWinner(id: string, winnerId: string) {
    const response = await apiPatch<ApiMatch, { winnerId: string }>(
      `/api/v1/matches/${id}/winner`,
      { winnerId },
    )
    return normalizeMatch(response)
  },
}
