import { apiGet, apiPost } from '@/core/api/client'
import type { PaginatedResponse } from '@/core/types/api'
import type { Match, MyVote, Tournament, Vote, VoteResults } from '@/core/types/domain'
import type { VotePayload } from '@/features/votes/types/vote.types'

function normalizeTournamentList(
  payload: Tournament[] | PaginatedResponse<Tournament>,
) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload.content)) {
    return payload.content
  }

  return []
}

export const voteApi = {
  submitVote(matchId: string, payload: VotePayload) {
    return apiPost<Vote, VotePayload>(`/api/v1/matches/${matchId}/vote`, payload)
  },
  getMatchResults(matchId: string) {
    return apiGet<VoteResults>(`/api/v1/matches/${matchId}/results`)
  },
  getMyVote(matchId: string) {
    return apiGet<MyVote>(`/api/v1/matches/${matchId}/my-vote`)
  },
  getTournamentResults(tournamentId: string) {
    return apiGet<VoteResults>(`/api/v1/tournaments/${tournamentId}/results`)
  },
  async publicTournaments() {
    const response = await apiGet<Tournament[] | PaginatedResponse<Tournament>>(
      '/api/v1/tournaments',
    )
    return normalizeTournamentList(response)
  },
  roundResults(roundId: string) {
    return apiGet<VoteResults>(`/api/v1/rounds/${roundId}/results`)
  },
  matchDetails(matchId: string) {
    return apiGet<Match>(`/api/v1/matches/${matchId}`)
  },
}
