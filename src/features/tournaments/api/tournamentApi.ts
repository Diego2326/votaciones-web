import { apiGet, apiPatch, apiPost, apiPut } from '@/core/api/client'
import type { Tournament, VoteResults } from '@/core/types/domain'
import type { TournamentPayload } from '@/features/tournaments/types/tournament.types'

export const tournamentApi = {
  list() {
    return apiGet<Tournament[]>('/api/v1/tournaments')
  },
  byId(id: string) {
    return apiGet<Tournament>(`/api/v1/tournaments/${id}`)
  },
  create(payload: TournamentPayload) {
    return apiPost<Tournament, TournamentPayload>('/api/v1/tournaments', payload)
  },
  update(id: string, payload: TournamentPayload) {
    return apiPut<Tournament, TournamentPayload>(`/api/v1/tournaments/${id}`, payload)
  },
  publish(id: string) {
    return apiPatch<Tournament>(`/api/v1/tournaments/${id}/publish`)
  },
  activate(id: string) {
    return apiPatch<Tournament>(`/api/v1/tournaments/${id}/activate`)
  },
  close(id: string) {
    return apiPatch<Tournament>(`/api/v1/tournaments/${id}/close`)
  },
  results(id: string) {
    return apiGet<VoteResults>(`/api/v1/tournaments/${id}/results`)
  },
}
