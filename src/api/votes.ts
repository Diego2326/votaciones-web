import { apiRequest, sessionRequest } from './http'
import type { MyVote, VoteRecord } from '../types/domain'

interface VotePayload {
  selectedParticipantId: string
}

export const votesApi = {
  getMatch(matchId: string) {
    return apiRequest(`/api/v1/matches/${matchId}`)
  },

  submitVote(matchId: string, sessionToken: string, payload: VotePayload) {
    return sessionRequest<VoteRecord>(`/api/v1/matches/${matchId}/vote`, {
      method: 'POST',
      sessionToken,
      body: JSON.stringify(payload),
    })
  },

  getMyVote(matchId: string, sessionToken: string) {
    return sessionRequest<MyVote>(`/api/v1/matches/${matchId}/my-vote`, {
      method: 'GET',
      sessionToken,
    })
  },
}
