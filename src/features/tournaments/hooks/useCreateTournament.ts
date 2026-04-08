import { useMutation, useQueryClient } from '@tanstack/react-query'

import { tournamentApi } from '@/features/tournaments/api/tournamentApi'

export function useCreateTournament() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tournamentApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
  })
}
