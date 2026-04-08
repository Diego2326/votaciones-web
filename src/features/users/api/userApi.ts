import { apiGet, apiPatch } from '@/core/api/client'
import type { User } from '@/core/types/domain'
import type { UserRolesPayload, UserStatusPayload } from '@/features/users/types/user.types'

export const userApi = {
  list() {
    return apiGet<User[]>('/api/v1/users')
  },
  byId(id: string) {
    return apiGet<User>(`/api/v1/users/${id}`)
  },
  updateStatus(id: string, payload: UserStatusPayload) {
    return apiPatch<User, UserStatusPayload>(`/api/v1/users/${id}/status`, payload)
  },
  updateRoles(id: string, payload: UserRolesPayload) {
    return apiPatch<User, UserRolesPayload>(`/api/v1/users/${id}/roles`, payload)
  },
}
