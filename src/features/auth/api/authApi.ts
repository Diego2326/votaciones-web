import { apiGet, apiPost, unauthenticatedClient } from '@/core/api/client'
import type { AuthApiResponse, AuthResponse, User } from '@/core/types/domain'
import type { LoginInput, RegisterInput } from '@/features/auth/types/auth.types'

function normalizeAuthResponse(payload: AuthApiResponse): AuthResponse {
  return {
    accessToken: payload.tokens.accessToken,
    refreshToken: payload.tokens.refreshToken,
    user: payload.user,
  }
}

export const authApi = {
  async login(payload: LoginInput) {
    const response = await apiPost<AuthApiResponse, LoginInput>(
      '/api/v1/auth/login',
      payload,
      unauthenticatedClient,
    )
    return normalizeAuthResponse(response)
  },
  async register(payload: RegisterInput) {
    const response = await apiPost<AuthApiResponse, RegisterInput>(
      '/api/v1/auth/register',
      payload,
      unauthenticatedClient,
    )
    return normalizeAuthResponse(response)
  },
  me() {
    return apiGet<User>('/api/v1/auth/me')
  },
}
