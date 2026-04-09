import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { toAppError } from '@/core/utils/errors'
import { RoundForm } from '@/features/rounds/components/RoundForm'
import { useCreateRound, useRounds } from '@/features/rounds/hooks/useRounds'
import { useTournament } from '@/features/tournaments/hooks/useTournament'
import { TournamentWorkspaceNav } from '@/features/tournaments/components/TournamentWorkspaceNav'

export function RoundsPage() {
  const { id = '' } = useParams()
  const tournamentQuery = useTournament(id)
  const roundsQuery = useRounds(id)
  const createMutation = useCreateRound(id)

  if (roundsQuery.isLoading || tournamentQuery.isLoading) {
    return <Loader label="Cargando rondas..." />
  }

  if (roundsQuery.isError || tournamentQuery.isError || !tournamentQuery.data) {
    return <PageError message={toAppError(roundsQuery.error ?? tournamentQuery.error).message} />
  }

  const rounds = roundsQuery.data ?? []
  const tournament = tournamentQuery.data

  return (
    <div className="stack">
      <TournamentWorkspaceNav tournamentId={id} tournamentName={tournament.name} />
      <div>
        <p className="eyebrow">Estructura</p>
        <h1>Rondas del torneo</h1>
        <p>
          Desde aqui defines el avance del torneo y abres la secuencia real de enfrentamientos.
        </p>
      </div>
      <Card>
        <RoundForm
          isSubmitting={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values)}
        />
      </Card>
      <div className="card-grid">
        {rounds.length === 0 ? (
          <Card>
            <EmptyState
              title="No hay rondas"
              description="Crea la primera ronda para abrir el proceso de votacion."
            />
          </Card>
        ) : (
          rounds.map((round) => (
            <Card key={round.id} className="workspace-panel">
              <div className="stack">
                <div className="split-line">
                  <div>
                    <p className="eyebrow">Ronda {round.roundNumber}</p>
                    <h3>{round.name}</h3>
                    <p className="label-muted">
                      {round.opensAt ? `Abre ${round.opensAt}` : 'Sin apertura definida'}
                    </p>
                  </div>
                  <Badge tone={round.status === 'OPEN' ? 'success' : 'neutral'}>{round.status}</Badge>
                </div>
                <div className="inline-group">
                  <Link to={`/rounds/${round.id}`}>
                    <Button variant="secondary">Detalle</Button>
                  </Link>
                  <Link to={`/rounds/${round.id}/matches`}>
                    <Button>Matches</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
