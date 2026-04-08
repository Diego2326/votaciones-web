import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { toAppError } from '@/core/utils/errors'
import { useMatches } from '@/features/matches/hooks/useMatches'

export function VoterRoundPage() {
  const { id = '' } = useParams()
  const matchesQuery = useMatches(id)

  if (matchesQuery.isLoading) {
    return <Loader label="Cargando matches..." />
  }

  if (matchesQuery.isError) {
    return <PageError message={toAppError(matchesQuery.error).message} />
  }

  const matches = matchesQuery.data ?? []

  return (
    <div className="card-grid">
      {matches.length === 0 ? (
        <Card>
          <EmptyState
            title="No hay matches disponibles"
            description="La ronda aun no tiene enfrentamientos abiertos."
          />
        </Card>
      ) : (
        matches.map((match) => (
          <Card key={match.id}>
            <div className="stack">
              <h3>
                {match.participantAName ?? 'Pendiente'} vs {match.participantBName ?? 'Pendiente'}
              </h3>
              <Link to={`/vote/matches/${match.id}`}>
                <Button>Votar</Button>
              </Link>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
