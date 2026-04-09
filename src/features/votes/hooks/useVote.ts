import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useJoinStore } from '@/app/store/join.store'
import { voteApi } from '@/features/votes/api/voteApi'
import type { VotePayload } from '@/features/votes/types/vote.types'

export const useMatchVote = (matchId: string) =>
  useQuery({
    queryKey: ['vote', 'match', matchId],
    queryFn: () => voteApi.matchDetails(matchId),
    enabled: Boolean(matchId),
  })

export function useMyVote(matchId: string) {
  const sessionToken = useJoinStore((state) => state.sessionToken)

  return useQuery({
    queryKey: ['vote', 'my-vote', matchId, sessionToken ?? null],
    queryFn: () => voteApi.getMyVote(matchId),
    enabled: Boolean(matchId && sessionToken),
  })
}

export function useVote(matchId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VotePayload) => voteApi.submitVote(matchId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['vote', 'my-vote', matchId] })
      void queryClient.invalidateQueries({ queryKey: ['vote', 'results', matchId] })
      void queryClient.invalidateQueries({ queryKey: ['round-results'] })
    },
  })
}

export const useMatchResults = (matchId: string) =>
  useQuery({
    queryKey: ['vote', 'results', matchId],
    queryFn: () => voteApi.getMatchResults(matchId),
    enabled: Boolean(matchId),
  })

export const useTournamentResults = (tournamentId: string) =>
  useQuery({
    queryKey: ['vote', 'tournament-results', tournamentId],
    queryFn: () => voteApi.getTournamentResults(tournamentId),
    enabled: Boolean(tournamentId),
  })
