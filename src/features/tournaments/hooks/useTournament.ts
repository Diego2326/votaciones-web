import { useQuery } from '@tanstack/react-query'

import { tournamentApi } from '@/features/tournaments/api/tournamentApi'

export function useTournament(id: string) {
  return useQuery({
    queryKey: ['tournaments', id],
    queryFn: () => tournamentApi.byId(id),
    enabled: Boolean(id),
  })
}
