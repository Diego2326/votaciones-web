import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useJoinStore } from '@/app/store/join.store'
import type { TournamentAccessMode } from '@/core/types/domain'
import { joinApi } from '@/features/join/api/joinApi'
import type {
  JoinByAuthPayload,
  JoinByNamePayload,
  JoinByPinPayload,
  JoinByQrPayload,
} from '@/features/join/types/join.types'

export function useJoinAccessInfo(pin?: string, qrToken?: string) {
  return useQuery({
    queryKey: ['join', 'access-info', pin ?? null, qrToken ?? null],
    queryFn: () =>
      pin ? joinApi.pinInfo({ pin } as JoinByPinPayload) : joinApi.qrInfo({ qrToken: qrToken! }),
    enabled: Boolean(pin || qrToken),
  })
}

export function useJoinByName() {
  return useMutation({
    mutationFn: (payload: JoinByNamePayload) => joinApi.joinByName(payload),
  })
}

export function useJoinByAuth() {
  return useMutation({
    mutationFn: (payload: JoinByAuthPayload) => joinApi.joinByAuth(payload),
  })
}

export function useJoinByQr() {
  return useMutation({
    mutationFn: (payload: JoinByQrPayload) => joinApi.joinByQr(payload),
  })
}

export function useTournamentSessionProfile() {
  const sessionToken = useJoinStore((state) => state.sessionToken)

  return useQuery({
    queryKey: ['join', 'me'],
    queryFn: joinApi.sessionMe,
    enabled: Boolean(sessionToken),
    retry: false,
    staleTime: 1000 * 30,
  })
}

export function useTournamentAccess(tournamentId: string) {
  return useQuery({
    queryKey: ['tournaments', tournamentId, 'access'],
    queryFn: () => joinApi.getAccess(tournamentId),
    enabled: Boolean(tournamentId),
  })
}

export function useUpdateTournamentAccess(tournamentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mode: TournamentAccessMode) => joinApi.updateAccess(tournamentId, { mode }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId, 'access'] })
      void queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId] })
    },
  })
}

export function useRegenerateTournamentPin(tournamentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => joinApi.regeneratePin(tournamentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId, 'access'] })
    },
  })
}
