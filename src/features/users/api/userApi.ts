import { apiGet, apiPatch } from '@/core/api/client'
import type { PaginatedResponse } from '@/core/types/api'
import type { UserRolesPayload, UserStatusPayload } from '@/features/users/types/user.types'
import {
  normalizeUser,
  normalizeUserCollection,
  type ApiUser,
} from '@/features/users/utils/normalizeUser'

export const userApi = {
  async list() {
    const response = await apiGet<ApiUser[] | PaginatedResponse<ApiUser>>('/api/v1/users')
    return normalizeUserCollection(response)
  },
  async byId(id: string) {
    const response = await apiGet<ApiUser>(`/api/v1/users/${id}`)
    return normalizeUser(response)
  },
  async updateStatus(id: string, payload: UserStatusPayload) {
    const response = await apiPatch<ApiUser, UserStatusPayload>(
      `/api/v1/users/${id}/status`,
      payload,
    )
    return normalizeUser(response)
  },
  async updateRoles(id: string, payload: UserRolesPayload) {
    const response = await apiPatch<ApiUser, UserRolesPayload>(
      `/api/v1/users/${id}/roles`,
      payload,
    )
    return normalizeUser(response)
  },
}
