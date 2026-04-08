import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { matchApi } from '@/features/matches/api/matchApi'
import type { MatchPayload } from '@/features/matches/types/match.types'

export function useMatches(roundId: string) {
  return useQuery({
    queryKey: ['matches', roundId],
    queryFn: () => matchApi.list(roundId),
    enabled: Boolean(roundId),
  })
}

export function useCreateMatch(roundId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: MatchPayload) => matchApi.create(roundId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['matches', roundId] })
    },
  })
}
