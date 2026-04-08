import { authorizedRequest, apiRequest } from './http'
import type { LoginResponse, TournamentSummary } from '../types/domain'

interface LoginPayload {
  usernameOrEmail: string
  password: string
}

interface CreateTournamentPayload {
  title: string
  description?: string | null
  type: string
  accessMode: string
  startAt?: string | null
  endAt?: string | null
}

export const organizerApi = {
  login(payload: LoginPayload) {
    return apiRequest<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  listTournaments() {
    return authorizedRequest<TournamentSummary[]>('/api/v1/tournaments')
  },

  createTournament(payload: CreateTournamentPayload) {
    return authorizedRequest<TournamentSummary>('/api/v1/tournaments', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
