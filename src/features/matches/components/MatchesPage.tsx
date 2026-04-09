import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

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

export function MatchesPage() {
  const { id = '' } = useParams()
  const matchesQuery = useMatches(id)
  const createMutation = useCreateMatch(id)
  const assignWinnerMutation = useAssignWinner(id)
  const roundQuery = useRound(id)
  const roundParticipantsQuery = useParticipants(roundQuery.data?.tournamentId ?? '')

  if (matchesQuery.isLoading || roundQuery.isLoading || roundParticipantsQuery.isLoading) {
    return <Loader label="Cargando enfrentamientos..." />
  }

  if (matchesQuery.isError || roundQuery.isError || roundParticipantsQuery.isError) {
    return (
      <PageError
        message={toAppError(matchesQuery.error ?? roundQuery.error ?? roundParticipantsQuery.error).message}
      />
    )
  }

  const participantOptions =
    roundParticipantsQuery.data?.map((participant) => ({
      value: participant.id,
      label: participant.name,
    })) ?? []
  const matches = matchesQuery.data ?? []

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
              disabled={createMutation.isPending}
              onClick={() => createMutation.mutate({ autoGenerate: true })}
            >
              Generar automaticamente
            </Button>
          </div>
        </div>
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
              description="Crea los primeros matches dentro de esta ronda."
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
