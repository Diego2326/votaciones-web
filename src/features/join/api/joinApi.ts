import { apiGet, apiPatch, apiPost, sessionClient } from '@/core/api/client'
import type {
  TournamentAccess,
  TournamentSession,
  TournamentSessionProfile,
} from '@/core/types/domain'
import type {
  JoinByAuthPayload,
  JoinByNamePayload,
  JoinByPinPayload,
  JoinByQrPayload,
  UpdateTournamentAccessPayload,
} from '@/features/join/types/join.types'

export const joinApi = {
  pinInfo(payload: JoinByPinPayload) {
    return apiPost<TournamentAccess, JoinByPinPayload>('/api/v1/join/pin', payload)
  },
  qrInfo(payload: JoinByQrPayload) {
    return apiPost<TournamentAccess, JoinByQrPayload>('/api/v1/join/qr/info', payload)
  },
  joinByName(payload: JoinByNamePayload) {
    return apiPost<TournamentSession, JoinByNamePayload>('/api/v1/join/name', payload)
  },
  joinByAuth(payload: JoinByAuthPayload) {
    return apiPost<TournamentSession, JoinByAuthPayload>('/api/v1/join/auth', payload)
  },
  joinByQr(payload: JoinByQrPayload) {
    return apiPost<TournamentSession, JoinByQrPayload>('/api/v1/join/qr', payload)
  },
  sessionMe() {
    return apiGet<TournamentSessionProfile>('/api/v1/join/me', sessionClient)
  },
  getAccess(tournamentId: string) {
    return apiGet<TournamentAccess>(`/api/v1/tournaments/${tournamentId}/access`)
  },
  updateAccess(tournamentId: string, payload: UpdateTournamentAccessPayload) {
    return apiPatch<TournamentAccess, UpdateTournamentAccessPayload>(
      `/api/v1/tournaments/${tournamentId}/access`,
      payload,
    )
  },
  regeneratePin(tournamentId: string) {
    return apiPatch<TournamentAccess>(`/api/v1/tournaments/${tournamentId}/regenerate-pin`)
  },
}
