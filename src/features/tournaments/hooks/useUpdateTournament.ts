import { useMutation, useQueryClient } from '@tanstack/react-query'

import { tournamentApi } from '@/features/tournaments/api/tournamentApi'
import type { TournamentPayload } from '@/features/tournaments/types/tournament.types'

export function useUpdateTournament(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TournamentPayload) => tournamentApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      void queryClient.invalidateQueries({ queryKey: ['tournaments', id] })
    },
  })
}
