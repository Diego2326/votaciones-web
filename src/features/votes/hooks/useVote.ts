import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { voteApi } from '@/features/votes/api/voteApi'
import type { VotePayload } from '@/features/votes/types/vote.types'

export const useVoterTournaments = () =>
  useQuery({
    queryKey: ['vote', 'tournaments'],
    queryFn: voteApi.publicTournaments,
  })

export const useMatchVote = (matchId: string) =>
  useQuery({
    queryKey: ['vote', 'match', matchId],
    queryFn: () => voteApi.matchDetails(matchId),
    enabled: Boolean(matchId),
  })

export const useMyVote = (matchId: string) =>
  useQuery({
    queryKey: ['vote', 'my-vote', matchId],
    queryFn: () => voteApi.getMyVote(matchId),
    enabled: Boolean(matchId),
  })

export function useVote(matchId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VotePayload) => voteApi.submitVote(matchId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['vote', 'my-vote', matchId] })
      void queryClient.invalidateQueries({ queryKey: ['vote', 'results', matchId] })
    },
  })
}

export const useTournamentResults = (tournamentId: string) =>
  useQuery({
    queryKey: ['vote', 'tournament-results', tournamentId],
    queryFn: () => voteApi.getTournamentResults(tournamentId),
    enabled: Boolean(tournamentId),
  })
