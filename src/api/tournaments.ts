import { apiRequest, authorizedRequest } from './http'
import type {
  MatchSummary,
  RoundSummary,
  TournamentAccessConfig,
  TournamentSummary,
} from '../types/domain'

export const tournamentsApi = {
  listPublicTournaments() {
    return apiRequest<TournamentSummary[]>('/api/v1/tournaments')
  },

  getTournament(id: string) {
    return apiRequest<TournamentSummary>(`/api/v1/tournaments/${id}`)
  },

  getTournamentAccess(tournamentId: string) {
    return authorizedRequest<TournamentAccessConfig>(
      `/api/v1/tournaments/${tournamentId}/access`,
    )
  },

  updateTournamentAccess(tournamentId: string, mode: string) {
    return authorizedRequest<TournamentAccessConfig>(
      `/api/v1/tournaments/${tournamentId}/access`,
      {
        method: 'PATCH',
        body: JSON.stringify({ mode }),
      },
    )
  },

  regeneratePin(tournamentId: string) {
    return authorizedRequest<TournamentAccessConfig>(
      `/api/v1/tournaments/${tournamentId}/regenerate-pin`,
      {
        method: 'PATCH',
      },
    )
  },

  listRounds(tournamentId: string) {
    return apiRequest<RoundSummary[]>(
      `/api/v1/tournaments/${tournamentId}/rounds`,
    )
  },

  listMatches(roundId: string) {
    return apiRequest<MatchSummary[]>(`/api/v1/rounds/${roundId}/matches`)
  },
}
