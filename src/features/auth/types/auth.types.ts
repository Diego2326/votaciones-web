import type { Role } from '@/core/constants/roles'
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
  roles: Role[]
}

export type AuthPayload = AuthResponse
