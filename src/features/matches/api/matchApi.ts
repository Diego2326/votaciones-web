import { apiGet, apiPatch, apiPost } from '@/core/api/client'
import type { Match } from '@/core/types/domain'
import type { MatchPayload } from '@/features/matches/types/match.types'

export const matchApi = {
  list(roundId: string) {
    return apiGet<Match[]>(`/api/v1/rounds/${roundId}/matches`)
  },
  byId(id: string) {
    return apiGet<Match>(`/api/v1/matches/${id}`)
  },
  create(roundId: string, payload: MatchPayload) {
    return apiPost<Match, MatchPayload>(`/api/v1/rounds/${roundId}/matches`, payload)
  },
  assignWinner(id: string, winnerParticipantId: string) {
    return apiPatch<Match, { winnerParticipantId: string }>(
      `/api/v1/matches/${id}/winner`,
      { winnerParticipantId },
    )
  },
}
