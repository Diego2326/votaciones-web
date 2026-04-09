import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { roundApi } from '@/features/rounds/api/roundApi'
import type { RoundPayload } from '@/features/rounds/types/round.types'

export function useRounds(tournamentId: string) {
  return useQuery({
    queryKey: ['rounds', tournamentId],
    queryFn: () => roundApi.list(tournamentId),
    enabled: Boolean(tournamentId),
  })
}

export function useRound(id: string) {
  return useQuery({
    queryKey: ['round', id],
    queryFn: () => roundApi.byId(id),
    enabled: Boolean(id),
  })
}

export function useCreateRound(tournamentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RoundPayload) => roundApi.create(tournamentId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['rounds', tournamentId] })
    },
  })
}

export function useGenerateRounds(tournamentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payloads: RoundPayload[]) => {
      const createdRounds = []

      for (const payload of payloads) {
        createdRounds.push(await roundApi.create(tournamentId, payload))
      }

      return createdRounds
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['rounds', tournamentId] })
      void queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId] })
    },
  })
}

export function useRoundResults(id: string) {
  return useQuery({
    queryKey: ['round-results', id],
    queryFn: () => roundApi.results(id),
    enabled: Boolean(id),
  })
}

function useRoundAction(id: string, mutationFn: (id: string) => Promise<unknown>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => mutationFn(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['round', id] })
      void queryClient.invalidateQueries({ queryKey: ['round-results', id] })
      void queryClient.invalidateQueries({ queryKey: ['matches', id] })
    },
  })
}

export const useOpenRound = (id: string) => useRoundAction(id, roundApi.open)
export const useCloseRound = (id: string) => useRoundAction(id, roundApi.close)
export const useProcessRound = (id: string) => useRoundAction(id, roundApi.process)
export const usePublishRoundResults = (id: string) =>
  useRoundAction(id, roundApi.publishResults)
