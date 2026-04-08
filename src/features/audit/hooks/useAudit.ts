import { useQuery } from '@tanstack/react-query'

import { auditApi } from '@/features/audit/api/auditApi'

export function useAudit(tournamentId?: string) {
  return useQuery({
    queryKey: ['audit', tournamentId ?? 'all'],
    queryFn: () => (tournamentId ? auditApi.byTournament(tournamentId) : auditApi.list()),
  })
}
