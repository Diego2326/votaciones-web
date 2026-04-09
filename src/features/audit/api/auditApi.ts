import { apiGet } from '@/core/api/client'
import type { PaginatedResponse } from '@/core/types/api'
import {
  normalizeAuditCollection,
  type ApiAuditLog,
} from '@/features/audit/utils/normalizeAudit'

export const auditApi = {
  async list() {
    const response = await apiGet<ApiAuditLog[] | PaginatedResponse<ApiAuditLog>>('/api/v1/audit')
    return normalizeAuditCollection(response)
  },
  async byTournament(tournamentId: string) {
    const response = await apiGet<ApiAuditLog[] | PaginatedResponse<ApiAuditLog>>(
      `/api/v1/tournaments/${tournamentId}/audit`,
    )
    return normalizeAuditCollection(response)
  },
}
