import { apiGet } from '@/core/api/client'
import type { AuditLog } from '@/core/types/domain'

export const auditApi = {
  list() {
    return apiGet<AuditLog[]>('/api/v1/audit')
  },
  byTournament(tournamentId: string) {
    return apiGet<AuditLog[]>(`/api/v1/tournaments/${tournamentId}/audit`)
  },
}
