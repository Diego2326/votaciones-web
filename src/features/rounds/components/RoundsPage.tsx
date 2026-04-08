import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { toAppError } from '@/core/utils/errors'
import { RoundForm } from '@/features/rounds/components/RoundForm'
import { useCreateRound, useRounds } from '@/features/rounds/hooks/useRounds'

export function RoundsPage() {
  const { id = '' } = useParams()
  const roundsQuery = useRounds(id)
  const createMutation = useCreateRound(id)

  if (roundsQuery.isLoading) {
    return <Loader label="Cargando rondas..." />
  }

  if (roundsQuery.isError) {
    return <PageError message={toAppError(roundsQuery.error).message} />
  }

  const rounds = roundsQuery.data ?? []

  return (
    <div className="stack">
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
            <Card key={round.id}>
              <div className="stack">
                <div className="split-line">
                  <div>
                    <p className="eyebrow">Ronda {round.sequence}</p>
                    <h3>{round.name}</h3>
                  </div>
                  <span>{round.status}</span>
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
