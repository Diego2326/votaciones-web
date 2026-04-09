import { apiGet, apiPost, sessionClient } from '@/core/api/client'
import type {
  MatchResults,
  MyVote,
  RoundResults,
  TournamentResults,
  Vote,
} from '@/core/types/domain'
import { normalizeMatch, type ApiMatch } from '@/features/matches/utils/normalizeMatch'
import type { VotePayload } from '@/features/votes/types/vote.types'

export const voteApi = {
  submitVote(matchId: string, payload: VotePayload) {
    return apiPost<Vote, VotePayload>(`/api/v1/matches/${matchId}/vote`, payload, sessionClient)
  },
  getMatchResults(matchId: string) {
    return apiGet<MatchResults>(`/api/v1/matches/${matchId}/results`)
  },
  async getMyVote(matchId: string) {
    const response = await apiGet<MyVote>(`/api/v1/matches/${matchId}/my-vote`, sessionClient)
    return {
      ...response,
      participantId: response.participantId ?? response.selectedParticipantId ?? null,
      selectedParticipantId: response.selectedParticipantId ?? response.participantId ?? null,
    }
  },
  getTournamentResults(tournamentId: string) {
    return apiGet<TournamentResults>(`/api/v1/tournaments/${tournamentId}/results`)
  },
  roundResults(roundId: string) {
    return apiGet<RoundResults>(`/api/v1/rounds/${roundId}/results`)
  },
  async matchDetails(matchId: string) {
    const response = await apiGet<ApiMatch>(`/api/v1/matches/${matchId}`)
    return normalizeMatch(response)
  },
}
