import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { useAuthStore } from '@/app/store/auth.store'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { MatchForm } from '@/features/matches/components/MatchForm'
import { useAssignWinner, useCreateMatch, useMatches } from '@/features/matches/hooks/useMatches'
import { useParticipants } from '@/features/participants/hooks/useParticipants'
import { toAppError } from '@/core/utils/errors'
import { useRound } from '@/features/rounds/hooks/useRounds'
import { useTournament } from '@/features/tournaments/hooks/useTournament'
import { canManageTournament } from '@/features/tournaments/utils/ownership'
import { buildEliminationAutoMatchPlan } from '@/features/matches/utils/eliminationAutoMatch'

export function MatchesPage() {
  const { id = '' } = useParams()
  const user = useAuthStore((state) => state.user)
  const matchesQuery = useMatches(id)
  const createMutation = useCreateMatch(id)
  const assignWinnerMutation = useAssignWinner(id)
  const roundQuery = useRound(id)
  const tournamentQuery = useTournament(roundQuery.data?.tournamentId ?? '')
  const roundParticipantsQuery = useParticipants(roundQuery.data?.tournamentId ?? '')

  if (matchesQuery.isLoading || roundQuery.isLoading || roundParticipantsQuery.isLoading || tournamentQuery.isLoading) {
    return <Loader label="Cargando enfrentamientos..." />
  }

  if (matchesQuery.isError || roundQuery.isError || roundParticipantsQuery.isError || tournamentQuery.isError) {
    return (
      <PageError
        message={
          toAppError(
            matchesQuery.error ?? roundQuery.error ?? roundParticipantsQuery.error ?? tournamentQuery.error,
          ).message
        }
      />
    )
  }

  if (!canManageTournament(user, tournamentQuery.data)) {
    return (
      <PageError
        title="No puedes administrar estos matches"
        message="Los organizadores solo pueden ver matches de torneos propios."
      />
    )
  }

  const participantOptions =
    roundParticipantsQuery.data?.map((participant) => ({
      value: participant.id,
      label: participant.name,
    })) ?? []
  const matches = matchesQuery.data ?? []
  const isEliminationTournament = tournamentQuery.data?.type === 'ELIMINATION'
  const eliminationAutoPlan = isEliminationTournament
    ? buildEliminationAutoMatchPlan({
        participants: roundParticipantsQuery.data ?? [],
        matches,
      })
    : null
  const createErrorMessage = createMutation.isError ? toAppError(createMutation.error).message : null

  return (
    <div className="stack">
      <Card>
        <div className="page-header">
          <div>
            <p className="eyebrow">Ejecucion</p>
            <h1>{roundQuery.data?.name ?? 'Matches'}</h1>
          </div>
          <div className="table-actions">
            {roundQuery.data ? (
              <Link to={`/tournaments/${roundQuery.data.tournamentId}/rounds`}>
                <Button variant="ghost">Volver a rondas</Button>
              </Link>
            ) : null}
            <Button
              variant="secondary"
              disabled={createMutation.isPending || Boolean(isEliminationTournament && !eliminationAutoPlan?.payload)}
              onClick={() => {
                if (isEliminationTournament) {
                  if (!eliminationAutoPlan?.payload) {
                    return
                  }

                  createMutation.mutate(eliminationAutoPlan.payload)
                  return
                }

                createMutation.mutate({ autoGenerate: true })
              }}
            >
              {isEliminationTournament ? 'Generar siguiente duelo' : 'Generar automaticamente'}
            </Button>
          </div>
        </div>
        {isEliminationTournament && eliminationAutoPlan?.message ? (
          <p className="label-muted">{eliminationAutoPlan.message}</p>
        ) : null}
        {createErrorMessage ? (
          <PageError title="No se pudo crear el match" message={createErrorMessage} />
        ) : null}
        <MatchForm
          participantOptions={participantOptions}
          isSubmitting={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values)}
        />
      </Card>
      <div className="card-grid">
        {matches.length === 0 ? (
          <Card>
            <EmptyState
              title="Sin enfrentamientos"
              description="Sin matches."
            />
          </Card>
        ) : (
          matches.map((match) => (
            <Card key={match.id}>
              <div className="stack">
                <div className="split-line">
                  <div>
                    <p className="eyebrow">Match</p>
                    <h3>
                      {match.participantAName ?? 'Pendiente'} vs{' '}
                      {match.participantBName ?? 'Pendiente'}
                    </h3>
                  </div>
                  <Badge tone={match.status === 'RESOLVED' ? 'success' : 'neutral'}>
                    {match.status}
                  </Badge>
                </div>
                {match.winner ? <p>Ganador: {match.winner.name}</p> : null}
                <div className="inline-group">
                  <Button
                    variant="ghost"
                    disabled={!match.participantAId || assignWinnerMutation.isPending}
                    onClick={() =>
                      match.participantAId &&
                      assignWinnerMutation.mutate({
                        id: match.id,
                        winnerId: match.participantAId,
                      })
                    }
                  >
                    Gana {match.participantAName ?? 'A'}
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={!match.participantBId || assignWinnerMutation.isPending}
                    onClick={() =>
                      match.participantBId &&
                      assignWinnerMutation.mutate({
                        id: match.id,
                        winnerId: match.participantBId,
                      })
                    }
                  >
                    Gana {match.participantBName ?? 'B'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
