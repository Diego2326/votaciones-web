import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { participantApi } from '@/features/participants/api/participantApi'
import type { ParticipantPayload } from '@/features/participants/types/participant.types'

export function useParticipants(tournamentId: string) {
  return useQuery({
    queryKey: ['participants', tournamentId],
    queryFn: () => participantApi.list(tournamentId),
    enabled: Boolean(tournamentId),
  })
}

export function useCreateParticipant(tournamentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ParticipantPayload) => participantApi.create(tournamentId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['participants', tournamentId] })
    },
  })
}

export function useUpdateParticipant(tournamentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ParticipantPayload }) =>
      participantApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['participants', tournamentId] })
    },
  })
}

export function useDeleteParticipant(tournamentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: participantApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['participants', tournamentId] })
    },
  })
}
