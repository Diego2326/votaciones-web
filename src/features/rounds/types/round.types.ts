import type { Round } from '@/core/types/domain'

export interface RoundPayload {
  name: string
  roundNumber?: number
  opensAt?: string
  closesAt?: string
}

export type RoundDetails = Round
