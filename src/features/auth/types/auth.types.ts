import type { AuthResponse } from '@/core/types/domain'

export interface LoginInput {
  usernameOrEmail: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export type AuthPayload = AuthResponse
