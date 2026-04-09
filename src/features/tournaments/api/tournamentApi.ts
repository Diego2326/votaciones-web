import { apiGet, apiPatch, apiPost, apiPut } from '@/core/api/client'
import type { PaginatedResponse } from '@/core/types/api'
import type {
  TournamentAccess,
  TournamentResults,
  TournamentAccessMode,
} from '@/core/types/domain'
import type { TournamentPayload } from '@/features/tournaments/types/tournament.types'
import {
  normalizeTournament,
  normalizeTournamentCollection,
  type ApiTournament,
} from '@/features/tournaments/utils/normalizeTournament'

export const tournamentApi = {
  async list() {
    const response = await apiGet<ApiTournament[] | PaginatedResponse<ApiTournament>>(
      '/api/v1/tournaments',
    )
    return normalizeTournamentCollection(response)
  },
  async byId(id: string) {
    const response = await apiGet<ApiTournament>(`/api/v1/tournaments/${id}`)
    return normalizeTournament(response)
  },
  async create(payload: TournamentPayload) {
    const response = await apiPost<ApiTournament, TournamentPayload>(
      '/api/v1/tournaments',
      payload,
    )
    return normalizeTournament(response)
  },
  async update(id: string, payload: TournamentPayload) {
    const response = await apiPut<ApiTournament, TournamentPayload>(
      `/api/v1/tournaments/${id}`,
      payload,
    )
    return normalizeTournament(response)
  },
  async publish(id: string) {
    const response = await apiPatch<ApiTournament>(`/api/v1/tournaments/${id}/publish`)
    return normalizeTournament(response)
  },
  async activate(id: string) {
    const response = await apiPatch<ApiTournament>(`/api/v1/tournaments/${id}/activate`)
    return normalizeTournament(response)
  },
  async pause(id: string) {
    const response = await apiPatch<ApiTournament>(`/api/v1/tournaments/${id}/pause`)
    return normalizeTournament(response)
  },
  async close(id: string) {
    const response = await apiPatch<ApiTournament>(`/api/v1/tournaments/${id}/close`)
    return normalizeTournament(response)
  },
  access(id: string) {
    return apiGet<TournamentAccess>(`/api/v1/tournaments/${id}/access`)
  },
  updateAccess(id: string, mode: TournamentAccessMode) {
    return apiPatch<TournamentAccess, { mode: TournamentAccessMode }>(
      `/api/v1/tournaments/${id}/access`,
      { mode },
    )
  },
  regeneratePin(id: string) {
    return apiPatch<TournamentAccess>(`/api/v1/tournaments/${id}/regenerate-pin`)
  },
  results(id: string) {
    return apiGet<TournamentResults>(`/api/v1/tournaments/${id}/results`)
  },
}
