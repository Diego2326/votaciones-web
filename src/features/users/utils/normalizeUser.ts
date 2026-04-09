import type { PaginatedResponse } from '@/core/types/api'
import { mapCollection } from '@/core/utils/collections'
import type { User } from '@/core/types/domain'

export type ApiUser = User

export function normalizeUser(user: ApiUser): User {
  const derivedFullName =
    user.fullName ?? ([user.firstName, user.lastName].filter(Boolean).join(' ').trim() || undefined)

  return {
    ...user,
    ...(derivedFullName ? { fullName: derivedFullName } : {}),
  }
}

export function normalizeUserCollection(payload: ApiUser[] | PaginatedResponse<ApiUser>) {
  return mapCollection(payload, normalizeUser)
}
