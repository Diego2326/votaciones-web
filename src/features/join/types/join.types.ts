import type { TournamentAccessMode, TournamentSession } from '@/core/types/domain'

export interface JoinByPinPayload {
  pin: string
}

export interface JoinByQrPayload {
  qrToken: string
}

export interface JoinByNamePayload {
  pin?: string
  qrToken?: string
  displayName: string
}

export interface JoinByAuthPayload {
  pin?: string
  qrToken?: string
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface UpdateTournamentAccessPayload {
  mode: TournamentAccessMode
}

export type JoinSessionPayload = TournamentSession
