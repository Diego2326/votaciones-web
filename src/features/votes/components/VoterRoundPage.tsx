import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageError } from '@/components/feedback/PageError'
import { Badge } from '@/components/ui/Badge'
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
    <div className="stack">
      <div>
        <p className="eyebrow">Combates disponibles</p>
        <h1>Selecciona tu duelo</h1>
        <p>Elige un enfrentamiento abierto para lanzar tu voto.</p>
      </div>
      <div className="card-grid">
        {matches.length === 0 ? (
          <Card className="arena-mode-card">
            <EmptyState
              title="No hay matches disponibles"
              description="La ronda aun no tiene enfrentamientos abiertos."
            />
          </Card>
        ) : (
          matches.map((match) => (
            <Card key={match.id} className="arena-match-card">
              <div className="stack">
                <div className="split-line">
                  <Badge tone={match.status === 'OPEN' ? 'success' : 'neutral'}>{match.status}</Badge>
                  {match.winner ? <span className="label-muted">Ganador: {match.winner.name}</span> : null}
                </div>
                <div className="arena-versus-line">
                  <div className="arena-fighter">
                    <span className="arena-avatar">
                      {match.participantA?.imageUrl ? (
                        <img src={match.participantA.imageUrl} alt={match.participantAName ?? 'Participante A'} />
                      ) : (
                        <span>{(match.participantAName ?? 'A').slice(0, 1).toUpperCase()}</span>
                      )}
                    </span>
                    <strong>{match.participantAName ?? 'Pendiente'}</strong>
                  </div>
                  <span className="arena-versus-badge">VS</span>
                  <div className="arena-fighter">
                    <span className="arena-avatar">
                      {match.participantB?.imageUrl ? (
                        <img src={match.participantB.imageUrl} alt={match.participantBName ?? 'Participante B'} />
                      ) : (
                        <span>{(match.participantBName ?? 'B').slice(0, 1).toUpperCase()}</span>
                      )}
                    </span>
                    <strong>{match.participantBName ?? 'Pendiente'}</strong>
                  </div>
                </div>
                <Link to={`/vote/matches/${match.id}`}>
                  <Button fullWidth>Ir al duelo</Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
