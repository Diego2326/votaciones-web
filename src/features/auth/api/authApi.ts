import { apiGet, apiPost } from '@/core/api/client'
import type { AuthResponse, User } from '@/core/types/domain'
import type { LoginInput, RegisterInput } from '@/features/auth/types/auth.types'

export const authApi = {
  login(payload: LoginInput) {
    return apiPost<AuthResponse, LoginInput>('/api/v1/auth/login', payload)
  },
  register(payload: RegisterInput) {
    return apiPost<AuthResponse, RegisterInput>('/api/v1/auth/register', payload)
  },
  me() {
    return apiGet<User>('/api/v1/auth/me')
  },
}
