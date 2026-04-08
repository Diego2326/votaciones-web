import { useParams } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { MatchForm } from '@/features/matches/components/MatchForm'
import { useCreateMatch, useMatches } from '@/features/matches/hooks/useMatches'
import { useParticipants } from '@/features/participants/hooks/useParticipants'
import { toAppError } from '@/core/utils/errors'
import { useRound } from '@/features/rounds/hooks/useRounds'

export function MatchesPage() {
  const { id = '' } = useParams()
  const matchesQuery = useMatches(id)
  const createMutation = useCreateMatch(id)
  const roundQuery = useRound(id)
  const roundParticipantsQuery = useParticipants(roundQuery.data?.tournamentId ?? '')

  if (matchesQuery.isLoading) {
    return <Loader label="Cargando enfrentamientos..." />
  }

  if (matchesQuery.isError) {
    return <PageError message={toAppError(matchesQuery.error).message} />
  }

  const participantOptions =
    roundParticipantsQuery.data?.map((participant) => ({
      value: participant.id,
      label: participant.name,
    })) ?? []

  return (
    <div className="stack">
      <Card>
        <MatchForm
          participantOptions={participantOptions}
          isSubmitting={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values)}
        />
      </Card>
      <div className="card-grid">
        {(matchesQuery.data ?? []).length === 0 ? (
          <Card>
            <EmptyState
              title="Sin enfrentamientos"
              description="Crea los primeros matches dentro de esta ronda."
            />
          </Card>
        ) : (
          matchesQuery.data?.map((match) => (
            <Card key={match.id}>
              <div className="stack">
                <div>
                  <p className="eyebrow">Match</p>
                  <h3>
                    {match.participantAName ?? 'Pendiente'} vs{' '}
                    {match.participantBName ?? 'Pendiente'}
                  </h3>
                </div>
                <span>Estado: {match.status}</span>
                <Button variant="secondary">Ver detalle</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
