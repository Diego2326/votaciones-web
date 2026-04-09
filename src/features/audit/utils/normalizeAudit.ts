import type { PaginatedResponse } from '@/core/types/api'
import { mapCollection } from '@/core/utils/collections'
import type { AuditLog } from '@/core/types/domain'

export type ApiAuditLog = AuditLog

export function normalizeAudit(log: ApiAuditLog): AuditLog {
  return {
    ...log,
    details: log.details ?? null,
  }
}

export function normalizeAuditCollection(
  payload: ApiAuditLog[] | PaginatedResponse<ApiAuditLog>,
) {
  return mapCollection(payload, normalizeAudit)
}
