import { useQuery } from '@tanstack/react-query'

import { tournamentApi } from '@/features/tournaments/api/tournamentApi'

export function useTournaments() {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: tournamentApi.list,
  })
}
