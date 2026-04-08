import type { Round } from '@/core/types/domain'

export interface RoundPayload {
  name: string
  sequence: number
}

export type RoundDetails = Round
